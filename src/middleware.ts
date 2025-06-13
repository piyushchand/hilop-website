import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { logger } from '@/utils/logger';

// Define protected routes that require authentication
const protectedRoutes = [
  '/cart',
  '/hilop-coins',
  '/my-order',
  '/prescription',
  '/profile'
] as const;

// Define auth routes that should not be accessible when logged in
const authRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/otp'
] as const;

export function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    
    // Get auth token from cookies
    const authToken = request.cookies.get('auth_token')?.value;
    const isAuthenticated = !!authToken;

    // Check if trying to access protected route while not authenticated
    if (protectedRoutes.some(route => pathname.startsWith(route)) && !isAuthenticated) {
      logger.info('Redirecting to login', { from: pathname });
      const url = new URL('/auth/login', request.url);
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }

    // Check if trying to access auth routes while authenticated
    if (authRoutes.some(route => pathname.startsWith(route)) && isAuthenticated) {
      logger.info('Redirecting authenticated user to home', { from: pathname });
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    logger.error('Middleware error', error);
    // On error, allow the request to proceed to avoid blocking legitimate traffic
    return NextResponse.next();
  }
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 