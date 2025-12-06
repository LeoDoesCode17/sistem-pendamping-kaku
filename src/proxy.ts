import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const roleHome: Record<string, string> = {
  cashier: '/cashier',
  chef: '/chef',
  packager: '/packager',
  admin: '/admin',
  super_admin: '/super-admin',
};

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // allow public
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/assets') ||
    pathname === '/login'
  ) {
    return NextResponse.next();
  }

  const session = req.cookies.get('session')?.value;
  const role = req.cookies.get('role')?.value;

  // not logged in => send to /login
  if (!session || !role) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (pathname === '/' || pathname === '/login') {
    const homePath = roleHome[role];
    if (homePath) {
      // Jika role terdaftar di roleHome, arahkan ke halaman home-nya
      return NextResponse.redirect(new URL(homePath, req.url));
    }
    // Opsional: Jika role tidak terdaftar, bisa diarahkan ke halaman default atau tetap diizinkan
    // Dalam kasus ini, kita biarkan saja lanjut (atau bisa arahkan ke /login sebagai fallback)
  }

  // role-based guard
  if (pathname.startsWith('/cashier') && role !== 'cashier') {
    return NextResponse.redirect(new URL(roleHome[role] ?? '/login', req.url));
  }
  if (pathname.startsWith('/chef') && role !== 'chef') {
    return NextResponse.redirect(new URL(roleHome[role] ?? '/login', req.url));
  }
  if (pathname.startsWith('/packager') && role !== 'packager') {
    return NextResponse.redirect(new URL(roleHome[role] ?? '/login', req.url));
  }
  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL(roleHome[role] ?? '/login', req.url));
  }
  if (pathname.startsWith('/super-admin') && role !== 'super_admin') {
    return NextResponse.redirect(new URL(roleHome[role] ?? '/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|assets).*)'],
};
