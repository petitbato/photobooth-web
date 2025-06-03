import { deletePhoto } from '@/lib/actions/photo'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const formData = await request.formData()
  await deletePhoto(formData)

  return NextResponse.redirect(new URL('/display', request.url))
}
