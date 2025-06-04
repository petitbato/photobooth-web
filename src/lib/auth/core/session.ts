import { z } from 'zod'
import crypto from 'crypto'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export const userRoles = ['admin', 'user'] as const

const SESSION_EXPIRATION_SECONDS = 60 * 60 * 24 * 7
const COOKIE_SESSION_KEY = 'session-id'

const sessionSchema = z.object({
  id: z.string(),
  role: z.enum(userRoles),
})

export async function getUserFromSession(): Promise<UserSession | null> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get(COOKIE_SESSION_KEY)?.value
  if (!sessionId) return null

  return await getUserSessionById(sessionId)
}

type UserSession = z.infer<typeof sessionSchema>

export async function updateUserSessionData(user: UserSession): Promise<void> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get(COOKIE_SESSION_KEY)?.value
  if (!sessionId) return

  await prisma.session.update({
    where: { id: sessionId },
    data: {
      userId: user.id,
      role: user.role,
      expiresAt: new Date(Date.now() + SESSION_EXPIRATION_SECONDS * 1000),
    },
  })
}

export async function clearSession(): Promise<void> {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get(COOKIE_SESSION_KEY)?.value
    if (!sessionId) return
    
    await prisma.session.delete({
        where: { id: sessionId },
    }).catch(() => {}) // ignore if already deleted
    
    cookieStore.delete(COOKIE_SESSION_KEY)
}

export async function createUserSession(user: { id: string; role: string }) {
  const sessionId = crypto.randomBytes(48).toString('hex')
  const expiresAt = new Date(Date.now() + SESSION_EXPIRATION_SECONDS * 1000)

  await prisma.session.create({
    data: {
      id: sessionId,
      userId: user.id,
      role: user.role,
      expiresAt,
    },
  })

  const cookieStore = await cookies()
  cookieStore.set(COOKIE_SESSION_KEY, sessionId, {
    secure: true,
    httpOnly: true,
    sameSite: 'lax',
    expires: expiresAt,
  })
}


export async function updateUserSessionExpiration(): Promise<void> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get(COOKIE_SESSION_KEY)?.value
  if (!sessionId) return

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
  })

  if (!session) return

  const newExpiration = new Date(Date.now() + SESSION_EXPIRATION_SECONDS * 1000)

  await prisma.session.update({
    where: { id: sessionId },
    data: { expiresAt: newExpiration },
  })

  cookieStore.set(COOKIE_SESSION_KEY, sessionId, {
    secure: true,
    httpOnly: true,
    sameSite: 'lax',
    expires: newExpiration,
  })
}

export async function removeUserFromSession(): Promise<void> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get(COOKIE_SESSION_KEY)?.value
  if (!sessionId) return

  await prisma.session.delete({
    where: { id: sessionId },
  }).catch(() => {}) // ignore if already deleted

  cookieStore.delete(COOKIE_SESSION_KEY)
}


export async function getUserSessionById(sessionId: string): Promise<UserSession | null> {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
  })

  if (!session) return null

  const parsed = sessionSchema.safeParse({
    id: session.userId,
    role: session.role,
  })

  return parsed.success ? parsed.data : null
}

export async function isSessionValid(sessionId: string): Promise<boolean> {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
  })

  if (!session) return false

  const now = new Date()
  return session.expiresAt > now
}