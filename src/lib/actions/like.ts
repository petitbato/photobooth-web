'use server'

import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth/currentUser'
import { revalidatePath } from 'next/cache'

export async function toggleLike(formData: FormData) {
  const photoId = formData.get('photoId')?.toString()
  if (!photoId) throw new Error('ID photo manquant')

  const user = await getCurrentUser()
  if (!user) throw new Error('Utilisateur non connecté')

  const alreadyLiked = await prisma.like.findUnique({
    where: {
      userId_photoId: {
        userId: user.id,
        photoId,
      },
    },
  })

  if (alreadyLiked) {
    await prisma.like.delete({
      where: {
        userId_photoId: {
          userId: user.id,
          photoId,
        },
      },
    })
  } else {
    await prisma.like.create({
      data: {
        userId: user.id,
        photoId,
      },
    })
  }

  revalidatePath('/display')
}
