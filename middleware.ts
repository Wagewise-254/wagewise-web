// src/middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

// Function to create a Supabase client for middleware
const createSupabaseMiddlewareClient = (req: NextRequest, res: NextResponse) => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          res.cookies.set(name, value, options);
        },
        remove(name: string, options: CookieOptions) {
          res.cookies.set(name, '', options);
        },
      },
    }
  );
};

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createSupabaseMiddlewareClient(req, res);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;

  // If user is not logged in and tries to access a protected route, redirect to login
  if (!session && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // If user is logged in, handle role-based redirects
  if (session) {
    const userRole = session.user.user_metadata.role;

    // Redirect owner to their specific dashboard
    if (userRole === 'owner' && !pathname.startsWith('/dashboard/owner')) {
         if(pathname.startsWith('/dashboard/')){
             return NextResponse.redirect(new URL('/dashboard/owner', req.url));
         }
    }
    // You can add more role checks here later (e.g., admin, hr)
    // else if (userRole === 'hr' && !pathname.startsWith('/dashboard/hr')) {
    //   return NextResponse.redirect(new URL('/dashboard/hr', req.url));
    // }
  }


  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth (auth routes like /auth/callback)
     * - public assets like icons
     */
    '/((?!api|_next/static|_next/image|favicon.ico|auth).*)',
  ],
};