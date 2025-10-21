// middleware.ts
import { NextResponse, type NextRequest } from 'next/server';

// List of public routes that don't require authentication
const publicRoutes = ['/login'];

export function middleware(request: NextRequest) {
  // Check if the current route is public
  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );
  
  // Get authentication status from cookies
  const isAuthenticated = request.cookies.get("crm-auth");
  
  // If user is not authenticated and trying to access a protected route, redirect to login
  if (!isPublicRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // If user is authenticated and trying to access login page, redirect to dashboard
  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
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
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};