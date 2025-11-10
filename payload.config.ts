import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  secret: process.env.PAYLOAD_SECRET!,
  admin: { user: 'users', autoRefresh: true },
  db: mongooseAdapter({ url: process.env.MONGODB_URI! }),
  collections: [
    {
      slug: 'users',
      auth: true,
      fields: [{ name: 'username', type: 'text', required: true }],
    },
    {
      slug: 'categories',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'slug', type: 'text', unique: true, required: true },
        { name: 'content', type: 'textarea' },
        { name: 'owner', type: 'relationship', relationTo: 'users', required: true },
        { name: 'posts', type: 'join', collection: 'posts', on: 'categories' },
      ],
    },
    {
      slug: 'posts',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'slug', type: 'text', unique: true, required: true },
        { name: 'categories', type: 'relationship', relationTo: 'categories', hasMany: true },
        { name: 'content', type: 'textarea' },
        { name: 'owner', type: 'relationship', relationTo: 'users', required: true },
      ],
    }
  ],
})
