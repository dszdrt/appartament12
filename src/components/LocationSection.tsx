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
  const yandexMapsUrl = "https://yandex.ru/maps/?text=Сочи+улица+Ленина+221/6";
  const routeUrl = "https://yandex.ru/maps/?rtext=~43.468205,39.905646";

  return (
    <section id="location" className="py-24 px-6 relative overflow-hidden bg-charcoal-light/20 border-t border-white/5">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <AnimatedSection className="text-center mb-16">
          <p className="text-gold tracking-[0.3em] uppercase text-xs font-semibold mb-3">
            Локация & Окружение
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-warm-white mb-6">
            Расположение отеля
          </h2>
          <div className="line-gold w-20 mx-auto mb-6" />
          <p className="text-warm-white/60 text-base md:text-lg max-w-2xl mx-auto font-light">
            Бутик-отель <span className="text-gold font-medium">Apartments12</span> расположен в удобном районе Сочи (Адлер), где все главное находится под рукой.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Map Column */}
          <div className="lg:col-span-7 flex flex-col">
            <AnimatedSection className="h-full flex flex-col">
              <div className="glass-light p-4 md:p-6 rounded-3xl border border-white/10 flex-1 flex flex-col shadow-2xl relative">
                {/* Yandex Map Iframe */}
                <div className="w-full h-80 sm:h-96 lg:h-full min-h-[320px] rounded-2xl overflow-hidden relative border border-white/5">
                  <iframe
                    src="https://yandex.ru/map-widget/v1/?ll=39.905646%2C43.468205&z=16&pt=39.905646%2C43.468205%2Cpm2gLm"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allowFullScreen={true}
                    loading="lazy"
                    title="Карта расположения Apartments12"
                    className="w-full h-full filter saturate-[0.8] contrast-[1.1] grayscale-[0.2]"
                  ></iframe>
                </div>

                {/* Address & Action Buttons below map */}
                <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-gold/10 text-gold border border-gold/20 shrink-0 mt-0.5">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-warm-white/40 uppercase tracking-widest font-medium mb-1">
                        Наш адрес
                      </p>
                      <p className="text-warm-white font-serif text-base font-semibold">
                        {address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <a
                      href={yandexMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline text-[11px] py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 flex-1 sm:flex-none"
                    >
                      <span>Яндекс.Карты</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={routeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-gold text-[11px] py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 flex-1 sm:flex-none"
                    >
                      <NavigationIcon className="w-3.5 h-3.5" />
                      <span>Маршрут</span>
                    </a>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Nearby Places Column */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <AnimatedSection>
              <h3 className="font-serif text-2xl text-warm-white mb-6 flex items-center gap-3">
                <span>Инфраструктура рядом</span>
                <span className="h-[1px] flex-1 bg-gold/20"></span>
              </h3>
            </AnimatedSection>

            <div className="space-y-3">
              {nearbyPlaces.map((place, idx) => {
                const Icon = place.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                    whileHover={{ x: 4 }}
                    className="glass-light p-5 rounded-2xl border border-white/5 hover:border-gold/30 transition-all duration-300 flex items-start gap-4 group"
                  >
                    <div className="p-3 rounded-xl bg-gold/10 text-gold border border-gold/20 group-hover:bg-gold group-hover:text-charcoal transition-all duration-300 shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="font-serif text-base text-warm-white font-medium group-hover:text-gold transition-colors truncate">
                          {place.title}
                        </h4>
                        <span className="text-xs text-gold font-medium bg-gold/10 px-2.5 py-0.5 rounded-full border border-gold/20 shrink-0">
                          {place.time}
                        </span>
                      </div>
                      <p className="text-warm-white/50 text-xs font-light leading-relaxed">
                        {place.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
