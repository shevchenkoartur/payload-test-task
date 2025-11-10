'use server'

import { getPayloadClient } from '@/lib/payload'
import { getCurrentUser } from '@/lib/getCurrentUser'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation';

export async function seedCategories() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const payload = await getPayloadClient()

  const exist = await payload.find({ collection: 'categories', limit: 1 })
  if (exist.totalDocs > 0) return revalidatePath('/')

  const base = [
    { title: 'New', slug: 'news' },
    { title: 'Notes', slug: 'notes' },
    { title: 'Guides', slug: 'guides' },
  ]

  for (const c of base) {
    await payload.create({
      collection: 'categories',
      data: {
        ...c,
        content: '',
        owner: user.id,
      },
    })
  }

  revalidatePath('/')
}
