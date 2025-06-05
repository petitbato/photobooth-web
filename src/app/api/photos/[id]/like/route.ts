import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth/mobile/token'

/**
 * Ajoute un like à une photo
 */
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const like = await prisma.like.create({
      data: {
        userId: user.id,
        photoId: params.id,
      },
    })
    return NextResponse.json({ success: true, like })
  } catch {
    return NextResponse.json({ error: 'Already liked or invalid request' }, { status: 400 })
  }
}

/**
 * Supprime un like sur une photo
 */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await prisma.like.delete({
      where: {
        userId_photoId: {
          userId: user.id,
          photoId: params.id,
        },
      },
    })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Like not found' }, { status: 400 })
  }
}

/**
 * Récupère les infos de like : total + si user a liké
 */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUserFromRequest(req).catch(() => null)

  const [likeCount, userLike] = await Promise.all([
    prisma.like.count({ where: { photoId: params.id } }),
    user ? prisma.like.findUnique({
      where: {
        userId_photoId: {
          userId: user.id,
          photoId: params.id,
        },
      },
    }) : Promise.resolve(null)
  ])

  return NextResponse.json({
    totalLikes: likeCount,
    likedByUser: !!userLike,
  })
}
