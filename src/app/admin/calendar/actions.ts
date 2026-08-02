"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function blockDateRange(formData: FormData) {
  const roomId = formData.get("roomId") as string;
  const status = formData.get("status") as string;
  const startDateStr = formData.get("startDate") as string;
  const endDateStr = formData.get("endDate") as string;

  if (!roomId || !status || !startDateStr || !endDateStr) {
    throw new Error("Missing fields");
  }

  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  
  if (start > end) {
    throw new Error("Start date must be before end date");
  }

  // Generate array of dates between start and end (inclusive)
  const datesToBlock = [];
  let currentDate = new Date(start);
  while (currentDate <= end) {
    datesToBlock.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Upsert each date
  for (const date of datesToBlock) {
    // Normalize time to midnight UTC for consistent querying
    date.setUTCHours(0, 0, 0, 0);

    await db.roomAvailability.upsert({
      where: {
        roomId_date: {
          roomId: roomId,
          date: date,
        }
      },
      update: {
        status: status,
      },
      create: {
        roomId: roomId,
        date: date,
        status: status,
      }
    });
  }

  revalidatePath("/admin/calendar");
  revalidatePath("/booking");
}

export async function unblockDateRange(formData: FormData) {
  const roomId = formData.get("roomId") as string;
  const startDateStr = formData.get("startDate") as string;
  const endDateStr = formData.get("endDate") as string;

  if (!roomId || !startDateStr || !endDateStr) {
    throw new Error("Missing fields");
  }

  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  start.setUTCHours(0, 0, 0, 0);
  end.setUTCHours(0, 0, 0, 0);

  await db.roomAvailability.deleteMany({
    where: {
      roomId,
      date: {
        gte: start,
        lte: end
      }
    }
  });

  revalidatePath("/admin/calendar");
  revalidatePath("/booking");
}
