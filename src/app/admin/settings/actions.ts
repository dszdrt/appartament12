"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function saveSiteSettings(formData: FormData) {
  const keys = Array.from(formData.keys());
  
  for (const key of keys) {
    // skip internal next.js or file upload keys if any
    if (key.startsWith('$ACTION')) continue;

    const value = formData.get(key) as string;
    
    await db.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    });
  }

  revalidatePath("/");
  revalidatePath("/admin/settings");
}
