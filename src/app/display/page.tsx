import { prisma } from '@/lib/prisma'
import Image from 'next/image'

export default async function DisplayPage() {
  const photos = await prisma.photo.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Galerie</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {photos.map((photo) => (
          <div key={photo.id} className="border rounded shadow p-2 bg-white">
            <Image
              src={photo.url}
              alt={`Image uploadée par ${photo.uploader}`}
              width={400}
              height={300}
              className="object-cover w-full h-auto rounded"
            />
            <p className="text-sm text-gray-600 mt-2">{photo.uploader}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
