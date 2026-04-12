import { NextResponse } from 'next/server';

export function middleware(request) {
  const sessionCookie = request.cookies.get('connect.sid');
  const userRole = request.cookies.get('user_role')?.value;
  const url = request.nextUrl.pathname;

  // 1. DAFTAR RUTE
  const isAuthRoute = url === '/login' || url === '/OTP' || url === '/register' || url === '/';
  const isAdminRoute = url.startsWith('/admin') || url.startsWith('/category');
  const isUserRoute = url.startsWith('/Finance');

  // 2. LOGIC: BELUM LOGIN
  if (!sessionCookie) {
    // Kalau mau ke halaman terproteksi tapi belum login -> Tendang ke Login
    if (isAdminRoute || isUserRoute) {
      return NextResponse.redirect(new URL('/login?mode=signin', request.url));
    }
    // Kalau di Landing atau Auth Page -> Boleh lewat
    return NextResponse.next();
  }

  // 3. LOGIC: SUDAH LOGIN
  if (sessionCookie) {
    // Kalau mau akses Login/OTP lagi padahal udah login -> Tendang ke Dashboard yg sesuai
    if (isAuthRoute) {
      if (userRole === 'admin') {
        return NextResponse.redirect(new URL('/category', request.url));
      }
      return NextResponse.redirect(new URL('/Finance', request.url));
    }

    // Role Guard: Kalau User (atau Google Login tanpa role cookie) mau masuk Admin
    if (isAdminRoute && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/Finance', request.url));
    }

    // Role Guard: Kalau Admin mau masuk Finance (Opsional: Admin biasanya boleh liat semua)
    // if (isUserRoute && userRole === 'admin') {
    //   return NextResponse.redirect(new URL('/category', request.url));
    // }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/Finance/:path*',
    '/admin/:path*',
    '/category/:path*',
    '/login',
    '/OTP',
    '/register'
  ],
};