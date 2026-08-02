import { db } from "@/lib/db";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import BookingStatusSelect from "@/components/admin/BookingStatusSelect";

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const filterStatus = searchParams.status;
  
  const bookings = await db.booking.findMany({
    where: filterStatus ? { status: filterStatus } : undefined,
    include: { room: true },
    orderBy: { createdAt: 'desc' }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">Ожидает</span>;
      case 'APPROVED': return <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">Подтверждено</span>;
      case 'COMPLETED': return <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">Завершено</span>;
      case 'REJECTED': return <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">Отклонено</span>;
      case 'CANCELLED': return <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded text-xs">Отменено</span>;
      default: return <span className="px-2 py-1 bg-white/10 text-white rounded text-xs">{status}</span>;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-serif font-bold">Управление бронированиями</h1>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <a href="/admin/bookings" className={`px-4 py-2 rounded-lg text-sm transition-colors ${!filterStatus ? 'bg-gold text-charcoal font-medium' : 'bg-white/5 hover:bg-white/10'}`}>Все</a>
        <a href="/admin/bookings?status=PENDING" className={`px-4 py-2 rounded-lg text-sm transition-colors ${filterStatus === 'PENDING' ? 'bg-gold text-charcoal font-medium' : 'bg-white/5 hover:bg-white/10'}`}>Ожидают</a>
        <a href="/admin/bookings?status=APPROVED" className={`px-4 py-2 rounded-lg text-sm transition-colors ${filterStatus === 'APPROVED' ? 'bg-gold text-charcoal font-medium' : 'bg-white/5 hover:bg-white/10'}`}>Подтвержденные</a>
        <a href="/admin/bookings?status=COMPLETED" className={`px-4 py-2 rounded-lg text-sm transition-colors ${filterStatus === 'COMPLETED' ? 'bg-gold text-charcoal font-medium' : 'bg-white/5 hover:bg-white/10'}`}>Завершенные</a>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-black/20 border-b border-white/10">
            <tr>
              <th className="p-4 text-warm-white/70 font-medium">Гость</th>
              <th className="p-4 text-warm-white/70 font-medium">Контакты</th>
              <th className="p-4 text-warm-white/70 font-medium">Номер</th>
              <th className="p-4 text-warm-white/70 font-medium">Даты</th>
              <th className="p-4 text-warm-white/70 font-medium">Статус</th>
              <th className="p-4 text-warm-white/70 font-medium text-right">Действия</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-warm-white/50">
                  Бронирований не найдено
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <p className="font-medium">{booking.guestName}</p>
                    <p className="text-xs text-warm-white/50">{booking.guests} гостя(ей)</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm">{booking.phone}</p>
                    {booking.email && <p className="text-xs text-warm-white/50">{booking.email}</p>}
                  </td>
                  <td className="p-4 font-medium">{booking.room.title}</td>
                  <td className="p-4 text-sm">
                    {format(new Date(booking.arrivalDate), 'dd MMM yyyy', { locale: ru })} - <br/>
                    {format(new Date(booking.departureDate), 'dd MMM yyyy', { locale: ru })}
                  </td>
                  <td className="p-4">{getStatusBadge(booking.status)}</td>
                  <td className="p-4 text-right">
                    <BookingStatusSelect bookingId={booking.id} currentStatus={booking.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
