import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth/mobile/token'

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { photoId1, photoId2 } = await req.json()
  if (!photoId1 || !photoId2 || photoId1 === photoId2) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  try {
    await prisma.photo.update({
      where: { id: photoId1 },
      data: {
        linkedPhotos: {
          connect: { id: photoId2 }
        }
      }
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Link failed' }, { status: 500 })
  }
}
