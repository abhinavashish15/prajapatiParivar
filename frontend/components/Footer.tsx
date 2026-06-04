'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Footer() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const quickLinks = [
    { href: '/', label: mounted ? t('nav.home', 'Home') : 'Home' },
    { href: '/directory', label: mounted ? t('nav.directory', 'Directory') : 'Directory' },
    { href: '/news', label: mounted ? t('nav.news', 'News') : 'News' },
    { href: '/events', label: mounted ? t('nav.events', 'Events') : 'Events' },
  ];

  const supportLinks = [
    { href: '/gallery', label: mounted ? t('nav.gallery', 'Gallery') : 'Gallery' },
    { href: '/complaints', label: mounted ? t('nav.complaints', 'Complaints') : 'Complaints' },
    { href: '/about', label: mounted ? t('nav.about', 'About') : 'About' },
    { href: '/contact', label: mounted ? t('nav.contact', 'Contact') : 'Contact' },
  ];

  return (
    <footer className="w-full border-t border-border bg-card text-muted-foreground transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="space-y-4 col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-heading font-extrabold text-lg sm:text-xl tracking-tight text-foreground bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                PrajapatiParivar
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm">
              {mounted ? t('home.heroSubtitle', 'The official digital directory, news, and events platform for the Prajapati community. Reconnect with families, find verified contacts, and celebrate our shared heritage.') : 'The official digital directory, news, and events platform for the Prajapati community.'}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3.5">
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground font-heading">
              {mounted ? t('nav.about', 'Samaj Info') : 'Samaj Info'}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary hover:underline transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-3.5">
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground font-heading">
              {mounted ? t('nav.complaints', 'Help Desk') : 'Help Desk'}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary hover:underline transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} PrajapatiParivar. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary hover:underline transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary hover:underline transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
