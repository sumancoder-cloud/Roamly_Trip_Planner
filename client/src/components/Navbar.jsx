import { FiCompass, FiMenu, FiMoon, FiSun, FiX } from "react-icons/fi";
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/_core/hooks/useAuth.jsx';
import { useTheme } from '@/contexts/ThemeContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [, setLocation] = useLocation();

  const handleLoginClick = () => {
    setLocation('/login');
  };

  return (
    <motion.nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${isScrolled ? 'border-b border-slate-200/80 bg-white/80 backdrop-blur' : 'bg-transparent'}`} initial={{ y: -24 }} animate={{ y: 0 }} transition={{ duration: 0.3 }}>
      <div className="container flex h-16 items-center justify-between md:h-20">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
            <FiCompass className="h-5 w-5" />
          </div>
          <div>
            <div className="text-base font-semibold text-slate-900">Roamly</div>
            <div className="text-xs text-slate-500">calm trip planning</div>
          </div>
        </div>

        <div className="hidden items-center gap-6 md:flex">
          <a href="#how-it-works" className="text-sm text-slate-600 hover:text-emerald-600">How it works</a>
          <a href="#features" className="text-sm text-slate-600 hover:text-emerald-600">Features</a>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm"
          >
            {theme === 'dark' ? <FiSun className="h-4 w-4" /> : <FiMoon className="h-4 w-4" />}
          </button>
          {isAuthenticated ? (
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
              <button onClick={() => setLocation('/dashboard')} className="hidden sm:inline">{user?.name}</button>
              <button onClick={logout} className="text-slate-500 hover:text-emerald-600">Logout</button>
            </div>
          ) : (
            <Button onClick={handleLoginClick} size="sm">Login</Button>
          )}
          <button className="rounded-full p-2 hover:bg-slate-100 md:hidden" onClick={() => setIsMobileMenuOpen((open) => !open)}>
            {isMobileMenuOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen ? (
        <div className="border-t border-slate-200 bg-white/95 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3 text-sm text-slate-600">
            <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)}>How it works</a>
            <a href="#features" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
          </div>
        </div>
      ) : null}
    </motion.nav>
  );
}
