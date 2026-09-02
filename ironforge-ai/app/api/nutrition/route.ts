import { NextRequest } from 'next/server';
import { nutritionPrompt } from '@/lib/ai/prompts';
import { createChatCompletion, extractJSONFromResponse } from '@/lib/ai/openai';

export const runtime = 'nodejs';

interface NutritionRequest {
  daily_calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  goal: 'cutting' | 'bulking' | 'recomposition' | 'strength' | 'maintenance' | 'fitness';
  preferences?: {
    dietary_restrictions?: string[];
    allergies?: string[];
    preferred_foods?: string[];
    disliked_foods?: string[];
  };
  meals_per_day?: number;
  locale?: 'en' | 'ar';
}

export async function POST(req: NextRequest) {
  try {
    const body: NutritionRequest = await req.json();

    const { daily_calories, macros, goal } = body;

    if (!daily_calories || !macros || !macros.protein || !macros.carbs || !macros.fat || !goal) {
      return Response.json(
        {
          error:
            'Missing required fields: daily_calories, macros { protein, carbs, fat }, goal',
        },
        { status: 400 }
      );
    }

    const userData = JSON.stringify({
      daily_calories,
      macros,
      goal,
      preferences: body.preferences ?? {
        dietary_restrictions: [],
        allergies: [],
        preferred_foods: [],
        disliked_foods: [],
      },
      meals_per_day: body.meals_per_day ?? 5,
      locale: body.locale ?? 'en',
    });

    const completion = await createChatCompletion(
      [
        { role: 'system', content: nutritionPrompt },
        {
          role: 'user',
          content: `Create a daily meal plan for this profile:\n\n${userData}`,
        },
      ],
      {
        temperature: 0.6,
        responseFormat: { type: 'json_object' },
        maxTokens: 5000,
      }
    );

    const content = completion.choices[0]?.message?.content ?? '';
    const result = extractJSONFromResponse(content);

    return Response.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Nutrition API error:', error);
    return Response.json(
      { error: error?.message ?? 'Failed to generate meal plan' },
      { status: 500 }
    );
  }
}
