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

  // Validate required fields
  if (!guestName || !phone || !roomId || guests < 1) {
    throw new Error("Пожалуйста, заполните все обязательные поля");
  }

  if (isNaN(arrivalDate.getTime()) || isNaN(departureDate.getTime())) {
    throw new Error("Некорректные даты");
  }

  if (arrivalDate >= departureDate) {
    throw new Error("Дата выезда должна быть позже даты заезда");
  }

  if (arrivalDate < new Date(new Date().setHours(0, 0, 0, 0))) {
    throw new Error("Дата заезда не может быть в прошлом");
  }

  // Check for date conflicts
  const start = new Date(arrivalDate);
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(departureDate);
  end.setUTCHours(0, 0, 0, 0);

  const conflicts = await db.roomAvailability.findMany({
    where: {
      roomId,
      date: { gte: start, lt: end },
    },
  });

  if (conflicts.length > 0) {
    throw new Error("Выбранные даты уже заняты. Пожалуйста, выберите другие даты.");
  }

  // Also check for overlapping approved bookings
  const overlapping = await db.booking.findMany({
    where: {
      roomId,
      status: { in: ["APPROVED", "PENDING"] },
      arrivalDate: { lt: departureDate },
      departureDate: { gt: arrivalDate },
    },
  });

  if (overlapping.length > 0) {
    throw new Error("На эти даты уже есть бронирование. Пожалуйста, выберите другие даты.");
  }

  await db.booking.create({
    data: {
      guestName,
      phone,
      email: email || null,
      arrivalDate,
      departureDate,
      guests,
      roomId,
      notes: notes || null,
    },
  });

  revalidatePath("/admin/bookings");
}
