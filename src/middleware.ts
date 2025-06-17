import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const authRoutes = ['/auth/login', '/auth/register', '/auth/otp'];
const protectedRoutes = [
  '/book-call', '/cart', '/hilop-coins', '/how-it-works', '/my-order',
  '/prescription', '/profile', '/services', '/support', '/user-profile',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static & API paths
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get('accessToken')?.value;
  const isAuthenticated = !!token;

  // 🔒 If login/register and already logged in → redirect to "/"
  if (isAuthenticated && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 🔐 If protected route and NOT logged in → redirect to /auth/login
  if (!isAuthenticated && protectedRoutes.some(route => pathname.startsWith(route))) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico).*)'],
};
