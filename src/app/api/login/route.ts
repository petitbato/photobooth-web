import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { comparePasswords } from '@/lib/auth/core/passwordHasher'
import { SignJWT } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET!)

export async function POST(req: NextRequest) {
  const body = await req.json()
  console.log('🔐 Reçu:', body)
  const { email, password } = body

  if (typeof email !== 'string' || typeof password !== 'string') {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }
  console.log('🔍 Utilisateur trouvé:', user.email, 'salt', user.salt)
  const passwordIsValid = await comparePasswords(password, user.password, user.salt)
  if (!passwordIsValid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

let token
try {
    token = await new SignJWT({ id: user.id, email: user.email })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('7d')
        .sign(secret)
    console.log('🔑 Token généré pour l’utilisateur:', user.email)
    console.log('🔑 Token:', token)
} catch (error) {
    console.error('Erreur lors de la génération du token:', error)
    return NextResponse.json({ error: 'Token generation failed' }, { status: 500 })
}
  return NextResponse.json({ token })
}

