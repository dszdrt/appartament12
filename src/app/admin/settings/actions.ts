"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function saveSiteSettings(formData: FormData) {
  const allowedKeys = ["hotelName", "seoTitle", "seoDescription", "contactPhone", "contactEmail", "contactAddress", "heroTitle", "aboutText"];
  
  for (const key of allowedKeys) {
    const value = formData.get(key);
    if (typeof value === "string") {
      await db.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value }
      });
    }
  }

  revalidatePath("/");
  revalidatePath("/admin/settings");
}
