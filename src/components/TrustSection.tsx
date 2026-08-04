"use client";

import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import { 
  MapPin, 
  Sparkles, 
  Wifi, 
  Wind, 
  Utensils, 
  Waves, 
  Heart, 
  Star 
} from "lucide-react";

const features = [
  {
    icon: Waves,
    title: "Близко к морю",
    description: "Всего 5–7 минут неспешной прогулки до благоустроенного пляжа Сочи",
  },
  {
    icon: Sparkles,
    title: "Уникальный дизайн",
    description: "10 авторских концептуальных номеров с премиальной отделкой и атмосферой",
  },
  {
    icon: MapPin,
    title: "Идеальная локация",
    description: "Сердце Адлера, улица Ленина: рядом транспорт, аэропорт, вокзал и рестораны",
  },
  {
    icon: Star,
    title: "Рейтинг 4.7 ★",
    description: "Официальный высокий рейтинг гостей на Яндекс.Путешествиях и Картах",
  },
  {
    icon: Utensils,
    title: "Собственная кухня",
    description: "Вся необходимая посуда, бытовая техника и зона для приготовления еды",
  },
  {
    icon: Wifi,
    title: "Бесплатный High-Speed Wi-Fi",
    description: "Стабильный скоростной интернет для отдыха и комфортной удаленной работы",
  },
  {
    icon: Wind,
    title: "Климат-контроль",
    description: "Современные тихие кондиционеры в каждом номере для идеальной температуры",
  },
  {
    icon: Heart,
    title: "Забота о семьях",
    description: "Уют, безопасность и тишина для гостей с детьми в любое время года",
  },
];

export default function TrustSection() {
  return (
    <section id="trust" className="py-14 sm:py-20 md:py-24 px-4 sm:px-6 relative overflow-hidden bg-charcoal">
      {/* Glow background elements */}
      <div className="absolute top-1/2 left-0 w-72 sm:w-96 h-72 sm:h-96 bg-gold/5 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <AnimatedSection className="text-center mb-10 sm:mb-16">
          <p className="text-gold tracking-[0.25em] uppercase text-[11px] sm:text-xs font-semibold mb-2 sm:mb-3">
            Ваш идеальный отдых
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-warm-white mb-4 sm:mb-6 leading-tight">
            Почему гости выбирают <span className="text-gold italic">Apartments12</span>
          </h2>
          <div className="line-gold w-16 sm:w-20 mx-auto mb-4 sm:mb-6" />
          <p className="text-warm-white/60 text-xs sm:text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Мы позаботились обо всех деталях, чтобы ваше пребывание в Сочи было беззаботным, комфортным и вдохновляющим.
          </p>
        </AnimatedSection>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6 md:gap-8">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: Math.min(idx * 0.04, 0.2) }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="glass-light p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-white/5 hover:border-gold/30 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-3 sm:mb-6 text-gold group-hover:scale-105 group-hover:bg-gold group-hover:text-charcoal transition-all duration-300">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                  </div>
                  <h3 className="font-sans text-base sm:text-lg md:text-xl text-warm-white font-bold mb-1.5 sm:mb-3 group-hover:text-gold transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-warm-white/50 text-xs sm:text-sm leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
