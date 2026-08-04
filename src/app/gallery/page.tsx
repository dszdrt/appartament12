import MasonryGallery from '@/components/MasonryGallery';
import AnimatedSection from '@/components/AnimatedSection';
import Footer from '@/components/Footer';
import { db } from '@/lib/db';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Галерея — Apartments12',
  description: 'Фотогалерея бутик-отеля Apartments12. Территория, интерьеры и атмосфера.',
};

export default async function GalleryPage() {
  // Get gallery images from DB
  const galleryImages = await db.gallery.findMany({
    orderBy: { order: 'asc' },
  });

  // Also get room images for a richer gallery
  const rooms = await db.room.findMany({
    where: { deletedAt: null, status: 'ACTIVE' },
    orderBy: { order: 'asc' },
    include: {
      images: { orderBy: { order: 'asc' }, take: 2 },
    },
  });

  const allImages = [
    ...galleryImages.map((img) => ({ src: img.url, alt: 'Apartments12' })),
    ...rooms.flatMap((room) =>
      room.images.map((img) => ({
        src: img.url,
        alt: `${room.title} — Apartments12`,
      }))
    ),
  ];

  return (
    <main>
      {/* Header */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <AnimatedSection>
            <p className="text-gold tracking-[0.3em] uppercase text-sm mb-4">Фотогалерея</p>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <h1 className="font-serif text-5xl md:text-6xl text-warm-white mb-6">
              Галерея
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <div className="line-gold w-16 mx-auto mb-6" />
          </AnimatedSection>
          <AnimatedSection delay={0.3}>
            <p className="text-warm-white/50 text-lg max-w-lg mx-auto">
              Каждый кадр — приглашение в мир комфорта и эстетики
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Gallery */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          {allImages.length > 0 ? (
            <MasonryGallery images={allImages} />
          ) : (
            <p className="text-center text-warm-white/50 text-lg py-20">
              Галерея пока пуста
            </p>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
