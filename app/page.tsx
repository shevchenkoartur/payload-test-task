import { getCurrentUser } from '@/lib/getCurrentUser'
import { getPayloadClient } from '@/lib/payload'
import { redirect } from 'next/navigation'
import { createPost } from '@/server/actions/createPost'
import CategoryMultiSelect from '@/components/CategoryMultiSelect'
import {seedCategories} from '@/server/actions/seedCategories';

export default async function Home() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const payload = await getPayloadClient()

  const categories = await payload.find({ collection: 'categories', limit: 20 })
  const catTitleById = new Map(
    categories.docs.map((c: any) => [c.id as string, c.title as string])
  )
  const posts = await payload.find({
    collection: 'posts',
    depth: 2,
    sort: '-createdAt',
  })

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-semibold">Hello, {user.username}!</h1>
      <a href="/api/logout" className="text-sm text-gray-500 hover:text-black underline">
        Logout
      </a>
      <form action={createPost} className="space-y-4 border p-4 rounded-lg">
        <input name="title" placeholder="Title" className="w-full border p-2 rounded" required />
        <textarea name="content" placeholder="Text" className="w-full border p-2 rounded min-h-[100px]" required />
        <div>
          <label className="block text-sm font-medium mb-1">Categories</label>
          <CategoryMultiSelect
            options={categories.docs.map((c: any) => ({ id: c.id, title: c.title }))}
            name="categories"
          />
        </div>
        <button className="bg-black text-white px-4 py-2 rounded">Create Post</button>
      </form>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Posts</h2>
        {posts.docs.length === 0 && <p className="text-gray-500">There is nothing yet..</p>}
        {categories.totalDocs === 0 && (
          <form action={seedCategories} className="border p-3 rounded bg-yellow-50">
            <div className="mb-2 text-sm">There is no any categories. Create based one?</div>
            <button className="px-3 py-1 rounded bg-black text-white">Create Categories</button>
          </form>
        )}
        {posts.docs.map((post) => (
          <article key={post.id} className="border p-4 rounded">
            <h3 className="text-lg font-semibold">{post.title}</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
            {(post.categories?.length ?? 0) > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                Categories:{' '}
                {(post.categories ?? [])
                  .map((c: any) =>
                    typeof c === 'string' ? (catTitleById.get(c) ?? c) : c.title
                  )
                  .join(', ')}
              </p>
            )}
            {post.owner && typeof post.owner !== 'string' && (
              <p className="text-sm text-gray-400">
                Author: {post.owner.username ?? post.owner.email ?? post.owner.id}
              </p>
            )}
            {(post.categories?.length ?? 0) > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {(post.categories ?? []).map((c: any) => {
                  const id = typeof c === 'string' ? c : c.id
                  const title = typeof c === 'string' ? (catTitleById.get(c) ?? c) : c.title
                  return (
                    <span key={id} className="text-xs bg-gray-100 border px-2 py-1 rounded">
                      {title}
                    </span>
                  )
                })}
              </div>
            )}
          </article>
        ))}
      </section>
    </main>
  )
}
