import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  try {
    // Refresh session if expired
    const { data: { session: initialSession } } = await supabase.auth.getSession();

    // Check if the route requires authentication
    const requiresAuth = !req.nextUrl.pathname.startsWith('/auth') &&
      !req.nextUrl.pathname.startsWith('/_next') &&
      !req.nextUrl.pathname.startsWith('/favicon.ico') &&
      !req.nextUrl.pathname.startsWith('/public') &&
      req.nextUrl.pathname !== '/' &&
      req.nextUrl.pathname !== '/events';


    if (requiresAuth) {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        const redirectUrl = req.nextUrl.clone();
        const signinUrl = new URL('/auth/signin', req.url);
        signinUrl.searchParams.set('next', redirectUrl.pathname);
        return NextResponse.redirect(signinUrl);
      }
    }

    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    return res;
  }
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
     * - events page (/events)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|auth|events|$).*)',
  ],
}; 