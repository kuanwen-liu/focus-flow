'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ROUTES } from '@/lib/constants/routes'

export const Header = () => {
  const pathname = usePathname()

  const isActive = (href: string) => pathname === href

  return (
    <header className="sticky top-0 z-40 w-full border-b border-solid border-gray-200 dark:border-border bg-background/80 backdrop-blur-md">
      <div className="px-4 md:px-10 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href={ROUTES.HOME} className="flex items-center gap-4">
          <div className="size-8 text-primary">
            <span className="material-symbols-outlined !text-[32px]">graphic_eq</span>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] text-text-primary">
            FocusFlow
          </h2>
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-4 md:gap-8">
          {/* Navigation - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href="#"
              className="text-sm font-medium leading-normal opacity-70 hover:opacity-100 transition-opacity text-text-primary"
            >
              Discover
            </a>
          </div>

          {/* Saved Mixes Button */}
          <Link
            href={ROUTES.SAVED_MIXES}
            className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-primary text-white dark:text-[#111618] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors"
          >
            Saved Mixes
          </Link>

          {/* User Avatar */}
          <div
            className="bg-center bg-no-repeat bg-cover rounded-full size-9 border-2 border-gray-200 dark:border-border"
            style={{ backgroundImage: 'linear-gradient(135deg, #FF9D6C 0%, #BB4E75 100%)' }}
          />
        </div>
      </div>
    </header>
  )
}
