import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth/mobile/token'
import { prisma } from '@/lib/prisma'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = authHeader.replace('Bearer ', '')
  const user = await verifyToken(token)
  if (!user) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 403 })
  }

  const formData = await req.formData()
  const file = formData.get('photo')

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: 'Invalid image' }, { status: 400 })
  }

  const ext = file.name.split('.').pop()
  const filename = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`
  const filepath = path.join(process.cwd(), 'public', 'uploads', filename)

  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(filepath, buffer)

  await prisma.photo.create({
    data: {
      url: `/uploads/${filename}`,
      uploaderId: user.id,
    },
  })

  return NextResponse.json({ success: true, url: `/uploads/${filename}` })
}
