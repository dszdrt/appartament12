import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db as prisma } from "@/lib/db";
import { roomMeta } from "@/lib/room-data";
import { getAllRooms, getCommonImages } from "@/lib/images";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // 1. Seed admin
    const passwordHash = await bcrypt.hash("admin123", 10);
    await prisma.admin.upsert({
      where: { username: "admin" },
      update: {},
      create: { username: "admin", passwordHash },
    });

    // 2. Seed settings
    const defaultSettings = [
      { key: "hotelName", value: "Apartments12" },
      { key: "phone", value: "+7 (999) 000-00-00" },
      { key: "email", value: "info@apartments12.ru" },
      { key: "address", value: "Москва, ул. Примерная, 12" },
    ];
    for (const setting of defaultSettings) {
      await prisma.siteSetting.upsert({
        where: { key: setting.key },
        update: {},
        create: setting,
      });
    }

    // 3. Migrate rooms
    const rooms = getAllRooms();
    for (const room of rooms) {
      const meta = roomMeta[room.slug];
      if (!meta) continue;

      const priceStr = meta.price.replace(/\D/g, "");
      const price = parseInt(priceStr, 10) || 5000;

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
        },
      });

      for (const amenityName of meta.amenities) {
        let amenity = await prisma.amenity.findUnique({ where: { name: amenityName } });
        if (!amenity) {
          amenity = await prisma.amenity.create({ data: { name: amenityName } });
        }
        await prisma.room.update({
          where: { id: dbRoom.id },
          data: { amenities: { connect: { id: amenity.id } } },
        });
      }

      if (room.images.length > 0) {
        await prisma.roomImage.deleteMany({ where: { roomId: dbRoom.id } });
        const imagesData = room.images.map((img, index) => ({
          url: img.src,
          order: index,
          isCover: index === 0,
          roomId: dbRoom.id,
        }));
        await prisma.roomImage.createMany({ data: imagesData });
      }
    }

    // 4. Hero slides
    const commonImages = getCommonImages();
    await prisma.heroSlide.deleteMany();
    if (commonImages.length > 0) {
      await prisma.heroSlide.createMany({
        data: commonImages.map((img, idx) => ({ url: img.src, order: idx })),
      });
    }

    return NextResponse.json({ success: true, message: "Migration completed successfully!" });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
