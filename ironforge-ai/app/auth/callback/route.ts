import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

// Google OAuth callback: /auth/callback?code=...&next=/ar/onboarding
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/ar/onboarding';

  const oauthError = searchParams.get('error');
  const oauthDesc = searchParams.get('error_description');
  if (oauthError) {
    return NextResponse.redirect(
      `${origin}/ar/auth/login?error=${encodeURIComponent(oauthDesc || oauthError)}`
    );
  }
  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    return NextResponse.redirect(
      `${origin}/ar/auth/login?error=${encodeURIComponent(error.message)}`
    );
  }
  return NextResponse.redirect(`${origin}/ar/auth/login`);
}
