import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function main() {
  const rooms = [
    { slug: 'luxury-suite', title: 'Luxury Suite', price: 8000, capacity: 2, order: 1 },
    { slug: 'family-room', title: 'Family Room', price: 6000, capacity: 4, order: 2 },
    { slug: 'minimal-room', title: 'Minimal Room', price: 4000, capacity: 2, order: 3 },
    { slug: 'sea-view-room', title: 'Sea View Room', price: 9000, capacity: 3, order: 4 },
    { slug: 'premium-room', title: 'Premium Room', price: 12000, capacity: 2, order: 5 },
  ];

  for (const r of rooms) {
    await db.room.upsert({
      where: { slug: r.slug },
      update: { title: r.title, price: r.price, capacity: r.capacity, status: 'ACTIVE', order: r.order, deletedAt: null },
      create: { slug: r.slug, title: r.title, subtitle: 'Test room', description: 'This is a test room.', price: r.price, capacity: r.capacity, status: 'ACTIVE', order: r.order }
    });
    console.log('Upserted ' + r.slug);
  }
}

main().catch(console.error).finally(() => db.$disconnect());
