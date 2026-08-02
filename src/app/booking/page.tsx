'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AnimatedSection from '@/components/AnimatedSection';

const ROOMS = [
  'Япония', 'Охота', 'Кантри', 'Рим', 'Хай-тек',
  'Минимал', 'Сафари', 'Деревня', 'Север', 'Морской',
];

export default function BookingPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    room: '',
    checkIn: '',
    checkOut: '',
    guests: '1',
    promo: '',
    comments: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main>
      <Navigation />

      <section className="pt-32 pb-20 px-6 min-h-screen">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <p className="text-gold tracking-[0.3em] uppercase text-sm mb-4">Бронирование</p>
            <h1 className="font-serif text-5xl md:text-6xl text-warm-white mb-6">
              Забронировать
            </h1>
            <div className="line-gold w-16 mx-auto mb-6" />
            <p className="text-warm-white/50 text-lg">
              Выберите даты и номер для вашего идеального отдыха
            </p>
          </AnimatedSection>

          {!submitted ? (
            <AnimatedSection delay={0.2}>
              <form onSubmit={handleSubmit} className="glass-light p-8 md:p-12 space-y-6">
                {/* Personal Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-warm-white/40 text-xs tracking-[0.15em] uppercase block mb-2">Имя</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Ваше имя"
                      className="w-full bg-charcoal-light border border-white/10 text-warm-white px-4 py-3 text-sm focus:border-gold focus:outline-none transition-colors placeholder:text-warm-white/20"
                    />
                  </div>
                  <div>
                    <label className="text-warm-white/40 text-xs tracking-[0.15em] uppercase block mb-2">Телефон</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="+7 (999) 123-45-67"
                      className="w-full bg-charcoal-light border border-white/10 text-warm-white px-4 py-3 text-sm focus:border-gold focus:outline-none transition-colors placeholder:text-warm-white/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-warm-white/40 text-xs tracking-[0.15em] uppercase block mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                    className="w-full bg-charcoal-light border border-white/10 text-warm-white px-4 py-3 text-sm focus:border-gold focus:outline-none transition-colors placeholder:text-warm-white/20"
                  />
                </div>

                <div className="line-gold my-8" />

                {/* Booking Details */}
                <div>
                  <label className="text-warm-white/40 text-xs tracking-[0.15em] uppercase block mb-2">Номер</label>
                  <select
                    name="room"
                    value={formData.room}
                    onChange={handleChange}
                    required
                    className="w-full bg-charcoal-light border border-white/10 text-warm-white px-4 py-3 text-sm focus:border-gold focus:outline-none transition-colors appearance-none"
                  >
                    <option value="">Выберите номер</option>
                    {ROOMS.map((room, i) => (
                      <option key={room} value={room}>№{i + 1} {room}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-warm-white/40 text-xs tracking-[0.15em] uppercase block mb-2">Заезд</label>
                    <input
                      type="date"
                      name="checkIn"
                      value={formData.checkIn}
                      onChange={handleChange}
                      required
                      className="w-full bg-charcoal-light border border-white/10 text-warm-white px-4 py-3 text-sm focus:border-gold focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-warm-white/40 text-xs tracking-[0.15em] uppercase block mb-2">Выезд</label>
                    <input
                      type="date"
                      name="checkOut"
                      value={formData.checkOut}
                      onChange={handleChange}
                      required
                      className="w-full bg-charcoal-light border border-white/10 text-warm-white px-4 py-3 text-sm focus:border-gold focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-warm-white/40 text-xs tracking-[0.15em] uppercase block mb-2">Гости</label>
                    <select
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                      className="w-full bg-charcoal-light border border-white/10 text-warm-white px-4 py-3 text-sm focus:border-gold focus:outline-none transition-colors appearance-none"
                    >
                      <option value="1">1 гость</option>
                      <option value="2">2 гостя</option>
                      <option value="3">3 гостя</option>
                      <option value="4">4 гостя</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-warm-white/40 text-xs tracking-[0.15em] uppercase block mb-2">Промокод</label>
                  <input
                    type="text"
                    name="promo"
                    value={formData.promo}
                    onChange={handleChange}
                    placeholder="Введите промокод"
                    className="w-full bg-charcoal-light border border-white/10 text-warm-white px-4 py-3 text-sm focus:border-gold focus:outline-none transition-colors placeholder:text-warm-white/20"
                  />
                </div>

                <div>
                  <label className="text-warm-white/40 text-xs tracking-[0.15em] uppercase block mb-2">Комментарии</label>
                  <textarea
                    name="comments"
                    value={formData.comments}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Особые пожелания"
                    className="w-full bg-charcoal-light border border-white/10 text-warm-white px-4 py-3 text-sm focus:border-gold focus:outline-none transition-colors placeholder:text-warm-white/20 resize-none"
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-gold w-full mt-4"
                >
                  Забронировать
                </motion.button>

                <p className="text-warm-white/20 text-xs text-center">
                  Нажимая кнопку, вы соглашаетесь с условиями бронирования
                </p>
              </form>
            </AnimatedSection>
          ) : (
            <AnimatedSection>
              <div className="glass-light p-12 text-center">
                <div className="text-gold text-5xl mb-6">✓</div>
                <h2 className="font-serif text-3xl text-warm-white mb-4">
                  Спасибо за бронирование!
                </h2>
                <p className="text-warm-white/50 text-lg mb-8">
                  Мы свяжемся с вами в ближайшее время для подтверждения.
                </p>
                <a href="/" className="btn-outline inline-block">
                  На главную
                </a>
              </div>
            </AnimatedSection>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
