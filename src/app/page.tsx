import NavButton from '@/components/NavButton'

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-blue-100 via-white to-pink-100">
      <h1 className="text-4xl sm:text-5xl font-bold text-center mb-12 text-gray-800 drop-shadow">
        Photobooth
      </h1>

      <nav className="grid gap-6 w-full max-w-sm">
        <NavButton href="/upload" label="Envoyer une photo" color="blue" />
        <NavButton href="/display" label="Voir la galerie" color="green" />
        <NavButton href="/admin" label="Espace admin" color="gray" />
        <NavButton href="/login" label="Se connecter" color="blue" />
        <NavButton href="/signup" label="Créer un compte" color="green" />
      </nav>
    </main>
  )
}
