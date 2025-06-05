import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth/mobile/token'

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req).catch(() => null)

  const photos = await prisma.photo.findMany({
    include: {
      uploader: {
        select: { email: true }
      },
      likes: user ? {
        where: { userId: user.id },
        select: { id: true },
      } : false,
      _count: {
        select: { likes: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  interface PhotoUploader {
    email: string | null;
  }

  interface PhotoLike {
    id: string;
  }

  interface PhotoCount {
    likes: number;
  }

  interface Photo {
    id: string;
    url: string;
    createdAt: Date;
    uploader: PhotoUploader | null;
    likes?: PhotoLike[];
    _count: PhotoCount;
  }

  interface PhotoResult {
    id: string;
    url: string;
    createdAt: Date;
    uploader: PhotoUploader;
    likesCount: number;
    likedByUser: boolean;
  }

  const result: PhotoResult[] = (photos as Photo[]).map((photo) => ({
    id: photo.id,
    url: photo.url,
    createdAt: photo.createdAt,
    uploader: {
      email: photo.uploader?.email ?? null,
    },
    likesCount: photo._count.likes,
    likedByUser: !!(photo.likes?.length),
  }))

  return NextResponse.json(result)
}
