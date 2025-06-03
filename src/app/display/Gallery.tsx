'use client'

import { useQuery } from '@tanstack/react-query'

type Photo = {
  id: string
  url: string
  uploader: string
  createdAt: string
}

export default function Gallery() {
  const { data, isPending, error, isFetching } = useQuery<Photo[]>({
    queryKey: ['photos'],
    queryFn: async () => {
      const res = await fetch('/api/photos')
      if (!res.ok) throw new Error('Erreur de chargement')
      return res.json()
    },
    staleTime: 60_000,
  })

  if (isPending) return <p className="text-center">Chargement…</p>
  if (error) return <p className="text-red-500">Erreur : {(error as Error).message}</p>

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {data.map((photo) => (
        <div key={photo.id} className="border rounded p-2">
          <img
            src={photo.url}
            alt="photo"
            className="rounded shadow mb-2 max-h-64 w-full object-cover"
          />
          <p className="text-sm text-gray-500">{photo.uploader}</p>
        </div>
      ))}
      {isFetching && (
        <div className="col-span-full text-sm text-center text-gray-400 mt-4">
          Mise à jour en cours...
        </div>
      )}
    </div>
  )
}
