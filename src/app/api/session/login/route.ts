import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { role, outletId } = await req.json();

  if (!role || !outletId) {
    return NextResponse.json({ ok: false, error: 'Missing role/outletId' }, { status: 400 });
  }

  const res = NextResponse.json({ ok: true });

  // contoh: 1 hari
  const maxAge = 60 * 60 * 24;

  res.cookies.set('session', '1', { httpOnly: true, sameSite: 'lax', path: '/', maxAge });
  res.cookies.set('role', role, { httpOnly: true, sameSite: 'lax', path: '/', maxAge });
  res.cookies.set('outletId', outletId, { httpOnly: true, sameSite: 'lax', path: '/', maxAge });

  return res;
}
