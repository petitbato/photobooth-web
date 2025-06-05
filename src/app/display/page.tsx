import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import { deletePhoto } from '@/lib/actions/photo'
import Form from 'next/form'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/currentUser'
import { toggleLike } from '@/lib/actions/like'

type Photo = {
  id: string
  url: string
  createdAt: Date
  uploader?: { email: string | null } | null
  _count: { likes: number }
  likes?: { id: string }[] // si user est connecté
}

export default async function DisplayPage() {
  const session = await cookies()
  const sessionId = session.get('session-id')?.value

  if (!sessionId) {
    redirect('/login')
  }
  const user = await getCurrentUser()
  const isAdmin = user?.role === 'admin'



  const photos = await prisma.photo.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      uploader: { select: { email: true } },
      _count: { select: { likes: true } },
      likes: user ? {
        where: { userId: user.id },
        select: { id: true }
      } : false
    }
  })


  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Galerie</h1>

      {photos.length === 0 && (
        <p className="text-center text-gray-500">Aucune image disponible.</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {photos.map((photo : Photo) => (
          <div key={photo.id} className="border rounded shadow p-2 bg-white">
            <Image
              src={photo.url}
              alt={`Image uploadée par ${photo.uploader?.email ?? 'inconnu'}`}
              width={500}
              height={400}
              className="object-cover w-full h-auto rounded"
            />
            <p className="text-sm text-gray-600 mt-2">
              <span className="font-medium">Submitted by:</span> {photo.uploader?.email}
            </p>
            <Form action={toggleLike} className="mt-2 flex items-center gap-2">
              <input type="hidden" name="photoId" value={photo.id} />
              <button
                type="submit"
                className="text-sm px-2 py-1 rounded text-white"
                style={{ backgroundColor: photo.likes?.length ? '#3b82f6' : '#9ca3af' }}
              >
                {photo.likes?.length ? '💙 Unlike' : '🤍 Like'}
              </button>
              <span className="text-sm text-gray-700">{photo._count.likes} like{photo._count.likes !== 1 && 's'}</span>
            </Form>

            {isAdmin && (
              <Form action={deletePhoto} className="mt-2">
                <input type="hidden" name="id" value={photo.id} />
                <button
                  type="submit"
                  className="text-sm text-red-600 hover:underline"
                >
                  Supprimer
                </button>
              </Form>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}
