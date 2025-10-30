// src/middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const COOKIE = 'app_session';
const PUBLIC_PATHS = ['/login'];

const ROLE_PREFIX: Record<string, string[]> = {
  CASHIER: ['/cashier'],
  CHEF: ['/chef'],
  PACKAGER: ['/packager'],
};

type Session = { uid: string; role: string; outletId?: string };

function getSession(req: NextRequest): Session | null {
  const raw = req.cookies.get(COOKIE)?.value;
  if (!raw) return null;
  try { return JSON.parse(raw) as Session; } catch { return null; }
}

function roleHome(role: string) {
  switch (role) {
    case 'CASHIER':  return '/cashier';
    case 'CHEF':     return '/chef';
    case 'PACKAGER': return '/packager';
    default:         return '/login';
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // skip assets/api
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/assets')
  ) {
    return NextResponse.next();
  }

  const session = getSession(req);

  // ✅ Tangani root "/" secara eksplisit
  if (pathname === '/') {
    const url = req.nextUrl.clone();
    if (session) {
      url.pathname = roleHome(session.role);
    } else {
      url.pathname = '/login';
    }
    return NextResponse.redirect(url);
  }

  // Public hanya /login
  const isPublic = PUBLIC_PATHS.includes(pathname);

  // Belum login ⇒ blokir semua kecuali /login
  if (!session && !isPublic) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  // Sudah login tapi ke /login ⇒ lempar ke home role
  if (session && pathname === '/login') {
    const url = req.nextUrl.clone();
    url.pathname = roleHome(session.role);
    return NextResponse.redirect(url);
  }

  // Role guard
  if (session) {
    const allowed = (ROLE_PREFIX[session.role] ?? []).some(p => pathname.startsWith(p));
    if (!allowed) {
      const url = req.nextUrl.clone();
      url.pathname = roleHome(session.role);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|assets).*)'],
};
