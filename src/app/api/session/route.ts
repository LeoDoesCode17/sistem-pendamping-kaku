// src/app/api/session/route.ts
import { NextRequest, NextResponse } from 'next/server';

const COOKIE = 'app_session';

export async function POST(req: NextRequest) {
  const { uid, role, outletId } = await req.json();
  if (!uid || !role) {
    return NextResponse.json({ error: 'Missing uid/role' }, { status: 400 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(
    COOKIE,
    JSON.stringify({ uid, role, outletId }),
    {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 8, // 8 jam
    }
  );
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, '', { path: '/', maxAge: 0 });
  return res;
}
