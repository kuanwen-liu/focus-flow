'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ROUTES } from '@/lib/constants/routes'

export const Header = () => {
  const pathname = usePathname()

  const navItems = [
    { label: 'Home', href: ROUTES.HOME },
    { label: 'Mixer', href: ROUTES.MIXER },
    { label: 'My Mixes', href: ROUTES.LIBRARY },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href={ROUTES.HOME} className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-3xl">
            graphic_eq
          </span>
          <span className="text-xl font-bold">Focus Flow</span>
        </Link>

        <nav className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                text-sm font-medium transition-colors
                ${
                  isActive(item.href)
                    ? 'text-primary'
                    : 'text-text-secondary hover:text-primary'
                }
              `}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {/* Future: User profile avatar */}
          <div className="w-8 h-8 rounded-full bg-card border border-border" />
        </div>
      </div>
    </header>
  )
}
