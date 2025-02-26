import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/create-event';

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    
    try {
      await supabase.auth.exchangeCodeForSession(code);
      
      // Get the session to confirm it worked
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Failed to get session after code exchange');
      }
      
      // Successful authentication, redirect to the requested page
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_ORIGIN}${next}`);
    } catch (error) {
      console.error('Auth error:', error);
      // Redirect to sign in page on error
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_ORIGIN}/auth/signin?error=Authentication failed`);
    }
  }

  // No code present, redirect to sign in
  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_ORIGIN}/auth/signin`);
} 