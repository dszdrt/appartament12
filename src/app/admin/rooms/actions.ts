"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveRoom(formData: FormData, roomId?: string) {
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const subtitle = formData.get("subtitle") as string;
  const description = formData.get("description") as string;
  const price = parseInt(formData.get("price") as string) || 0;
  const capacity = parseInt(formData.get("capacity") as string) || 2;
  const beds = parseInt(formData.get("beds") as string) || 1;
  const area = parseInt(formData.get("area") as string) || 20;
  const status = formData.get("status") as string;
  
  // Image handling
  const imageUrls = formData.getAll("images[]") as string[];
  const coverImageUrl = formData.get("coverImage") as string;

  const data = {
    title,
    slug,
    subtitle,
    description,
    price,
    capacity,
    beds,
    area,
    status,
  };

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

  revalidatePath("/");
  revalidatePath("/rooms");
  revalidatePath("/admin/rooms");
}

export async function deleteRoom(id: string) {
  await db.room.update({
    where: { id },
    data: { 
      deletedAt: new Date(),
      status: 'INACTIVE',
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
