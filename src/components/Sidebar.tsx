'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, User, Users, Settings, LogOut, Search, Bell, Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

const navigation = [
  { name: 'Fil', href: '/', icon: Home },
  { name: 'Profil', href: '/profile/me', icon: User },
  { name: 'Camarades', href: '/classmates', icon: Users },
  { name: 'Notifications', href: '#', icon: Bell },
  { name: 'Parametres', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const val = (e.target as HTMLInputElement).value.trim();
      if (val) {
        window.location.href = `/?q=${encodeURIComponent(val)}`;
      }
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Logo */}
      <div className="mb-8">
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src="/images/university-logo.png"
            alt="Logo Universite"
            className="h-10 w-10 object-contain transition-transform duration-200 group-hover:scale-105"
            crossOrigin="anonymous"
          />
          <div>
            <h1 className="text-lg font-bold text-foreground">UniSocial</h1>
            <p className="text-[11px] text-muted-foreground leading-none">Reseau Universitaire</p>
          </div>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-full pl-10 pr-3 py-2.5 bg-muted border border-transparent rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:bg-card focus:shadow-sm transition-all duration-200"
            onKeyDown={handleSearch}
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href ||
            (item.name === 'Profil' && pathname.startsWith('/profile/'));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-primary rounded-xl"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  style={{ zIndex: -1 }}
                />
              )}
              <item.icon className="h-[18px] w-[18px]" />
              <span>{item.name}</span>
              {item.name === 'Notifications' && (
                <span className="ml-auto w-5 h-5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  3
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="pt-4 mt-4 border-t border-border space-y-1">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all duration-200"
        >
          {theme === 'light' ? <Moon className="h-[18px] w-[18px]" /> : <Sun className="h-[18px] w-[18px]" />}
          <span>{theme === 'light' ? 'Mode sombre' : 'Mode clair'}</span>
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-xl transition-all duration-200"
        >
          <LogOut className="h-[18px] w-[18px]" />
          <span>Deconnexion</span>
        </button>
      </div>
    </div>
  );
}
