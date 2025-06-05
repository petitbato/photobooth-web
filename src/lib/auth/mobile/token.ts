import { jwtVerify } from 'jose'
import { NextRequest } from 'next/server'

const secret = new TextEncoder().encode(process.env.JWT_SECRET!)

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as { id: string; email: string }
  } catch {
    return null
  }
}

export async function getUserFromRequest(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null

  const token = authHeader.slice(7)

  try {
    const { payload } = await jwtVerify(token, secret)
    return payload // contient { id, email, ... }
  } catch (e) {
    console.warn('⛔ Invalid token:', e)
    return null
  }
}
