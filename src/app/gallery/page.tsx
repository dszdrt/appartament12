import Navigation from '@/components/Navigation';
import MasonryGallery from '@/components/MasonryGallery';
import AnimatedSection from '@/components/AnimatedSection';
import Footer from '@/components/Footer';
import { getCommonImages, getAllRooms } from '@/lib/images';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Галерея — Apartments12',
  description: 'Фотогалерея бутик-отеля Apartments12. Территория, интерьеры и атмосфера.',
};

export default function GalleryPage() {
  const commonImages = getCommonImages();
  const rooms = getAllRooms();
  
  // Combine common images with one image from each room for a richer gallery
  const allImages = [
    ...commonImages,
    ...rooms.flatMap(room => room.images.slice(0, 2).map(img => ({
      ...img,
      alt: `${room.nameRu} — Apartments12`,
    }))),
  ];

  return (
    <main>
      <Navigation />

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
          <MasonryGallery images={allImages} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
