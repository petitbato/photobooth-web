import { prisma } from '../prisma'
import { getUserFromSession } from './core/session'

export async function getCurrentUser() {
    const userSession = await getUserFromSession()
    if (!userSession) return null
    
    const user = await prisma.user.findUnique({
        where: { id: userSession.id },
        select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        },
    })
    
    return user
}
