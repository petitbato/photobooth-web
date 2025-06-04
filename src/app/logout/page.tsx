// app/logout/page.tsx
import { logOut } from '@/lib/auth/actions'

export default function LogoutPage() {
  return (
    <form action={logOut} method="POST" className="max-w-sm mx-auto mt-10 text-center">
      <p className="mb-4">Êtes-vous sûr de vouloir vous déconnecter ?</p>
      <button
        type="submit"
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Se déconnecter
      </button>
    </form>
  )
}
