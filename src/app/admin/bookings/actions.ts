"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateBookingStatus(bookingId: string, status: string) {
  await db.booking.update({
    where: { id: bookingId },
    data: { status }
  });
  revalidatePath("/admin/bookings");
}

export async function deleteBooking(bookingId: string) {
  await db.booking.delete({
    where: { id: bookingId }
  });
  revalidatePath("/admin/bookings");
}
