'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe, User, Sparkles } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { supabase } from '@/lib/supabase';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const toggleLanguage = () => {
    const nextLang = i18n.language?.startsWith('en') ? 'hi' : 'en';
    i18n.changeLanguage(nextLang);
    localStorage.setItem('prajapati_lang', nextLang);
  };

  const navLinks = [
    { href: '/', label: mounted ? t('nav.home', 'Home') : 'Home' },
    { href: '/about', label: mounted ? t('nav.about', 'About') : 'About' },
    { href: '/directory', label: mounted ? t('nav.directory', 'Directory') : 'Directory' },
    { href: '/news', label: mounted ? t('nav.news', 'News') : 'News' },
    { href: '/events', label: mounted ? t('nav.events', 'Events') : 'Events' },
    { href: '/gallery', label: mounted ? t('nav.gallery', 'Gallery') : 'Gallery' },
    { href: '/complaints', label: mounted ? t('nav.complaints', 'Complaints') : 'Complaints' },
    { href: '/contact', label: mounted ? t('nav.contact', 'Contact') : 'Contact' },
  ];

  const displayLanguage = mounted && i18n.language?.startsWith('hi') ? 'English' : 'हिन्दी';

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-heading font-extrabold text-base sm:text-xl tracking-tight text-foreground bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                PrajapatiParivar
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden xl:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-full text-sm font-semibold transition-all ${isActive
                      ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="hidden xl:flex items-center space-x-3">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-border text-sm font-semibold hover:bg-secondary/50 text-foreground transition-all cursor-pointer"
            >
              <Globe className="w-4 h-4 text-muted-foreground" />
              <span>{displayLanguage}</span>
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Profile / Login */}
            {user ? (
              <Link
                href="/profile"
                className="flex items-center justify-center w-10 h-10 rounded-full border border-border hover:bg-secondary/50 text-foreground transition-all"
                title="Profile"
              >
                <User className="w-5 h-5 text-muted-foreground" />
              </Link>
            ) : (
              <Link
                href="/sign-in"
                className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-bold hover:opacity-90 shadow-sm transition-all text-sm"
              >
                {t('nav.login', 'Sign In')}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex xl:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full hover:bg-secondary/50 text-foreground border border-border transition-all cursor-pointer"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="xl:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <div className="space-y-1 px-4 py-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-2.5 rounded-2xl text-base font-semibold transition-all ${isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="border-t border-border my-3 pt-3 flex flex-col gap-3">
              {/* Mobile Language Toggle */}
              <button
                onClick={() => {
                  toggleLanguage();
                  setIsOpen(false);
                }}
                className="flex items-center justify-between w-full px-4 py-2.5 rounded-2xl border border-border text-base font-semibold hover:bg-secondary/50 text-foreground transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <span>Language</span>
                </div>
                <span className="text-sm text-primary font-bold">{displayLanguage}</span>
              </button>

              {/* Mobile Profile / Auth */}
              {user ? (
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-border text-base font-semibold hover:bg-secondary/50 text-foreground transition-all"
                >
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span>My Profile</span>
                </Link>
              ) : (
                <Link
                  href="/sign-in"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center py-3 rounded-2xl bg-primary text-primary-foreground font-bold hover:opacity-90 shadow-sm transition-all"
                >
                  {t('nav.login', 'Sign In')}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
