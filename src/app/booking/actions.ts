"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function submitBooking(formData: FormData) {
  const guestName = formData.get("guestName") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const arrivalDate = new Date(formData.get("arrivalDate") as string);
  const departureDate = new Date(formData.get("departureDate") as string);
  const guests = parseInt(formData.get("guests") as string, 10);
  const roomId = formData.get("roomId") as string;
  const notes = formData.get("notes") as string;

  if (!guestName || !phone || !arrivalDate || !departureDate || !roomId || guests < 1) {
    throw new Error("Missing required fields");
  }

  await db.booking.create({
    data: {
      guestName,
      phone,
      email,
      arrivalDate,
      departureDate,
      guests,
      roomId,
      notes,
    },
  });

  revalidatePath("/admin/bookings");
}
