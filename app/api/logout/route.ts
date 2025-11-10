export const runtime = 'nodejs'

import { NextResponse } from 'next/server'

function clearCookie(res: NextResponse) {
  res.cookies.set({
    name: 'payload-token',
    value: '',
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
  })
}

export async function POST(request: Request) {
  const res = NextResponse.redirect(new URL('/login', request.url))
  clearCookie(res)
  return res
}

export async function GET(request: Request) {
  const res = NextResponse.redirect(new URL('/login', request.url))
  clearCookie(res)
  return res
}

export async function OPTIONS() {
  return new Response(null, { status: 204 })
}
