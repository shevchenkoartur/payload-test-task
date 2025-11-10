import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { getPayloadClient } from './payload'

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value
  if (!token) return null

  const decoded = jwt.decode(token)
  const userId = typeof decoded === 'object' ? decoded?.id : null
  if (!userId) return null

  const payload = await getPayloadClient()

  const user = await payload.findByID({
    collection: 'users',
    id: userId,
  })

  return user;
}
