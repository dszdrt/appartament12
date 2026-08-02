"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addGalleryImage(url: string) {
  const maxOrder = await db.gallery.findFirst({
    orderBy: { order: 'desc' },
    select: { order: true }
  });
  
  await db.gallery.create({
    data: {
      url,
      order: (maxOrder?.order ?? -1) + 1,
    }
  });
  revalidatePath("/admin/gallery");
  revalidatePath("/");
}

export async function removeGalleryImage(id: string) {
  await db.gallery.delete({
    where: { id }
  });
  revalidatePath("/admin/gallery");
  revalidatePath("/");
}

export async function reorderGalleryImages(orderedIds: string[]) {
  // Update order based on index
  for (let i = 0; i < orderedIds.length; i++) {
    await db.gallery.update({
      where: { id: orderedIds[i] },
      data: { order: i }
    });
  }
  revalidatePath("/admin/gallery");
  revalidatePath("/");
}
