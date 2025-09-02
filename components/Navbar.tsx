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
    <nav className="fixed bottom-0 left-0 right-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-800/50 z-50 md:top-0 md:bottom-auto md:border-t-0 md:border-b shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="hidden md:flex items-center gap-3 font-bold text-xl">
            <div className="relative">
              <Sparkles className="w-7 h-7 text-gray-900 dark:text-white" />
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-purple-400 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity" />
            </div>
            <span className="metallic-gold text-2xl tracking-tight">
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
                  "hover:bg-gray-100/50 dark:hover:bg-gray-800/50",
                  pathname === href
                    ? "text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 shadow-md"
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