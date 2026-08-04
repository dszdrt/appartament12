"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateBookingStatus(bookingId: string, status: string) {
  const validStatuses = ["PENDING", "APPROVED", "REJECTED", "COMPLETED", "CANCELLED"];
  if (!validStatuses.includes(status)) {
    throw new Error("Invalid status");
  }

  const booking = await db.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  const previousStatus = booking.status;

  // Update the booking status
  await db.booking.update({
    where: { id: bookingId },
    data: { status },
  });

  // If approving: block all dates in the range
  if (status === "APPROVED" && previousStatus !== "APPROVED") {
    const dates = getDateRange(booking.arrivalDate, booking.departureDate);
    for (const date of dates) {
      await db.roomAvailability.upsert({
        where: {
          roomId_date: {
            roomId: booking.roomId,
            date,
          },
        },
        update: { status: "OCCUPIED" },
        create: {
          roomId: booking.roomId,
          date,
          status: "OCCUPIED",
        },
      });
    }
  }

  // If cancelling/rejecting a previously approved booking: release dates
  if (
    (status === "CANCELLED" || status === "REJECTED") &&
    previousStatus === "APPROVED"
  ) {
    const start = new Date(booking.arrivalDate);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(booking.departureDate);
    end.setUTCHours(0, 0, 0, 0);

    await db.roomAvailability.deleteMany({
      where: {
        roomId: booking.roomId,
        date: { gte: start, lt: end },
        status: "OCCUPIED",
      },
    });
  }

  revalidatePath("/admin/bookings");
  revalidatePath("/admin/calendar");
  revalidatePath("/booking");
}

export async function deleteBooking(bookingId: string) {
  const booking = await db.booking.findUnique({
    where: { id: bookingId },
  });

  if (booking && booking.status === "APPROVED") {
    // Release dates if deleting an approved booking
    const start = new Date(booking.arrivalDate);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(booking.departureDate);
    end.setUTCHours(0, 0, 0, 0);

    await db.roomAvailability.deleteMany({
      where: {
        roomId: booking.roomId,
        date: { gte: start, lt: end },
        status: "OCCUPIED",
      },
    });
  }

  await db.booking.delete({
    where: { id: bookingId },
  });

  revalidatePath("/admin/bookings");
  revalidatePath("/admin/calendar");
}

// Helper: generate array of dates from start to end (exclusive of end = checkout day)
function getDateRange(start: Date, end: Date): Date[] {
  const dates: Date[] = [];
  const current = new Date(start);
  current.setUTCHours(0, 0, 0, 0);
  const endDate = new Date(end);
  endDate.setUTCHours(0, 0, 0, 0);

  while (current < endDate) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}
