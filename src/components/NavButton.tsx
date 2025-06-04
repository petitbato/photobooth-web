import Link from 'next/link'

interface NavButtonProps {
  href: string
  label: string
  color: 'blue' | 'green' | 'gray'
}

export default function NavButton({ href, label, color }: NavButtonProps) {
  const baseColors: Record<typeof color, string> = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    green: 'bg-green-600 hover:bg-green-700',
    gray: 'bg-gray-800 hover:bg-gray-900',
  }

  return (
    <Link
      href={href}
      className={`block w-full rounded-2xl ${baseColors[color]} text-white px-6 py-4 text-center text-lg font-semibold shadow-lg transition`}
    >
      {label}
    </Link>
  )
}
