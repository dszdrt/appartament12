"use client";

import { updateBookingStatus } from "@/app/admin/bookings/actions";
import { useOptimistic, startTransition } from "react";
import { toast } from "sonner";

const statusLabels: Record<string, string> = {
  PENDING: "Ожидает",
  APPROVED: "Подтверждено",
  COMPLETED: "Завершено",
  REJECTED: "Отклонено",
  CANCELLED: "Отменено",
};

export default function BookingStatusSelect({ bookingId, currentStatus }: { bookingId: string, currentStatus: string }) {
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(
    currentStatus,
    (_, newStatus: string) => newStatus
  );

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    
    startTransition(async () => {
      setOptimisticStatus(newStatus);
      try {
        await updateBookingStatus(bookingId, newStatus);
        toast.success(`Статус заявки изменен на «${statusLabels[newStatus] || newStatus}»`, {
          description: newStatus === "APPROVED" ? "Даты заезда заблокированы в календаре." : undefined,
        });
      } catch (err: any) {
        toast.error("Ошибка при обновлении статуса", {
          description: err.message || "Не удалось сохранить статус",
        });
      }
    });
  };

  return (
    <div className="relative inline-block">
      <select
        value={optimisticStatus}
        onChange={handleChange}
        className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-warm-white focus:border-gold focus:outline-none cursor-pointer transition-all hover:bg-black/60"
      >
        <option value="PENDING" className="bg-[#1A1A1A]">Ожидает</option>
        <option value="APPROVED" className="bg-[#1A1A1A]">Подтвердить</option>
        <option value="COMPLETED" className="bg-[#1A1A1A]">Завершить</option>
        <option value="REJECTED" className="bg-[#1A1A1A]">Отклонить</option>
        <option value="CANCELLED" className="bg-[#1A1A1A]">Отменить</option>
      </select>
    </div>
  );
}
