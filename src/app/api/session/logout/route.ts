import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  // clear
  ['session','role','outletId'].forEach((name) =>
    res.cookies.set(name, '', { path: '/', maxAge: 0 })
  );
  return res;
}
