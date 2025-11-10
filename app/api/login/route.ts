export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function POST(request: Request) {
  try {
    const form = await request.formData()
    const email = String(form.get('email') || '')
    const password = String(form.get('password') || '')

    const payload = await getPayloadClient()
    const { token } = await payload.login({
      collection: 'users',
      data: { email, password },
    })

    if (!token) {
      return NextResponse.json({ error: 'No token' }, { status: 401 })
    }

    const res = NextResponse.redirect(new URL('/', request.url))
    res.cookies.set({
      name: 'payload-token',
      value: token,
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })
    return res
  } catch (e) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }
}
