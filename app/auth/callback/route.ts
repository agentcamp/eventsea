import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/create-event';

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (sessionError || !session) {
        console.error('Session error:', sessionError);
        throw new Error('Failed to get session after code exchange');
      }

      // Double check the session is stored
      const { data: { session: checkSession } } = await supabase.auth.getSession();
      if (!checkSession) {
        throw new Error('Session not found after code exchange');
      }

      // Successful authentication, redirect to the requested page
      const redirectUrl = new URL(next, requestUrl.origin);
      
      return NextResponse.redirect(redirectUrl);

    } catch (error) {
      console.error('Auth error:', error);
      // Redirect to sign in page on error
      return NextResponse.redirect(new URL('/auth/signin?error=Authentication failed', requestUrl.origin));
    }
  }

  return NextResponse.redirect(new URL('/auth/signin', requestUrl.origin));
} 