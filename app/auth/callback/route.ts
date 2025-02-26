import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  console.log('Auth callback triggered');
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/create-event';
  
  console.log('Auth callback params:', { code: !!code, next });

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    try {
      console.log('Exchanging code for session...');
      const { data: { session }, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (sessionError || !session) {
        console.error('Session error:', sessionError);
        throw new Error('Failed to get session after code exchange');
      }

      console.log('Session obtained successfully:', { 
        userId: session.user.id,
        expiresAt: session.expires_at
      });

      // Double check the session is stored
      const { data: { session: checkSession } } = await supabase.auth.getSession();
      console.log('Session check:', { hasSession: !!checkSession });

      // Successful authentication, redirect to the requested page
      const redirectUrl = new URL(next, requestUrl.origin);
      console.log('Redirecting to:', redirectUrl.toString());
      
      return NextResponse.redirect(redirectUrl);

    } catch (error) {
      console.error('Auth error:', error);
      // Redirect to sign in page on error
      return NextResponse.redirect(new URL('/auth/signin?error=Authentication failed', requestUrl.origin));
    }
  }

  console.log('No auth code present, redirecting to signin');
  return NextResponse.redirect(new URL('/auth/signin', requestUrl.origin));
} 