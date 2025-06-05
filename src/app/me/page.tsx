'use server'

import { getCurrentUser } from '@/lib/auth/currentUser'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function ProfilePage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  interface PhotoWithLikesCount {
    _count: {
      likes: number
    }
  }

  interface UserWithPhotos {
    photos: PhotoWithLikesCount[]
  }

  const userWithLikes: UserWithPhotos | null = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      photos: {
        select: {
          _count: {
            select: { likes: true }
          }
        }
      }
    }
  })

  const totalLikes: number = userWithLikes?.photos.reduce((sum: number, photo: PhotoWithLikesCount) => sum + photo._count.likes, 0) || 0

  return (
    <main className="max-w-xl mx-auto p-8 bg-gray-900 rounded-lg shadow-lg mt-10">
      <h1 className="text-3xl font-extrabold mb-6 text-white text-center">Mon profil</h1>
      <ul className="space-y-4 text-white">
        <li className="flex items-center">
          <span className="font-semibold w-32">ID :</span>
          <span className="bg-gray-800 px-3 py-1 rounded">{user.id}</span>
        </li>
        <li className="flex items-center">
          <span className="font-semibold w-32">Email :</span>
          <span className="bg-gray-800 px-3 py-1 rounded">{user.email}</span>
        </li>
        <li className="flex items-center">
          <span className="font-semibold w-32">Rôle :</span>
          <span className="bg-gray-800 px-3 py-1 rounded">{user.role}</span>
        </li>
        <li className="flex items-center">
          <span className="font-semibold w-32">Créé le :</span>
          <span className="bg-gray-800 px-3 py-1 rounded">{new Date(user.createdAt).toLocaleDateString()}</span>
        </li>
        <li className="flex items-center">
          <span className="font-semibold w-32">Likes reçus :</span>
          <span className="bg-gray-800 px-3 py-1 rounded">{totalLikes}</span>
        </li>
      </ul>
    </main>
  )
}
