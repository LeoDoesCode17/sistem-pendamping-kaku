import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const roleHome: Record<string, string> = {
  cashier: '/cashier',
  chef: '/chef',
  packager: '/packager',
};

export function middleware(req: NextRequest) {
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

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|assets).*)'],
};
