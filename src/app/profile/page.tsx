import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('session-id')?.value

  if (!sessionId) redirect('/login')

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
  })

  if (!session) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      email: true,
      createdAt: true,
      // Ajoute ici d'autres champs à afficher si nécessaire
    },
  })

  if (!user) redirect('/login')

  return (
    <main className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Profil</h1>
      <p><strong>Email :</strong> {user.email}</p>
      <p><strong>Inscrit le :</strong> {user.createdAt.toLocaleDateString()}</p>
    </main>
  )
}
