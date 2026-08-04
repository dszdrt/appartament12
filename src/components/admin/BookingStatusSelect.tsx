"use client";

import { updateBookingStatus } from "@/app/admin/bookings/actions";
import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";

export default function BookingStatusSelect({ bookingId, currentStatus }: { bookingId: string, currentStatus: string }) {
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    startTransition(async () => {
      try {
        await updateBookingStatus(bookingId, newStatus);
      } catch (err: any) {
        alert(err.message || "Произошла ошибка при обновлении статуса");
        e.target.value = currentStatus;
      }
    });
  };

  return (
    <div className="relative inline-block">
      <select
        defaultValue={currentStatus}
        onChange={handleChange}
        disabled={isPending}
        className="bg-black/20 border border-white/10 rounded px-2 py-1 text-sm outline-none appearance-none pr-8 cursor-pointer disabled:opacity-50"
      >
        <option value="PENDING">Ожидает</option>
        <option value="APPROVED">Подтвердить</option>
        <option value="COMPLETED">Завершить</option>
        <option value="REJECTED">Отклонить</option>
        <option value="CANCELLED">Отменить</option>
      </select>
      {isPending && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <Loader2 className="w-3 h-3 animate-spin text-gold" />
        </div>
      )}
    </div>
  );
}
