'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Head from 'next/head'
export function Header() {
  const pathname = usePathname()

  const isActive = (href: string) =>
    pathname === href ? 'underline font-bold' : ''

  return (
    <div>
      <Head>
        <title>Photobooth</title>
      </Head>
      <header className="p-4 border-b mb-4 flex gap-4">
        <Link href="/" className={isActive('/')}>Accueil</Link>
        <Link href="/upload" className={isActive('/upload')}>Upload</Link>
        <Link href="/display" className={isActive('/display')}>Galerie</Link>
        <Link href="/admin" className={isActive('/admin')}>Admin</Link>
      </header>
    </div>
  )
}
