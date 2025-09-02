'use client';

import { Home, Trophy, Target, User, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/challenges', label: 'Challenges', icon: Target },
    { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 z-50 md:top-0 md:bottom-auto md:border-t-0 md:border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="hidden md:flex items-center gap-2 font-bold text-xl">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              CreativeFlow
            </span>
          </Link>
          
          <div className="flex items-center gap-1 w-full md:w-auto justify-around md:justify-center md:gap-2">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 md:px-4 py-2 rounded-lg transition-all",
                  "hover:bg-gray-100 dark:hover:bg-gray-800",
                  pathname === href
                    ? "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20"
                    : "text-gray-600 dark:text-gray-400"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs md:text-sm font-medium">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}