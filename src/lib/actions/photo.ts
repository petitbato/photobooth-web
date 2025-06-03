'use server'

import { prisma } from '@/lib/prisma'
import fs from 'fs/promises'
import path from 'path'
import { revalidatePath } from 'next/cache'

export async function deletePhoto(formData: FormData) {
  const id = formData.get('id')?.toString()
  if (!id) throw new Error('Missing ID')

  const photo = await prisma.photo.findUnique({ where: { id } })
  if (!photo) throw new Error('Photo not found')

  const filePath = path.join(process.cwd(), 'public', photo.url)
  await fs.unlink(filePath).catch(() => {
    console.warn(`Fichier manquant : ${filePath}`)
  })

  await prisma.photo.delete({ where: { id } })

  revalidatePath('/display')
}