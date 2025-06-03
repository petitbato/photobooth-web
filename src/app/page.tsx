import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-blue-100 via-white to-pink-100">
      <h1 className="text-4xl sm:text-5xl font-bold text-center mb-12 text-gray-800 drop-shadow">
        Photobooth du Mariage
      </h1>

      <nav className="grid gap-6 w-full max-w-sm">
        <Link
          href="/upload"
          className="block w-full rounded-2xl bg-blue-600 text-white px-6 py-4 text-center text-lg font-semibold shadow-lg hover:bg-blue-700 transition"
        >
          Envoyer une photo
        </Link>

        <Link
          href="/display"
          className="block w-full rounded-2xl bg-green-600 text-white px-6 py-4 text-center text-lg font-semibold shadow-lg hover:bg-green-700 transition"
        >
          Voir la galerie
        </Link>

        <Link
          href="/admin"
          className="block w-full rounded-2xl bg-gray-800 text-white px-6 py-4 text-center text-lg font-semibold shadow-lg hover:bg-gray-900 transition"
        >
          Espace admin
        </Link>
      </nav>
    </main>
  )
}
