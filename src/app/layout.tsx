import './globals.css'
import type { ReactNode } from 'react'
import Providers from '@/components/Providers'
import { Header } from '@/components/Header'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  )
}
