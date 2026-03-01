'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, User, Users, Settings, LogOut, Search, Bell, Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from './ThemeProvider';

const navigation = [
  { name: 'Fil', href: '/', icon: Home },
  { name: 'Profil', href: '/profile/me', icon: User },
  { name: 'Camarades', href: '/classmates', icon: Users },
  { name: 'Notifications', href: '#', icon: Bell, badge: 3 },
  { name: 'Paramètres', href: '/settings', icon: Settings },
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
          <div className="relative">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <img
              src="/images/university-logo.png"
              alt="Logo Université"
              className="relative h-10 w-10 object-contain transition-transform duration-300 group-hover:scale-110"
              crossOrigin="anonymous"
            />
          </div>
          <div>
            <h1 className="text-lg font-bold gradient-text">UniSocial</h1>
            <p className="text-[11px] text-muted-foreground leading-none">Réseau Universitaire</p>
          </div>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-full pl-10 pr-3 py-2.5 bg-muted/50 border border-transparent rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/30 focus:bg-card focus:shadow-sm focus:shadow-primary/5 transition-all duration-300"
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
              className={`relative flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 group ${isActive
                  ? 'text-white shadow-md shadow-primary/25'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl gradient-primary"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  style={{ zIndex: -1 }}
                />
              )}
              <item.icon className={`h-[18px] w-[18px] transition-transform duration-200 ${!isActive ? 'group-hover:scale-110' : ''}`} />
              <span>{item.name}</span>
              {item.badge && (
                <span className="ml-auto notification-badge">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="pt-4 mt-4 border-t border-border/50 space-y-1">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-xl transition-all duration-300 group"
        >
          <div className="relative">
            {theme === 'light' ? (
              <Moon className="h-[18px] w-[18px] transition-transform duration-300 group-hover:rotate-12" />
            ) : (
              <Sun className="h-[18px] w-[18px] transition-transform duration-300 group-hover:rotate-45" />
            )}
          </div>
          <span>{theme === 'light' ? 'Mode sombre' : 'Mode clair'}</span>
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all duration-300 group"
        >
          <LogOut className="h-[18px] w-[18px] transition-transform duration-300 group-hover:-translate-x-0.5" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
}
