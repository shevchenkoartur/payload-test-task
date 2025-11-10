'use server'

import { getPayloadClient } from '@/lib/payload'
import { getCurrentUser } from '@/lib/getCurrentUser'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation';

function toSlug(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/gi, '-')
    .replace(/(^-|-$)/g, '')
}

export async function createPost(formData: FormData) {
  const title = String(formData.get('title') || '').trim()
  const content = String(formData.get('content') || '').trim()
  const categories = formData.getAll('categories').map(String).filter(Boolean)

  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const payload = await getPayloadClient()

  const base = toSlug(title) || `post-${Date.now()}`
  let slug = base

  let i = 1
  while (true) {
    const exists = await payload.find({
      collection: 'posts',
      where: { slug: { equals: slug } },
      limit: 1,
    })
    if (exists.totalDocs === 0) break
    i += 1
    slug = `${base}-${i}`
  }

  await payload.create({
    collection: 'posts',
    data: {
      title,
      slug,
      content,
      owner: user.id,
      categories,
    },
  })

  revalidatePath('/')
}
