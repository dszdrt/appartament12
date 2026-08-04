import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/db';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, MessageSquare } from 'lucide-react';

export default async function Footer() {
  const settings = await db.siteSetting.findMany();
  const config: Record<string, string> = {};
  settings.forEach((s) => {
    config[s.key] = s.value;
  });

  const phone = config.contactPhone || '+7 (999) 123-45-67';
  const email = config.contactEmail || 'info@apartments12.ru';
  const address = config.contactAddress || 'Краснодарский край, г. Сочи, ул. Ленина, 221/6';
  const hotelName = config.hotelName || 'Apartments12';
  const maxUrl = config.maxUrl || 'https://max.ru';

  // Format phone for tel: link
  const phoneClean = phone.replace(/[^0-9+]/g, '');

  return (
    <footer className="bg-charcoal border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/images/logo.png"
                alt={hotelName}
                width={40}
                height={40}
                className="filter-gold opacity-80 object-contain"
              />
              <h2 className="font-serif text-2xl text-warm-white">
                Apartments<span className="text-gold">12</span>
              </h2>
            </div>
            <p className="text-warm-white/40 text-sm leading-relaxed max-w-xs mb-6">
              Уникальный бутик-отель с 10 тематическими апартаментами в Сочи. Каждый номер — это новое эмоциональное путешествие.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-gold text-xs tracking-[0.2em] uppercase mb-6 font-semibold">Навигация</h3>
            <nav className="flex flex-col gap-3">
              {[
                { href: '/', label: 'Главная' },
                { href: '/#rooms', label: 'Номера' },
                { href: '/#trust', label: 'Преимущества' },
                { href: '/#location', label: 'Расположение' },
                { href: '/#reviews', label: 'Отзывы' },
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

          {/* Address & Hours */}
          <div>
            <h3 className="text-gold text-xs tracking-[0.2em] uppercase mb-6 font-semibold">Адрес и время</h3>
            <div className="space-y-4 text-warm-white/60 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-gold shrink-0" />
                <span>Заезд 14:00 • Выезд 12:00</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <span>{email}</span>
              </div>
            </div>
          </div>

          {/* Messengers & Fast Action */}
          <div>
            <h3 className="text-gold text-xs tracking-[0.2em] uppercase mb-6 font-semibold">Связь с нами</h3>
            <div className="space-y-3">
              <a
                href={`tel:${phoneClean}`}
                className="flex items-center gap-3 text-warm-white hover:text-gold transition-colors text-base font-semibold"
              >
                <Phone className="w-4 h-4 text-gold" />
                <span>{phone}</span>
              </a>

              <div className="pt-2 flex flex-col gap-2.5">
                <a
                  href={maxUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gold/20 hover:bg-gold/30 text-gold border border-gold/30 rounded-xl px-4 py-2.5 text-xs font-medium flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(201,169,110,0.15)]"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Написать в MAX</span>
                </a>
                <a
                  href={`https://wa.me/${phoneClean.replace('+', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/30 rounded-xl px-4 py-2.5 text-xs font-medium flex items-center justify-center gap-2 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Написать в WhatsApp</span>
                </a>
                <a
                  href="https://t.me/apartments12_sochi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 border border-sky-400/30 rounded-xl px-4 py-2.5 text-xs font-medium flex items-center justify-center gap-2 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Написать в Telegram</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="line-gold mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-warm-white/20 text-xs tracking-wider">
            © {new Date().getFullYear()} {hotelName}. Все права защищены.
          </p>
          <p className="text-warm-white/20 text-xs tracking-wider">
            Сочи, ул. Ленина, 221/6
          </p>
        </div>
      </div>
    </footer>
  );
}
