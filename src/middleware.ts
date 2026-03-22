import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Admin routes — will add auth check later
  if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
    // TODO: Check admin session
    return NextResponse.next();
  }

  // Staff routes
  if (path.startsWith('/staff') && !path.startsWith('/staff/login')) {
    // TODO: Check staff session
    return NextResponse.next();
  }

  // Protected customer routes
  if (path.startsWith('/account')) {
    // TODO: Check customer session
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/staff/:path*', '/account/:path*', '/book/:path*'],
};
