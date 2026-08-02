import Navigation from '@/components/Navigation';
import HeroSlideshow from '@/components/HeroSlideshow';
import RoomCard from '@/components/RoomCard';
import AnimatedSection from '@/components/AnimatedSection';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { db } from '@/lib/db';

export default async function HomePage() {
  const commonImages = await db.heroSlide.findMany({
    orderBy: { order: 'asc' }
  });

  const rooms = await db.room.findMany({
    where: { deletedAt: null, status: 'ACTIVE' },
    orderBy: { order: 'asc' },
    include: { images: { orderBy: { order: 'asc' } } }
  });

  const settings = await db.siteSetting.findMany();
  const config: Record<string, string> = {};
  settings.forEach(s => { config[s.key] = s.value; });

  const heroTitle = config.heroTitle || "Место, где каждый номер — история";
  const aboutText = config.aboutText || "Apartments12 — это не просто отель. Это коллекция из 10 уникальных пространств, каждое из которых переносит вас в совершенно другой мир. От японского минимализма до африканского сафари — выберите свое путешествие.";

  return (
    <main>
      <Navigation />
      <HeroSlideshow images={commonImages.map(img => ({ src: img.url, alt: img.title || "Apartments12" }))} />

      {/* About Section */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <p className="text-gold tracking-[0.3em] uppercase text-sm mb-6">Добро пожаловать</p>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-warm-white mb-8 leading-tight">
              {heroTitle}
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <div className="line-gold w-16 mx-auto mb-8" />
          </AnimatedSection>
          <AnimatedSection delay={0.3}>
            <p className="text-warm-white/50 text-lg leading-relaxed max-w-2xl mx-auto whitespace-pre-line">
              {aboutText}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Rooms Section */}
      <section id="rooms" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <p className="text-gold tracking-[0.3em] uppercase text-sm mb-4">Коллекция</p>
            <h2 className="font-serif text-4xl md:text-5xl text-warm-white">
              Наши апартаменты
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {rooms.map((room, index) => {
              const coverImage = room.images.find(i => i.isCover)?.url || room.images[0]?.url || '';
              return (
                <RoomCard
                  key={room.slug}
                  slug={room.slug}
                  number={room.order}
                  nameRu={room.title}
                  shortDescription={room.subtitle || ''}
                  price={`от ${room.price.toLocaleString("ru-RU")} ₽`}
                  coverImage={coverImage}
                  index={index}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <AnimatedSection className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-5xl text-warm-white mb-6">
            Готовы к <span className="text-gold italic">путешествию</span>?
          </h2>
          <p className="text-warm-white/50 text-lg mb-10">
            Забронируйте свой уникальный опыт уже сегодня
          </p>
          <Link href="/booking" className="btn-gold">
            Забронировать номер
          </Link>
        </AnimatedSection>
      </section>

      <Footer />
    </main>
  );
}
