import Navigation from '@/components/Navigation';
import HeroSlideshow from '@/components/HeroSlideshow';
import RoomCard from '@/components/RoomCard';
import AnimatedSection from '@/components/AnimatedSection';
import Footer from '@/components/Footer';
import { getAllRooms, getCommonImages } from '@/lib/images';
import { roomMeta } from '@/lib/room-data';
import Link from 'next/link';

export default function HomePage() {
  const commonImages = getCommonImages();
  const rooms = getAllRooms();

  return (
    <main>
      <Navigation />
      <HeroSlideshow images={commonImages} />

      {/* About Section */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <p className="text-gold tracking-[0.3em] uppercase text-sm mb-6">Добро пожаловать</p>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-warm-white mb-8 leading-tight">
              Место, где каждый номер —{' '}
              <span className="text-gold italic">история</span>
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <div className="line-gold w-16 mx-auto mb-8" />
          </AnimatedSection>
          <AnimatedSection delay={0.3}>
            <p className="text-warm-white/50 text-lg leading-relaxed max-w-2xl mx-auto">
              Apartments 12 — это не просто отель. Это коллекция из 10 уникальных пространств,
              каждое из которых переносит вас в совершенно другой мир. От японского минимализма
              до африканского сафари — выберите свое путешествие.
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
              const meta = roomMeta[room.slug];
              return (
                <RoomCard
                  key={room.slug}
                  slug={room.slug}
                  number={room.number}
                  nameRu={room.nameRu}
                  shortDescription={meta?.shortDescription || ''}
                  price={meta?.price || ''}
                  coverImage={room.coverImage.src}
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
