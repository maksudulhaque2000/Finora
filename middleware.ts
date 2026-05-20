import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { sessionCookieName } from '@/lib/auth-cookies';
import { authSecret } from '@/lib/auth-secret';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: authSecret, cookieName: sessionCookieName });

  if (token) {
    return NextResponse.next();
  }

  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('callbackUrl', `${request.nextUrl.pathname}${request.nextUrl.search}`);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/dashboard/:path*', '/income/:path*', '/expenses/:path*', '/assets/:path*', '/liabilities/:path*', '/reports/:path*', '/categories/:path*', '/settings/:path*']
};