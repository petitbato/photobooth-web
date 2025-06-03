'use server'

import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import fs from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'

export async function uploadPhoto(formData: FormData) {
  const file = formData.get('photo') as File
  const uploader = formData.get('uploader')?.toString() || ''

  if (!file || file.size === 0 || !uploader) {
    throw new Error('Champs manquants')
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  if (!file.type.startsWith('image/')) {
    throw new Error('Ce n’est pas une image')
  }

  const ext = file.name.split('.').pop()
  const filename = `${randomUUID()}.${ext}`
  const filepath = path.join(process.cwd(), 'public', 'uploads', filename)

  await fs.writeFile(filepath, buffer)

  await prisma.photo.create({
    data: {
      url: `/uploads/${filename}`,
      uploader,
    },
  })

  redirect('/upload?success=1')
}
