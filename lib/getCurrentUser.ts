import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { getPayloadClient } from './payload'

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value
    if (!token) return null

    const decoded: any = jwt.decode(token)
    const userId = decoded?.id ?? decoded?.user?.id
    if (!userId) return null

    const payload = await getPayloadClient()
    const user = await payload.findByID({ collection: 'users', id: userId })
    return user
  } catch {
    return null
  }
}
