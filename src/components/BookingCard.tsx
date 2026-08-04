'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface BookingCardProps {
  roomId: string;
  roomName: string;
  price: string;
  capacity: number;
}

export default function BookingCard({ roomId, roomName, price, capacity }: BookingCardProps) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="glass-light rounded-sm p-8 sticky top-28"
    >
      {/* Price */}
      <div className="mb-6">
        <span className="font-serif text-3xl text-gold">{price}</span>
        <span className="text-warm-white/40 text-sm ml-2">/ ночь</span>
      </div>

      <div className="line-gold mb-6" />

      {/* Form */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="text-warm-white/40 text-xs tracking-[0.15em] uppercase block mb-2">
            Заезд
          </label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full bg-charcoal-light border border-white/10 text-warm-white px-4 py-3 text-sm focus:border-gold focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label className="text-warm-white/40 text-xs tracking-[0.15em] uppercase block mb-2">
            Выезд
          </label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full bg-charcoal-light border border-white/10 text-warm-white px-4 py-3 text-sm focus:border-gold focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label className="text-warm-white/40 text-xs tracking-[0.15em] uppercase block mb-2">
            Гости
          </label>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full bg-charcoal-light border border-white/10 text-warm-white px-4 py-3 text-sm focus:border-gold focus:outline-none transition-colors appearance-none"
          >
            {Array.from({ length: capacity }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? 'гость' : n < 5 ? 'гостя' : 'гостей'}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Link
        href={`/booking?roomId=${roomId}`}
        className="btn-gold w-full block text-center"
      >
        Забронировать
      </Link>

      <p className="text-warm-white/20 text-xs text-center mt-4">
        Бесплатная отмена за 24 часа
      </p>
    </motion.div>
  );
}
