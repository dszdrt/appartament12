import { notFound } from 'next/navigation';
import Navigation from '@/components/Navigation';
import RoomGallery from '@/components/RoomGallery';
import BookingCard from '@/components/BookingCard';
import AnimatedSection from '@/components/AnimatedSection';
import Footer from '@/components/Footer';
import { db } from '@/lib/db';
import type { Metadata } from 'next';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const rooms = await db.room.findMany({ select: { slug: true } });
  return rooms.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const room = await db.room.findUnique({ where: { slug } });
  if (!room) return {};
  
  return {
    title: `${room.title} — Apartments12`,
    description: room.seoDescription || room.description || `Апартаменты ${room.title} в бутик-отеле Apartments12`,
  };
}

export default async function RoomPage({ params }: PageProps) {
  const { slug } = await params;
  const room = await db.room.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { order: 'asc' } },
      amenities: true,
    }
  });

  if (!room || room.status !== 'ACTIVE' || room.deletedAt) {
    notFound();
  }

  const roomImages = room.images.map(img => ({ src: img.url, alt: room.title }));

  return (
    <main>
      <Navigation />

      {/* Hero */}
      <section className="pt-24 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <Link href="/#rooms" className="text-gold text-sm tracking-[0.15em] uppercase hover:text-gold-light transition-colors inline-flex items-center gap-2 mb-8">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Все номера
            </Link>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="flex items-baseline gap-4 mb-4">
              <span className="text-gold/20 font-serif text-7xl md:text-8xl font-bold">{'0' + room.order}</span>
              <h1 className="font-serif text-4xl md:text-6xl text-warm-white">{room.title}</h1>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="line-gold w-16 mb-8" />
          </AnimatedSection>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Gallery + Info */}
          <div className="lg:col-span-2 space-y-12">
            <AnimatedSection>
              <RoomGallery images={roomImages} />
            </AnimatedSection>

            {/* Description */}
            <AnimatedSection>
              <h2 className="font-serif text-2xl text-warm-white mb-4">Об апартаментах</h2>
              <p className="text-warm-white/60 leading-relaxed text-lg whitespace-pre-line">
                {room.description}
              </p>
            </AnimatedSection>

            {/* Details */}
            <AnimatedSection>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="glass-light p-6 text-center">
                  <div className="text-gold text-2xl mb-2">
                    <svg className="w-6 h-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V6a2 2 0 012-2h12a2 2 0 012 2v2M4 8v10a2 2 0 002 2h12a2 2 0 002-2V8M4 8h16" />
                    </svg>
                  </div>
                  <p className="text-warm-white text-lg font-serif">{room.area} м²</p>
                  <p className="text-warm-white/40 text-xs tracking-wider uppercase mt-1">Площадь</p>
                </div>
                <div className="glass-light p-6 text-center">
                  <div className="text-gold text-2xl mb-2">
                    <svg className="w-6 h-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <p className="text-warm-white text-lg font-serif">{room.capacity} {room.capacity > 2 ? 'гостя' : 'гостя'}</p>
                  <p className="text-warm-white/40 text-xs tracking-wider uppercase mt-1">Вместимость</p>
                </div>
                <div className="glass-light p-6 text-center">
                  <div className="text-gold text-2xl mb-2">
                    <svg className="w-6 h-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-warm-white text-lg font-serif">14:00 / 12:00</p>
                  <p className="text-warm-white/40 text-xs tracking-wider uppercase mt-1">Заезд / Выезд</p>
                </div>
              </div>
            </AnimatedSection>

            {/* Amenities */}
            <AnimatedSection>
              <h2 className="font-serif text-2xl text-warm-white mb-6">Удобства</h2>
              <div className="flex flex-wrap gap-3">
                {room.amenities.map((amenity) => (
                  <span
                    key={amenity.id}
                    className="glass-light px-4 py-2 text-warm-white/60 text-sm tracking-wider"
                  >
                    {amenity.name}
                  </span>
                ))}
              </div>
            </AnimatedSection>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <BookingCard
              roomId={room.id}
              roomName={room.title}
              price={`от ${room.price.toLocaleString("ru-RU")} ₽`}
              capacity={room.capacity}
            />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
