import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request: NextRequest) {
  const authTokenCookie = request.cookies.get('auth_token');
  const { pathname } = request.nextUrl;

  if (!authTokenCookie && pathname.startsWith('/admin')) {
    const loginUrl = new URL('/secret-login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (authTokenCookie) {
    try {
      await jwtVerify(authTokenCookie.value, secret);
      
      if (pathname === '/secret-login') {
        const adminUrl = new URL('/admin', request.url);
        return NextResponse.redirect(adminUrl);
      }

      return NextResponse.next();

    } catch (err) {
      console.log("JWT Verification failed:", err);
      
      if (pathname.startsWith('/admin')) {
         const loginUrl = new URL('/secret-login', request.url);
         const response = NextResponse.redirect(loginUrl);
         response.cookies.delete('auth_token');
         return response;
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/secret-login'],
};
