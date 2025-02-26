import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_SECRET!;

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res }, {supabaseUrl, supabaseKey});

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If user is not signed in and the current path is not /auth/signin,
  // redirect the user to /auth/signin
  if (!session && !req.nextUrl.pathname.startsWith('/auth')) {
    const redirectUrl = req.nextUrl.clone();
    const signinUrl = new URL('/auth/signin', req.url);
    // Add the original URL as a "next" parameter
    signinUrl.searchParams.set('next', redirectUrl.pathname);
    return NextResponse.redirect(signinUrl);
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - auth related paths (we don't want to redirect these)
     * - root homepage (/)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|auth|$).*)',
  ],
}; 