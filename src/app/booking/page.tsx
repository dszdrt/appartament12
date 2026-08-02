import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AnimatedSection from '@/components/AnimatedSection';
import { db } from '@/lib/db';
import BookingForm from './BookingForm';

export default async function BookingPage() {
  const rooms = await db.room.findMany({
    where: { status: 'ACTIVE', deletedAt: null },
    orderBy: { order: 'asc' },
    select: { id: true, title: true }
  });

  return (
    <main>
      <Navigation />

      <section className="pt-32 pb-20 px-6 min-h-screen">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <p className="text-gold tracking-[0.3em] uppercase text-sm mb-4">Бронирование</p>
            <h1 className="font-serif text-5xl md:text-6xl text-warm-white mb-6">
              Забронировать
            </h1>
            <div className="line-gold w-16 mx-auto mb-6" />
            <p className="text-warm-white/50 text-lg">
              Выберите даты и номер для вашего идеального отдыха
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <BookingForm rooms={rooms} />
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </main>
  );
}
