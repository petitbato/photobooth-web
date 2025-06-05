import { signUp } from '@/lib/auth/actions'
import { isSessionValid } from '@/lib/auth/core/session'
import { cookies } from 'next/headers'
import Form from 'next/form'

export default async function SignUpPage({ searchParams }: { searchParams?: { error?: string; success?: string } }) {
  const error = searchParams?.error ? decodeURIComponent(searchParams.error) : null

  const cookiesUser = await cookies()
  const sessionId = cookiesUser.get('session-id')?.value || null
  const sessionIsValid = sessionId ? await isSessionValid(sessionId) : false

  if (sessionIsValid) {
    return (
      <main className="max-w-sm mx-auto mt-10">
        <h1 className="text-xl font-bold mb-4">Vous êtes déjà connecté</h1>
        <p>Vous pouvez accéder à votre compte.</p>
      </main>
    )
  }

  return (
    <main className="max-w-sm mx-auto mt-10">
      <h1 className="text-xl font-bold mb-4">Créer un compte</h1>
      {error && <p className="text-red-600">{error}</p>}
      <Form action={signUp} className="space-y-4">
        <div>
          <label htmlFor="email">Email</label>
          <input name="email" id="email" type="email" required className="w-full border px-2 py-1" />
        </div>
        <div>
          <label htmlFor="password">Mot de passe</label>
          <input name="password" id="password" type="password" required className="w-full border px-2 py-1" />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2">Créer un compte</button>
      </Form>
    </main>
  )
}
