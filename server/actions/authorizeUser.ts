'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'

export async function authorizeUser(formData: FormData) {
  const email = String(formData.get('email') || '')
  const password = String(formData.get('password') || '')

  const payload = await getPayloadClient()
  const { token } = await payload.login({
    collection: 'users',
    data: { email, password },
  })

  if (!token) {
    throw new Error('Login failed: no token returned')
  }

  const cookieStore = await cookies()

  cookieStore.set({
    name: 'payload-token',
    value: token,
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
  })

  redirect('/')
}
