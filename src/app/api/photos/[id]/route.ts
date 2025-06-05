import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth/mobile/token'

/**
 * Récupère une photo précise et ses liens éventuels
 */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUserFromRequest(req).catch(() => null)

  const photo = await prisma.photo.findUnique({
    where: { id: params.id },
    include: {
      uploader: {
        select: { id: true, email: true },
      },
      likes: user ? {
        where: { userId: user.id },
        select: { id: true },
      } : false,
      _count: {
        select: { likes: true },
      },
    },
  })

  if (!photo) {
    return NextResponse.json({ error: 'Photo not found' }, { status: 404 })
  }

  const result = {
    id: photo.id,
    url: photo.url,
    createdAt: photo.createdAt,
    uploader: photo.uploader,
    likesCount: photo._count.likes,
    likedByUser: !!(photo.likes?.length),
  }

  return NextResponse.json(result)
}


/**
 * Met à jour une photo (admin uniquement)
 */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUserFromRequest(req)
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()

  try {
    const updatedPhoto = await prisma.photo.update({
      where: { id: params.id },
      data: {
        url: body.url,
        // Ajouter d'autres champs autorisés si nécessaires
      },
    })
    return NextResponse.json(updatedPhoto)
  } catch (error) {
    console.error('PATCH error:', error)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}

/**
 * Supprime une photo (admin uniquement)
 */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUserFromRequest(req)
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    await prisma.photo.delete({
      where: { id: params.id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE error:', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
