"use client";

import AnimatedSection from "./AnimatedSection";
import { motion } from "framer-motion";
import { 
  MapPin, 
  Navigation as NavigationIcon, 
  ExternalLink, 
  Waves, 
  Plane, 
  TrainTrack, 
  UtensilsCrossed, 
  ShoppingBag 
} from "lucide-react";

const nearbyPlaces = [
  {
    icon: Waves,
    title: "Пляж",
    time: "5–7 мин пешком",
    desc: "Благоустроенный чистый морской пляж с шезлонгами",
  },
  {
    icon: Plane,
    title: "Аэропорт Сочи (AER)",
    time: "10–15 мин на такси",
    desc: "Быстрый трансфер без пробок",
  },
  {
    icon: TrainTrack,
    title: "Ж/Д вокзал Адлер",
    time: "5–10 мин",
    desc: "Удобно для путешествий на 'Ласточке' в Красную Поляну",
  },
  {
    icon: UtensilsCrossed,
    title: "Рестораны и кафе",
    time: "1–3 мин пешком",
    desc: "Лучшие заведения кубанской и кавказской кухни",
  },
  {
    icon: ShoppingBag,
    title: "Супермаркеты и аптеки",
    time: "2 мин пешком",
    desc: "Круглосуточные магазины в шаговой доступности",
  },
];

export default function LocationSection() {
  const address = "Краснодарский край, г. Сочи, ул. Ленина, 221/6";
  const yandexMapsUrl = "https://yandex.ru/maps/org/apartamenty_12/24464261805/";
  const routeUrl = "https://yandex.ru/maps/?rtext=~43.482832,39.893319";

  return (
    <section id="location" className="py-14 sm:py-20 md:py-24 px-4 sm:px-6 relative overflow-hidden bg-charcoal-light/20 border-t border-white/5">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <AnimatedSection className="text-center mb-10 sm:mb-16">
          <p className="text-gold tracking-[0.25em] uppercase text-[11px] sm:text-xs font-semibold mb-2 sm:mb-3">
            Локация & Окружение
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-warm-white mb-4 sm:mb-6">
            Расположение отеля
          </h2>
          <div className="line-gold w-16 sm:w-20 mx-auto mb-4 sm:mb-6" />
          <p className="text-warm-white/60 text-xs sm:text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Бутик-отель <span className="text-gold font-medium">Apartments12</span> расположен в удобном районе Сочи (Адлер), где все главное находится под рукой.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-stretch">
          {/* Map Column */}
          <div className="lg:col-span-7 flex flex-col">
            <AnimatedSection className="h-full flex flex-col">
              <div className="glass-light p-3.5 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl border border-white/10 flex-1 flex flex-col shadow-2xl relative">
                {/* Yandex Map Iframe */}
                <div className="w-full h-64 sm:h-80 lg:h-full min-h-[240px] sm:min-h-[320px] rounded-xl sm:rounded-2xl overflow-hidden relative border border-white/5">
                  <iframe
                    src="https://yandex.ru/map-widget/v1/?ll=39.893319%2C43.482832&z=16&pt=39.893319%2C43.482832%2Cpm2gLm"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allowFullScreen={true}
                    loading="lazy"
                    title="Карта расположения Apartments12"
                    className="w-full h-full filter saturate-[0.85] contrast-[1.05]"
                  ></iframe>
                </div>

                {/* Address & Action Buttons below map */}
                <div className="pt-4 sm:pt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-start gap-2.5">
                    <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-gold/10 text-gold border border-gold/20 shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs text-warm-white/40 uppercase tracking-widest font-medium mb-0.5">
                        Наш адрес
                      </p>
                      <p className="text-warm-white font-sans text-xs sm:text-sm md:text-base font-semibold leading-snug">
                        {address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    <a
                      href={yandexMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline text-[10px] sm:text-xs py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl flex items-center justify-center gap-1.5 flex-1 sm:flex-none"
                    >
                      <span>Яндекс.Карты</span>
                      <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </a>
                    <a
                      href={routeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-gold text-[10px] sm:text-xs py-2 sm:py-2.5 px-3.5 sm:px-4 rounded-xl flex items-center justify-center gap-1.5 flex-1 sm:flex-none"
                    >
                      <NavigationIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span>Маршрут</span>
                    </a>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Nearby Places Column */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
            <AnimatedSection>
              <h3 className="font-serif text-xl sm:text-2xl text-warm-white mb-3 sm:mb-6 flex items-center gap-3">
                <span>Инфраструктура рядом</span>
                <span className="h-[1px] flex-1 bg-gold/20"></span>
              </h3>

              <div className="space-y-2.5 sm:space-y-3">
                {nearbyPlaces.map((place, idx) => {
                  const Icon = place.icon;
                  return (
                    <motion.div
                      key={idx}
                      whileHover={{ x: 3 }}
                      className="glass-light p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-white/5 hover:border-gold/30 transition-all duration-300 flex items-start gap-3 sm:gap-4 group"
                    >
                      <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gold/10 text-gold border border-gold/20 group-hover:bg-gold group-hover:text-charcoal transition-all duration-300 shrink-0">
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <h4 className="font-sans text-xs sm:text-base text-warm-white font-semibold group-hover:text-gold transition-colors truncate">
                            {place.title}
                          </h4>
                          <span className="text-[10px] sm:text-xs text-gold font-medium bg-gold/10 px-2 py-0.5 rounded-full border border-gold/20 shrink-0">
                            {place.time}
                          </span>
                        </div>
                        <p className="text-warm-white/50 text-[11px] sm:text-xs font-light leading-relaxed">
                          {place.desc}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
