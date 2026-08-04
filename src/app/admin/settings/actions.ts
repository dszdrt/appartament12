"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function saveSiteSettings(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");
  
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
