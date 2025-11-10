import { authorizeUser } from '@/server/actions/authorizeUser'

export default function LoginPage() {
  return (
    <main className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Login</h1>
      <form action={authorizeUser} className="space-y-3">
        <input name="email" defaultValue="test@test.com" placeholder="email" className="w-full border p-2 rounded" />
        <input name="password" defaultValue="test" type="password" placeholder="password" className="w-full border p-2 rounded" />
        <button className="px-4 py-2 rounded bg-black text-white">Sign in</button>
      </form>
    </main>
  )
}
