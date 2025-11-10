import dotenv from 'dotenv'
dotenv.config({ path: '.env' })

import { getPayload, buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'

const run = async () => {
  const { MONGODB_URI, PAYLOAD_SECRET } = process.env

  if (!MONGODB_URI || !PAYLOAD_SECRET) {
    console.error('❌ MONGODB_URI | PAYLOAD_SECRET is empty')
    process.exit(1)
  }

  const cfg = buildConfig({
    secret: PAYLOAD_SECRET,
    admin: { user: 'users' },
    db: mongooseAdapter({ url: MONGODB_URI }),
    collections: [
      {
        slug: 'users',
        auth: true,
        fields: [{ name: 'username', type: 'text', required: true }],
      },
    ],
  })

  const payload = await getPayload({ config: cfg })

  const email = 'test@test.com'
  const password = 'test'

  const exists = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
  })

  if (exists.totalDocs === 0) {
    await payload.create({
      collection: 'users',
      data: { email, password, username: 'test' },
    })
    console.log('✅ Seed user created')
  } else {
    console.log('ℹ️  Seed user already exists')
  }

  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
