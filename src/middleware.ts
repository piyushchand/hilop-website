import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { logger } from '@/utils/logger';

// Define auth routes that should redirect to dashboard when logged in
const authRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/otp'
] as const;

const protectedRoutes = [
  '/book-call',        
  '/cart',
  '/hilop-coins',
  '/how-it-works',
  '/my-order',
  '/prescription',
  '/profile',
  '/services',
  '/support',
  '/user-profile',
] as const;

export function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    
    // Skip middleware for static files and API routes
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api/auth') ||
      pathname.startsWith('/static') ||
      pathname.includes('.')
    ) {
      return NextResponse.next();
    }

    // Get token from cookies
    const token = request.cookies.get('auth_token')?.value;
    const isAuthenticated = !!token;

    // Log the request for debugging
    logger.info('Middleware processing request', {
      path: pathname,
      isAuthenticated,
      timestamp: new Date().toISOString()
    });

    // Handle auth routes (login, register, otp)
    if (isAuthenticated && authRoutes.some(route => pathname.startsWith(route))) {
      logger.info('Redirecting authenticated user to dashboard', { from: pathname });
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Handle protected routes
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
      if (!isAuthenticated) {
        logger.info('Redirecting to login', { from: pathname });
        // Store the original URL to redirect back after login
        const url = new URL('/auth/login', request.url);
        url.searchParams.set('from', pathname);
        return NextResponse.redirect(url);
      }
    }

    // Allow access to public routes and authenticated routes
    return NextResponse.next();
  } catch (error) {
    logger.error('Middleware error:', error);
    // On error, allow the request to proceed to avoid blocking legitimate traffic
    return NextResponse.next();
  }
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/((?!api/auth|_next|_static|favicon.ico|sitemap.xml).*)',
  ],
}; 