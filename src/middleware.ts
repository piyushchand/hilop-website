import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = [
  '/profile',
  '/my-order',
  '/cart',
  '/prescription',
  '/hilop-coins',
  '/book-call'
];

// Define auth routes that should redirect if user is already authenticated
const authRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/otp'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  // Get authentication status from cookies
  const isAuthenticated = request.cookies.has('is_authenticated');
  const hasAccessToken = request.cookies.has('accessToken');
  
  // If user is not authenticated and trying to access protected route
  if (isProtectedRoute && (!isAuthenticated || !hasAccessToken)) {
    console.log(`🚫 Access denied to protected route: ${pathname}`);
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  // If user is authenticated and trying to access auth routes, redirect to home
  if (isAuthRoute && isAuthenticated && hasAccessToken) {
    console.log(`🔄 Authenticated user redirected from auth route: ${pathname}`);
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // Continue with the request
  return NextResponse.next();
}

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
