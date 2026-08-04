'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { href: '/', label: 'Главная' },
    { href: '/#rooms', label: 'Номера' },
    { href: '/#location', label: 'Расположение' },
    { href: '/#calendar', label: 'Занятость' },
    { href: '/#trust', label: 'Преимущества' },
    { href: '/#reviews', label: 'Отзывы' },
    { href: '/gallery', label: 'Галерея' },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className={`fixed top-0 left-0 right-0 z-[110] transition-all duration-500 ${
          isScrolled
            ? 'glass py-3'
            : 'bg-transparent py-4 sm:py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="relative z-50 flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <Image
              src="/images/logo.png"
              alt="Apartments12"
              width={40}
              height={40}
              className="filter-gold opacity-90 group-hover:opacity-100 transition-all duration-300 object-contain w-8 h-8 sm:w-10 sm:h-10"
            />
            <span className="font-serif text-lg sm:text-xl tracking-wider text-warm-white group-hover:text-gold transition-colors duration-300 whitespace-nowrap">
              Apartments<span className="text-gold">12</span>
            </span>
          </Link>

          {/* Desktop Nav (lg screens and up) */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-7 shrink-0">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs xl:text-sm tracking-[0.12em] uppercase text-warm-white/70 hover:text-gold transition-colors duration-300 whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/booking"
              className="btn-gold text-[11px] xl:text-xs px-4 xl:px-6 py-2.5 xl:py-3 whitespace-nowrap rounded-lg shrink-0"
            >
              Забронировать
            </Link>
          </nav>

          {/* Mobile/Tablet Menu Button (shows on screens < lg) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden relative z-[120] w-10 h-10 flex flex-col justify-center items-end gap-1.5 cursor-pointer shrink-0"
            aria-label="Меню"
          >
            <motion.span
              animate={isMobileMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="w-6 h-[1px] bg-warm-white block"
            />
            <motion.span
              animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="w-6 h-[1px] bg-warm-white block"
            />
            <motion.span
              animate={isMobileMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="w-6 h-[1px] bg-warm-white block"
            />
          </button>
        </div>
      </motion.header>

      {/* Mobile/Tablet Menu Overlay */}
      <div 
        className={`fixed inset-0 z-[100] bg-charcoal/98 backdrop-blur-2xl overflow-y-auto pt-24 pb-12 px-6 flex flex-col items-center justify-start sm:justify-center transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <nav className={`w-full max-w-sm flex flex-col items-center gap-4 sm:gap-5 transition-transform duration-500 delay-100 ${isMobileMenuOpen ? 'translate-y-0' : 'translate-y-6'}`}>
          {navLinks.map((link) => (
            <div key={link.href} className="w-full text-center">
              <Link
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-serif text-2xl sm:text-3xl text-warm-white hover:text-gold transition-colors block py-1"
              >
                {link.label}
              </Link>
            </div>
          ))}
          <div className="pt-4 w-full flex justify-center">
            <Link
              href="/booking"
              onClick={() => setIsMobileMenuOpen(false)}
              className="btn-gold text-xs py-3.5 px-8 rounded-full"
            >
              Забронировать
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
