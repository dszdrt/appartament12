'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

  const navLinks = [
    { href: '/', label: 'Главная' },
    { href: '/#rooms', label: 'Номера' },
    { href: '/#trust', label: 'Преимущества' },
    { href: '/#location', label: 'Расположение' },
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
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative z-50 flex items-center gap-3 group">
            <Image
              src="/images/logo.png"
              alt="Apartments12"
              width={48}
              height={48}
              className="filter-gold opacity-90 group-hover:opacity-100 transition-all duration-300 object-contain"
            />
            <span className="font-serif text-xl tracking-wider text-warm-white group-hover:text-gold transition-colors duration-300">
              Apartments<span className="text-gold">12</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm tracking-[0.15em] uppercase text-warm-white/70 hover:text-gold transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/booking"
              className="btn-gold text-xs px-6 py-3"
            >
              Забронировать
            </Link>
          </nav>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden relative z-[120] w-12 h-12 flex flex-col justify-center items-end gap-1.5 cursor-pointer"
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

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-[100] bg-charcoal/95 backdrop-blur-xl flex items-center justify-center transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <nav className={`flex flex-col items-center gap-8 transition-transform duration-500 delay-100 ${isMobileMenuOpen ? 'translate-y-0' : 'translate-y-10'}`}>
          {navLinks.map((link) => (
            <div key={link.href}>
              <Link
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-serif text-3xl text-warm-white hover:text-gold transition-colors block py-2"
              >
                {link.label}
              </Link>
            </div>
          ))}
          <div className="pt-4">
            <Link
              href="/booking"
              onClick={() => setIsMobileMenuOpen(false)}
              className="btn-gold"
            >
              Забронировать
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
