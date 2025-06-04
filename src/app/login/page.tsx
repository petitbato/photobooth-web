import { signIn } from '@/lib/auth/actions'
import { isSessionValid } from '@/lib/auth/core/session'
import { cookies } from 'next/headers'

export default async function LoginPage() {
    const cookiesUser = await cookies()
    const sessionId = cookiesUser.get('session-id')?.value || null
    const sessionIsValid = sessionId ? isSessionValid(sessionId) : false
  
    if (sessionIsValid) {
      return (
        <main className="max-w-sm mx-auto mt-10">
          <h1 className="text-xl font-bold mb-4">Vous êtes déjà connecté</h1>
          <p>Vous pouvez accéder à votre compte.</p>
        </main>
      )
    }
  return (
    <form action={signIn} className="max-w-sm mx-auto mt-10 space-y-4">
      <div>
        <label htmlFor="email" className="block">Email</label>
        <input type="email" name="email" id="email" required className="w-full border px-2 py-1" />
      </div>
      <div>
        <label htmlFor="password" className="block">Password</label>
        <input type="password" name="password" id="password" required className="w-full border px-2 py-1" />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2">Log In</button>
    </form>
  )
}
