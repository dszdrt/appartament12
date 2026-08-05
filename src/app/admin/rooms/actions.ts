"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const RoomSchema = z.object({
  title: z.string().min(2, "Название должно содержать не менее 2 символов"),
  slug: z.string().min(2, "URL-алиас не может быть пустым"),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  price: z.number().min(100, "Цена должна быть не менее 100 ₽"),
  capacity: z.number().min(1, "Вместимость должна быть от 1 человека"),
  beds: z.number().min(1, "Количество кроватей должно быть не менее 1"),
  area: z.number().min(5, "Площадь должна быть не менее 5 м²"),
  status: z.enum(["ACTIVE", "DISABLED"]).default("ACTIVE"),
});

export async function saveRoom(formData: FormData, roomId?: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const rawData = {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    subtitle: (formData.get("subtitle") as string) || undefined,
    description: (formData.get("description") as string) || undefined,
    price: parseInt(formData.get("price") as string, 10) || 0,
    capacity: parseInt(formData.get("capacity") as string, 10) || 2,
    beds: parseInt(formData.get("beds") as string, 10) || 1,
    area: parseInt(formData.get("area") as string, 10) || 20,
    status: (formData.get("status") as string) || "ACTIVE",
  };

  const parseResult = RoomSchema.safeParse(rawData);
  if (!parseResult.success) {
    const errorMsg = parseResult.error.issues.map(i => i.message).join(", ");
    throw new Error(errorMsg);
  }

  const data = parseResult.data;

  // Image handling
  const imageUrls = formData.getAll("images[]") as string[];
  const coverImageUrl = formData.get("coverImage") as string;

  let room;
  
  if (roomId) {
    room = await db.room.update({
      where: { id: roomId },
      data,
    });
    // Clear old images
    await db.roomImage.deleteMany({ where: { roomId } });
  } else {
    room = await db.room.create({
      data,
    });
  }

  // Create new images
  if (imageUrls.length > 0) {
    await db.roomImage.createMany({
      data: imageUrls.map((url, index) => ({
        url,
        roomId: room.id,
        order: index,
        isCover: url === coverImageUrl || index === 0,
      })),
    });
  }

  revalidatePath("/", "layout");
  revalidatePath("/rooms", "layout");
  revalidatePath("/admin/rooms", "layout");
}

export async function deleteRoom(id: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  await db.room.update({
    where: { id },
    data: { 
      deletedAt: new Date(),
      status: 'DISABLED',
    },
  });
  
  // Clear future availability for the soft-deleted room
  await db.roomAvailability.deleteMany({
    where: {
      roomId: id,
      date: {
        gte: new Date()
      }
    }
  });

  revalidatePath("/admin/rooms");
  revalidatePath("/admin/calendar");
  revalidatePath("/booking");
}
