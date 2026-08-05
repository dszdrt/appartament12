import HeroSlideshow from '@/components/HeroSlideshow';
import RoomCard from '@/components/RoomCard';
import AnimatedSection from '@/components/AnimatedSection';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { db } from '@/lib/db';
import PremiumBookingCalendar from '@/components/PremiumBookingCalendar';
import BookingSearchWidget from '@/components/BookingSearchWidget';
import TrustSection from '@/components/TrustSection';
import LocationSection from '@/components/LocationSection';
import ReviewsSection from '@/components/ReviewsSection';

const DEFAULT_REAL_REVIEWS = [
  {
    id: 'yandex-1',
    authorName: 'Николай Лобанов',
    avatarUrl: null,
    rating: 5,
    dateText: '13 сентября 2025',
    text: 'Отличное место. Снимали апартаменты уже 2й год. Вере и Ане большое спасибо за создание нам хороших условий отдыха 2 недели. Расположение идеальное. Инфраструктура отличная. Море с хорошим пляжем в 5 минутах пешком. В следующем году планируем снова сюда!',
    source: 'Яндекс Карты',
    isPinned: true,
  },
  {
    id: 'yandex-2',
    authorName: 'Елена Лобанова',
    avatarUrl: null,
    rating: 5,
    dateText: '19 сентября 2025',
    text: 'Отличное место. Приезжаем не первый раз. Рекомендуем всем друзьям и знакомым. Инфраструктура (все рядом) 5+, отношение работников 5+',
    source: 'Яндекс Карты',
    isPinned: true,
  },
  {
    id: 'yandex-3',
    authorName: 'Виктория К.',
    avatarUrl: null,
    rating: 5,
    dateText: '3 января 2023',
    text: 'Отличный вариант как для одного,так и двух человек.Есть всё необходимое.Удобное зонирование комнаты и высокий потолок. Даже парадная очень понравилась 😊. Спасибо большое!',
    source: 'Яндекс Карты',
    isPinned: true,
  },
  {
    id: 'yandex-4',
    authorName: 'Alex Chemp',
    avatarUrl: null,
    rating: 5,
    dateText: '2 февраля 2023',
    text: 'Спасибо большое, отправлял дочку с подругой на 5 дней, апарты соответствует фотографиям, прекрасный дом и локация, все было великолепно. Спасибо за гостеприимство. Рекомендую',
    source: 'Яндекс Карты',
    isPinned: false,
  },
  {
    id: 'yandex-5',
    authorName: 'Кирилл С.',
    avatarUrl: null,
    rating: 5,
    dateText: '3 января 2023',
    text: 'Отличные апартаменты, отдыхал с женой все понравилось, оформление, персонал, все на высшем уровне.',
    source: 'Яндекс Карты',
    isPinned: false,
  },
  {
    id: 'yandex-6',
    authorName: 'Артём С.',
    avatarUrl: null,
    rating: 5,
    dateText: '1 апреля 2021',
    text: 'Здравствуйте, прекрасные апартаменты, адекватный персонал, быстрое оформление, так же достаточно удобно и уютно. Всем советую !',
    source: 'Яндекс Карты',
    isPinned: false,
  },
  {
    id: 'yandex-7',
    authorName: 'Даша Степанова',
    avatarUrl: null,
    rating: 5,
    dateText: '2 февраля 2023',
    text: 'Понравилось все, красиво, чисто, стильный и душевный интерьер, так же не мало важно -тепло.',
    source: 'Яндекс Карты',
    isPinned: false,
  },
];

