import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Bookmark } from 'lucide-react'

interface MainNavProps {
  items?: {
    title: string
    href: string
    icon?: React.ReactNode
  }[]
}

export function MainNav({ items }: MainNavProps) {
  const navItems = [
    ...(items || []),
    {
      title: 'المحفوظات',
      href: '/bookmarks',
      icon: <Bookmark className="h-4 w-4 mr-2" />
    }
  ]

  return (
    <nav className="flex items-center">
      <ul className="flex items-center gap-6">
        {navItems.map((item, index) => (
          <li key={index}>
            <Link
              href={item.href}
              className={cn(
                "flex items-center text-sm font-medium transition-colors hover:text-islamic-primary"
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
} 