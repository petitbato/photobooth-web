'use client'

import dynamic from 'next/dynamic'

const Gallery = dynamic(() => import('./Gallery'), {
  ssr: false,
  loading: () => <p>Chargement des photos...</p>,
})

export default function GalleryClientWrapper() {
  return <Gallery />
}
