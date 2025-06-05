import { hashPassword, generateSalt, comparePasswords } from "./core/passwordHasher";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { signUpSchema, signInSchema } from "./schemas";
import { clearSession, createUserSession } from "./core/session";
import { revalidatePath } from "next/cache";


export async function signIn(formData: FormData) {
  'use server'

  const raw = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const parsed = signInSchema.safeParse(raw)
  if (!parsed.success) {
    return redirect('/login?error=' + encodeURIComponent('Invalid fields'))
  }

  const { email, password } = parsed.data

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !user.password || !user.salt) {
    return redirect('/login?error=' + encodeURIComponent('Invalid credentials'))
  }

  const isValid = await comparePasswords(password, user.password, user.salt)
  if (!isValid) {
    return redirect('/login?error=' + encodeURIComponent('Invalid credentials'))
  }

  await createUserSession({ id: user.id, role: 'user' })
  revalidatePath('/')
  redirect('/')
}


export async function signUp(formData: FormData) {
    'use server'
  const raw = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const parsed = signUpSchema.safeParse(raw)
  if (!parsed.success) {
    return redirect('/signup?error=' + encodeURIComponent('Invalid fields'))
  }

  const { email, password } = parsed.data

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    return redirect('/signup?error=' + encodeURIComponent('Email already used'))
  }
  const salt = await generateSalt()
  const hashedPassword = await hashPassword(password, salt)
  console.log('Creating user with email:', email)
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, salt, role: 'admin'},
  })
    console.log('User created with ID:', user.id)

  await createUserSession({ id: user.id, role: 'admin' })
    console.log('User session created for user ID:', user.id)
  revalidatePath('/')
  redirect('/')
}

export async function logOut() {
    'use server'
    await clearSession()
    revalidatePath('/')
    redirect('/')
}