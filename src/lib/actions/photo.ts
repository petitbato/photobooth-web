'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/lib/auth/currentUser'

export async function deletePhoto(formData: FormData) {
  const id = formData.get('id')?.toString()
  if (!id) throw new Error('ID manquant')

  const user = await getCurrentUser()
  if (!user || user.role !== 'admin') {
    throw new Error('Accès refusé : vous devez être administrateur pour supprimer une photo.')
  }

  await prisma.photo.delete({ where: { id } })

  revalidatePath('/display')
}
