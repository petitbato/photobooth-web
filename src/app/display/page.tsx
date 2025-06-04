import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import { deletePhoto } from '@/lib/actions/photo'
import Form from 'next/form'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function DisplayPage() {
  const session = await cookies()
  const sessionId = session.get('session-id')?.value
  type Photo = Awaited<ReturnType<typeof prisma.photo.findMany>>[number]

  if (!sessionId) {
    redirect('/login')
  }
  const photos = await prisma.photo.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Galerie</h1>

      {photos.length === 0 && (
        <p className="text-center text-gray-500">Aucune image disponible.</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {photos.map((photo: Photo) => (
          <div key={photo.id} className="border rounded shadow p-2 bg-white">
            <Image
              src={photo.url}
              alt={`Image uploadée par ${photo.uploader}`}
              width={400}
              height={300}
              className="object-cover w-full h-auto rounded"
            /><p className="text-sm text-gray-600 mt-2">
              <span className="font-medium">Submitted by:</span> {photo.uploader}
            </p>  

            <Form action={deletePhoto} className="mt-2">
              <input type="hidden" name="id" value={photo.id} />
              <button
                type="submit"
                className="text-sm text-red-600 hover:underline"
              >
                Supprimer
              </button>
            </Form>
          </div>
        ))}
      </div>
    </main>
  )
}
