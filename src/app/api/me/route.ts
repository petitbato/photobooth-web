import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth/mobile/token'

export async function GET(req: NextRequest) {
  const userPayload = await getUserFromRequest(req)
  if (!userPayload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: userPayload.id },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      photos: {
        select: {
          id: true,
          url: true,
          createdAt: true,
          _count: { select: { likes: true } }
        }
      },
    },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // Define the type for photo
  type Photo = {
    id: string
    url: string
    createdAt: Date
    _count: { likes: number }
  }

  // Total likes across all user photos
  const totalLikes = user.photos.reduce(
    (sum: number, photo: Photo) => sum + photo._count.likes,
    0
  )

  return NextResponse.json({
    id: user.id,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    totalPhotos: user.photos.length,
    totalLikes,
    photos: user.photos.map((p: Photo) => ({
      id: p.id,
      url: p.url,
      createdAt: p.createdAt,
      likes: p._count.likes,
    })),
  })
}
