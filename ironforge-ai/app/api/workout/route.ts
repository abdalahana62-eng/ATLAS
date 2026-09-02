import { NextRequest } from 'next/server';
import { workoutPlanPrompt } from '@/lib/ai/prompts';
import { createChatCompletion, extractJSONFromResponse } from '@/lib/ai/openai';

export const runtime = 'nodejs';

interface WorkoutRequest {
  goal: 'muscle_gain' | 'fat_loss' | 'recomposition' | 'strength' | 'fitness' | 'maintenance';
  level: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  split_preference?: string;
  days_per_week: number;
  equipment: 'full_gym' | 'home_gym' | 'limited' | 'bodyweight';
  injuries?: string[];
  user_weight_kg?: number;
  locale?: 'en' | 'ar';
}

export async function POST(req: NextRequest) {
  try {
    const body: WorkoutRequest = await req.json();

    const {
      goal,
      level,
      split_preference,
      days_per_week,
      equipment,
      injuries,
      user_weight_kg,
    } = body;

    if (!goal || !level || !days_per_week || !equipment) {
      return Response.json(
        {
          error:
            'Missing required fields: goal, level, days_per_week, equipment',
        },
        { status: 400 }
      );
    }

    const userData = JSON.stringify({
      goal,
      level,
      split_preference: split_preference ?? 'auto',
      days_per_week,
      equipment,
      injuries: injuries ?? [],
      user_weight_kg: user_weight_kg ?? 80,
    });

    const completion = await createChatCompletion(
      [
        { role: 'system', content: workoutPlanPrompt },
        {
          role: 'user',
          content: `Design a workout plan for this user profile:\n\n${userData}`,
        },
      ],
      {
        temperature: 0.5,
        responseFormat: { type: 'json_object' },
        maxTokens: 4000,
      }
    );

    const content = completion.choices[0]?.message?.content ?? '';
    const result = extractJSONFromResponse(content);

    return Response.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Workout API error:', error);
    return Response.json(
      { error: error?.message ?? 'Failed to generate workout plan' },
      { status: 500 }
    );
  }
}
