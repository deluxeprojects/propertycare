import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Skip login pages entirely
  if (path === '/admin/login' || path === '/staff/login' || path === '/login') {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Admin routes — require admin role
  if (path.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role === 'customer' || profile.role === 'technician') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Staff routes — require technician or admin role
  if (path.startsWith('/staff')) {
    if (!user) {
      return NextResponse.redirect(new URL('/staff/login', request.url));
    }
    const { data: staffProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!staffProfile || staffProfile.role === 'customer') {
      return NextResponse.redirect(new URL('/staff/login', request.url));
    }
  }

  // Customer protected routes
  if (path.startsWith('/account')) {
    if (!user) {
      return NextResponse.redirect(new URL(`/login?redirect=${encodeURIComponent(path)}`, request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/admin/:path*', '/staff/:path*', '/account/:path*'],
};
