// 'use server'

// import { prisma } from '@/lib/prisma'
// import bcrypt from 'bcryptjs'
// import { cookies } from 'next/headers'

// export type AuthState = {
//   success: boolean
//   error?: string | null
// }

// export async function login(_prevState: AuthState, formData: FormData): Promise<AuthState> {
//   const email = formData.get('email')?.toString()
//   const password = formData.get('password')?.toString()

//   if (!email || !password) {
//     return { success: false, error: 'Champs manquants' }
//   }

//   const user = await prisma.user.findUnique({ where: { email } })
//   if (!user || !(await bcrypt.compare(password, user.password))) {
//     return { success: false, error: 'Identifiants incorrects' }
//   }

//   // Cookie sécurisé
//   (await cookies()).set('userId', user.id, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'lax',
//     path: '/',
//   })

//   return { success: true }
// }

// export async function signup(_prevState: AuthState, formData: FormData): Promise<AuthState> {
//   const email = formData.get('email')?.toString()
//   const password = formData.get('password')?.toString()

//   if (!email || !password) {
//     return { success: false, error: 'Champs manquants' }
//   }

//   const existing = await prisma.user.findUnique({ where: { email } })
//   if (existing) {
//     return { success: false, error: 'Utilisateur déjà existant' }
//   }

//   const hashedPassword = await bcrypt.hash(password, 10)

//   const user = await prisma.user.create({
//     data: {
//       email,
//       password: hashedPassword,
//     },
//   })

//   cookies().set('userId', user.id, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'lax',
//     path: '/',
//   })

//   return { success: true }
// }

// export async function logout(): Promise<void> {
//   const cookieStore = cookies();
//   cookieStore.set('userId', '', {
//     maxAge: 0,
//     path: '/',
//   });
// }
