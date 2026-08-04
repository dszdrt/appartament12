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
    <section id="trust" className="py-24 px-6 relative overflow-hidden bg-charcoal">
      {/* Glow background elements */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-gold/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <AnimatedSection className="text-center mb-16">
          <p className="text-gold tracking-[0.3em] uppercase text-xs font-semibold mb-3">
            Ваш идеальный отдых
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-warm-white mb-6">
            Почему гости выберут <span className="text-gold italic">Apartments12</span>
          </h2>
          <div className="line-gold w-20 mx-auto mb-6" />
          <p className="text-warm-white/60 text-base md:text-lg max-w-2xl mx-auto font-light">
            Мы позаботились обо всех деталях, чтобы ваше пребывание в Сочи было беззаботным, комфортным и вдохновляющим.
          </p>
        </AnimatedSection>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="glass-light p-8 rounded-3xl border border-white/5 hover:border-gold/30 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-6 text-gold group-hover:scale-110 group-hover:bg-gold group-hover:text-charcoal transition-all duration-300">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-serif text-xl text-warm-white font-bold mb-3 group-hover:text-gold transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-warm-white/50 text-sm leading-relaxed font-light">
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
