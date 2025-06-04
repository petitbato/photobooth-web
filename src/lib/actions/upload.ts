'use server'

import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import fs from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'
import { revalidatePath } from 'next/cache'

export async function uploadPhoto(formData: FormData) {
  const rawFile = formData.get('photo')
  const uploader = formData.get('uploader')

  // ✅ Vérifications typesafe
  if (!(rawFile instanceof File)) {
    throw new Error('Fichier invalide ou manquant')
  }

  if (typeof uploader !== 'string' || uploader.trim() === '') {
    throw new Error("Nom de l'envoyeur manquant")
  }

  if (!rawFile.type.startsWith('image/')) {
    throw new Error('Ce fichier n’est pas une image')
  }

  if (rawFile.size === 0) {
    throw new Error('Fichier vide')
  }

  const buffer = Buffer.from(await rawFile.arrayBuffer())
  const ext = rawFile.name.split('.').pop()
  const filename = `${randomUUID()}.${ext}`
  const filepath = path.join(process.cwd(), 'public', 'uploads', filename)

  await fs.writeFile(filepath, buffer)

  await prisma.photo.create({
    data: {
      url: `/uploads/${filename}`,
      uploader,
    },
  })

  // ✅ Revalidation automatique de la galerie
  revalidatePath('/display')

  redirect('/upload?success=1')
}
