import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const getSecret = () =>
  new TextEncoder().encode(
    process.env.JWT_SECRET ?? 'greenamy-super-secret-jwt-key-2024'
  );

const protectedPaths = ['/events/create', '/profile', '/events/'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const needsAuth =
    pathname === '/events/create' ||
    pathname === '/profile' ||
    pathname.includes('/post-activity');

  if (needsAuth) {
    const token = request.cookies.get('greenamy_token')?.value;

    if (!token) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      await jwtVerify(token, getSecret());
    } catch {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/events/create', '/profile', '/events/:id/post-activity'],
};
