import { PrismaClient } from '@prisma/client';
import { roomMeta } from '../src/lib/room-data';
import { getAllRooms } from '../src/lib/images';

const prisma = new PrismaClient();

async function main() {
  console.log('Migrating local data to DB...');
  
  const rooms = getAllRooms();

  for (const room of rooms) {
    const meta = roomMeta[room.slug];
    if (!meta) continue;

    console.log(`Migrating room: ${room.nameRu}`);

    // Parse price
    const priceStr = meta.price.replace(/\D/g, '');
    const price = parseInt(priceStr, 10) || 5000;

    // Create or update room
    const dbRoom = await prisma.room.upsert({
      where: { slug: room.slug },
      update: {},
      create: {
        slug: room.slug,
        title: room.nameRu,
        subtitle: meta.shortDescription,
        description: meta.description,
        price: price,
        capacity: meta.capacity,
        beds: 1,
        area: parseInt(meta.size) || 20,
        floor: 1,
        order: room.number,
      }
    });

    // Create amenities
    for (const amenityName of meta.amenities) {
      let amenity = await prisma.amenity.findUnique({ where: { name: amenityName }});
      if (!amenity) {
        amenity = await prisma.amenity.create({ data: { name: amenityName }});
      }
      // connect
      await prisma.room.update({
        where: { id: dbRoom.id },
        data: { amenities: { connect: { id: amenity.id } } }
      });
    }

    // Create images
    if (room.images.length > 0) {
      await prisma.roomImage.deleteMany({ where: { roomId: dbRoom.id }});
      const imagesData = room.images.map((img, index) => ({
        url: img.src,
        order: index,
        isCover: index === 0,
        roomId: dbRoom.id,
      }));
      await prisma.roomImage.createMany({ data: imagesData });
    }
  }

  // Migrate common images into Hero slides
  const { getCommonImages } = await import('../src/lib/images');
  const commonImages = getCommonImages();
  
  await prisma.heroSlide.deleteMany();
  if (commonImages.length > 0) {
    await prisma.heroSlide.createMany({
      data: commonImages.map((img, idx) => ({
        url: img.src,
        order: idx,
      }))
    });
  }

  console.log('Migration finished!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
