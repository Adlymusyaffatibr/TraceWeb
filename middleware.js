import { connect } from 'http2';
import { NextResponse } from 'next/server';

export function middleware(request) {
  // express-session secara default ngasih nama cookie 'connect.sid'
  // Kalau di backend lu ubah namanya, tinggal ganti string di bawah ini ya
  const sessionCookie = request.cookies.get('connect.sid');

  // Nangkep URL yang lagi mau diakses user
  const url = request.nextUrl.pathname;

  // Daftar rute yang WAJIB login (bisa ditambahin ntar misal /transactions, /profile)
  const isProtectedRoute = url.startsWith('/dashboard');

  // Daftar rute khusus orang yang BELUM login
  const isAuthRoute = url.startsWith('/login') || url.startsWith('/otp');

  if(request.nextUrl.pathname.startsWith('/admin')) {
    if ( role !== 'admin'){
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // LOGIC 1: Belum login, tapi maksa masuk Dashboard -> Tendang ke Login
  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL('/login?mode=signin', request.url));
  }

 const sid = request.cookies.get('connect.sid')?.value

  //  if (!sid) {
  //   return NextResponse.redirect(new URL('/login?mode=signin', request.url))
  // }

  // try {
  //   const res = await fetch('/', {
  //     headers: {
  //       Cookie: `connect.sid=${sid}`,
  //     },
  //   })

  //   if (!res.ok) {
  //     return NextResponse.redirect(new URL('/login?mode=signin', request.url))
  //   }
  // } catch (err) {
  //   return NextResponse.redirect(new URL('/login?mode=signin', request.url))
  // }

  // // LOGIC 2: Udah login, tapi iseng buka halaman Login/Register -> Tendang ke Dashboard
  // if (isAuthRoute && sessionCookie) {
  //   return NextResponse.redirect(new URL('/Finance', request.url));
  // }

  // Kalau semua aman, silakan lewat!
  return NextResponse.next();
}

// Config ini buat ngasih tau Next.js, rute mana aja yang harus dicek sama satpam ini
export const config = {
  matcher: [
    '/dashboard/:path*', // Berlaku buat /dashboard dan anak-anaknya (/dashboard/settings, dll)
    '/login',
    '/otp'
  ],
};