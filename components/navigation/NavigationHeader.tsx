'use client'

import { useState } from 'react'
import Link from 'next/link'
import UserMenu from './UserMenu'

interface NavigationHeaderProps {
  showLogo?: boolean
  className?: string
}

export default function NavigationHeader({ showLogo = true, className = '' }: NavigationHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigationItems = [
    { label: 'Home', href: '/', icon: '🏠' },
    { label: 'Contests', href: '/authenticated-home', icon: '🎨' },
    { label: 'Payouts', href: '/payouts', icon: '💰' },
  ]

  return (
    <header className={`bg-white/5 backdrop-blur-sm border-b border-white/10 sticky top-0 z-30 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          {showLogo && (
            <Link
              href="/"
              className="flex items-center gap-2 text-white font-bold text-xl hover:text-white/80 transition-colors"
            >
              <span className="text-2xl">🎨</span>
              <span className="hidden sm:block">Creative Challenge</span>
            </Link>
          )}

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-white/10"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Right side - User Menu */}
          <div className="flex items-center gap-4">
            <UserMenu />
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-white/5 backdrop-blur-sm">
            <div className="px-4 py-4 space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-white/70 hover:text-white transition-colors duration-200 px-3 py-3 rounded-lg hover:bg-white/10"
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