export default async function HomePage({ searchParams }: { searchParams: Promise<{ start?: string, end?: string, guests?: string }> }) {
  const { start, end, guests } = await searchParams;

  const commonImages = await db.heroSlide.findMany({
    orderBy: { order: 'asc' }
  });

  const rooms = await db.room.findMany({
    where: { deletedAt: null, status: 'ACTIVE' },
    orderBy: { order: 'asc' },
    include: { images: { orderBy: { order: 'asc' } } }
  });

  const dbReviews = await db.review.findMany({
    where: { isVisible: true },
    orderBy: [
      { isPinned: 'desc' },
      { order: 'asc' },
      { createdAt: 'desc' }
    ]
  });

  const reviews = dbReviews.length > 0 ? dbReviews : DEFAULT_REAL_REVIEWS;

  // Determine unavailable rooms if dates are provided
  const unavailableRoomIds = new Set<string>();
  if (start && end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    // Check for guests capacity
    const guestCount = parseInt(guests || '2', 10);
    rooms.forEach(room => {
      if (room.capacity < guestCount) {
        unavailableRoomIds.add(room.id);
      }
    });

    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
      const conflicts = await db.roomAvailability.findMany({
        where: {
          date: { gte: startDate, lt: endDate }
        }
      });
      conflicts.forEach(c => unavailableRoomIds.add(c.roomId));
      
      const overlappingBookings = await db.booking.findMany({
        where: {
          status: { in: ["APPROVED", "PENDING"] },
          arrivalDate: { lt: endDate },
          departureDate: { gt: startDate },
        }
      });
      overlappingBookings.forEach(b => unavailableRoomIds.add(b.roomId));
    }
  }

  const settings = await db.siteSetting.findMany();
  const config: Record<string, string> = {};
  settings.forEach(s => { config[s.key] = s.value; });

  const heroTitle = config.heroTitle || "Место, где каждый номер — история";
  const aboutText = config.aboutText || "Apartments12 — это не просто отель. Это коллекция из 10 уникальных пространств, каждое из которых переносит вас в совершенно другой мир. От японского минимализма до африканского сафари — выберите свое путешествие.";

  return (
    <main>
      <HeroSlideshow images={commonImages.map(img => ({ src: img.url, alt: img.title || "Apartments12" }))} />

      {/* About Section */}
      <section className="pt-24 pb-12 px-6">
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
      <section id="rooms" className="pt-8 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <p className="text-gold tracking-[0.3em] uppercase text-sm mb-4">Коллекция</p>
            <h2 className="font-serif text-4xl md:text-5xl text-warm-white mb-8">
              Наши апартаменты
            </h2>
            <div className="relative -mt-4 mb-16 z-20">
              <BookingSearchWidget />
            </div>
            
            {start && end && (
              <div className="mb-8 p-4 bg-gold/10 border border-gold/30 rounded-xl inline-block">
                <p className="text-warm-white">
                  Показаны результаты для <span className="text-gold font-bold">{guests || 2} гостей</span> на даты: <span className="text-gold font-bold">{start} — {end}</span>
                </p>
                <Link href="/" className="text-sm text-warm-white/50 hover:text-gold transition-colors mt-2 inline-block">Сбросить поиск</Link>
              </div>
            )}
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
                  unavailable={unavailableRoomIds.has(room.id)}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <LocationSection />

      {/* Interactive Global Calendar Section */}
      <section id="calendar" className="py-20 px-6 bg-charcoal-light/30 border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <AnimatedSection>
            <h2 className="font-serif text-4xl md:text-5xl text-warm-white mb-6">
              Планируйте свой <span className="text-gold italic">отдых</span> заранее
            </h2>
            <p className="text-warm-white/60 text-lg mb-8 leading-relaxed">
              Наш интерактивный календарь позволяет вам быстро найти свободные даты. Зеленым отмечены дни, когда доступны все категории номеров. Если нужные вам даты заняты, мы всегда готовы предложить альтернативу.
            </p>
            <ul className="space-y-4 mb-10 text-warm-white/80">
              <li className="flex items-center gap-4">
                <div className="w-1.5 h-1.5 bg-gold rounded-full" />
                <span>Мгновенное подтверждение свободных номеров</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-1.5 h-1.5 bg-gold rounded-full" />
                <span>Гарантия лучшей цены при бронировании на сайте</span>
              </li>
            </ul>
            <Link href="/booking" className="btn-outline">К полному бронированию</Link>
          </AnimatedSection>
          
          <AnimatedSection delay={0.2}>
            <PremiumBookingCalendar rooms={rooms.map(r => ({ id: r.id, title: r.title }))} />
          </AnimatedSection>
        </div>
      </section>

      {/* Trust Section */}
      <TrustSection />

      {/* Reviews Section */}
      <ReviewsSection reviews={reviews} />

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
