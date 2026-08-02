'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-charcoal border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/images/logo.png"
                alt="Apartments12"
                width={40}
                height={40}
                className="opacity-80 object-contain"
              />
              <h2 className="font-serif text-2xl text-warm-white">
                Apartments<span className="text-gold">12</span>
              </h2>
            </div>
            <p className="text-warm-white/40 text-sm leading-relaxed max-w-xs">
              Уникальный бутик-отель с 10 тематическими апартаментами. Каждый номер — это путешествие.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-gold text-xs tracking-[0.2em] uppercase mb-6">Навигация</h3>
            <nav className="flex flex-col gap-3">
              {[
                { href: '/', label: 'Главная' },
                { href: '/#rooms', label: 'Номера' },
                { href: '/gallery', label: 'Галерея' },
                { href: '/booking', label: 'Бронирование' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-warm-white/50 hover:text-gold transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gold text-xs tracking-[0.2em] uppercase mb-6">Контакты</h3>
            <div className="space-y-3 text-warm-white/50 text-sm">
              <p>+7 (999) 123-45-67</p>
              <p>info@apartments12.ru</p>
              <p>Ежедневно с 08:00 до 22:00</p>
            </div>
          </div>
        </div>

        <div className="line-gold mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-warm-white/20 text-xs tracking-wider">
            © {new Date().getFullYear()} Apartments12. Все права защищены.
          </p>
          <p className="text-warm-white/20 text-xs tracking-wider">
            Designed with ♥
          </p>
        </div>
      </div>
    </footer>
  );
}
