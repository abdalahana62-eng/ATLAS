import { NextRequest } from 'next/server';
import { onboardingCoachPrompt } from '@/lib/ai/prompts';
import { createChatCompletion } from '@/lib/ai/openai';

export const runtime = 'nodejs';

interface OnboardingNextStepRequest {
  step: number;
  responses: string[];
  last_user_message: string;
  collected_data?: Record<string, any>;
}

interface OnboardingNextStepResponse {
  next_question: string;
  next_step: number;
  is_complete: boolean;
  collected_data: Record<string, any>;
  summary?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: OnboardingNextStepRequest = await req.json();

    const { step, responses, last_user_message, collected_data } = body;

    if (step === undefined || step < 0) {
      return Response.json(
        { error: 'Current step is required' },
        { status: 400 }
      );
    }

    const conversationHistory: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      { role: 'system', content: onboardingCoachPrompt },
    ];

    if (step === 0 && responses.length === 0) {
      conversationHistory.push({
        role: 'user',
        content:
          'Start the onboarding interview with STEP 1. Ask the first question. Respond in the language the user will use - if they write in Arabic respond in Arabic, if in English respond in English. For now, ask in both languages friendly or detect they will reply in. Actually just ask in English first clearly.',
      });
    } else {
      let stepNum = 1;
      for (let i = 0; i < responses.length; i++) {
        const assistantMsg = i === 0
          ? `Please answer question ${stepNum} in the interview.`
          : `Okay, I have your answer. Now for STEP ${stepNum + 1}: question ${stepNum + 1}`;
        conversationHistory.push({ role: 'assistant', content: `Asking question ${stepNum}` });
        conversationHistory.push({ role: 'user', content: responses[i] });
        stepNum++;
      }
      conversationHistory.push({
        role: 'user',
        content: `My current answer is: ${last_user_message}. What is the next onboarding step? If we've answered all 6 steps, respond with ONBOARDING_COMPLETE plus a data summary. Otherwise ask the next single question for the appropriate step number.`,
      });
    }

    const completion = await createChatCompletion(conversationHistory, {
      temperature: 0.7,
      maxTokens: 1000,
    });

    const aiContent = completion.choices[0]?.message?.content ?? '';

    const isComplete = aiContent.includes('ONBOARDING_COMPLETE');

    const nextStep = isComplete ? step : step + 1;

    const cleanQuestion = aiContent
      .replace(/^ONBOARDING_COMPLETE\s*/i, '')
      .trim();

    const existingData = collected_data ?? {};

    return Response.json(
      {
        next_question: cleanQuestion,
        next_step: isComplete ? step : nextStep,
        is_complete: isComplete,
        collected_data: existingData,
        summary: isComplete ? cleanQuestion : undefined,
      } satisfies OnboardingNextStepResponse,
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Onboarding API error:', error);
    return Response.json(
      { error: error?.message ?? 'Failed to process onboarding step' },
      { status: 500 }
    );
  }
}
