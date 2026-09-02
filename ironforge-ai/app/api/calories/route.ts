import { NextRequest } from 'next/server';
import { calorieCalculatorPrompt } from '@/lib/ai/prompts';
import { createChatCompletion, extractJSONFromResponse } from '@/lib/ai/openai';

export const runtime = 'nodejs';

interface CaloriesRequest {
  age: number;
  gender: 'male' | 'female';
  height_cm: number;
  weight_kg: number;
  activity_level: 'sedentary' | 'light' | 'moderate' | 'very' | 'extra';
  goal: 'cutting' | 'bulking' | 'recomposition' | 'strength' | 'maintenance' | 'fitness';
}

export async function POST(req: NextRequest) {
  try {
    const body: CaloriesRequest = await req.json();

    const { age, gender, height_cm, weight_kg, activity_level, goal } = body;

    if (
      !age ||
      !gender ||
      !height_cm ||
      !weight_kg ||
      !activity_level ||
      !goal
    ) {
      return Response.json(
        { error: 'Missing required fields: age, gender, height_cm, weight_kg, activity_level, goal' },
        { status: 400 }
      );
    }

    const userData = JSON.stringify({
      age,
      gender,
      height_cm,
      weight_kg,
      activity_level,
      goal,
    });

    const completion = await createChatCompletion(
      [
        { role: 'system', content: calorieCalculatorPrompt },
        {
          role: 'user',
          content: `Calculate calories and macros for this user data:\n\n${userData}`,
        },
      ],
      {
        temperature: 0.1,
        responseFormat: { type: 'json_object' },
        maxTokens: 500,
      }
    );

    const content = completion.choices[0]?.message?.content ?? '';
    const result = extractJSONFromResponse(content);

    return Response.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Calories API error:', error);
    return Response.json(
      { error: error?.message ?? 'Failed to calculate calories' },
      { status: 500 }
    );
  }
}
