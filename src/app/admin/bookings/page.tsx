import { db } from "@/lib/db";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import BookingStatusSelect from "@/components/admin/BookingStatusSelect";

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: filterStatus } = await searchParams;
  
  const bookings = await db.booking.findMany({
    where: filterStatus ? { status: filterStatus } : undefined,
    include: { room: true },
    orderBy: { createdAt: 'desc' }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs whitespace-nowrap">Ожидает</span>;
      case 'APPROVED': return <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs whitespace-nowrap">Подтверждено</span>;
      case 'COMPLETED': return <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs whitespace-nowrap">Завершено</span>;
      case 'REJECTED': return <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs whitespace-nowrap">Отклонено</span>;
      case 'CANCELLED': return <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded text-xs whitespace-nowrap">Отменено</span>;
      default: return <span className="px-2 py-1 bg-white/10 text-white rounded text-xs">{status}</span>;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-serif font-bold">Управление бронированиями</h1>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
        <a href="/admin/bookings" className={`px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap ${!filterStatus ? 'bg-gold text-charcoal font-medium' : 'bg-white/5 hover:bg-white/10'}`}>Все</a>
        <a href="/admin/bookings?status=PENDING" className={`px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap ${filterStatus === 'PENDING' ? 'bg-gold text-charcoal font-medium' : 'bg-white/5 hover:bg-white/10'}`}>Ожидают</a>
        <a href="/admin/bookings?status=APPROVED" className={`px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap ${filterStatus === 'APPROVED' ? 'bg-gold text-charcoal font-medium' : 'bg-white/5 hover:bg-white/10'}`}>Подтверждённые</a>
        <a href="/admin/bookings?status=COMPLETED" className={`px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap ${filterStatus === 'COMPLETED' ? 'bg-gold text-charcoal font-medium' : 'bg-white/5 hover:bg-white/10'}`}>Завершённые</a>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
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
                    {format(new Date(booking.arrivalDate), 'dd MMM yyyy', { locale: ru })} -<br/>
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

      {/* Mobile card view */}
      <div className="md:hidden space-y-4">
        {bookings.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center text-warm-white/50">
            Бронирований не найдено
          </div>
        ) : (
          bookings.map((booking) => (
            <div key={booking.id} className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-lg">{booking.guestName}</p>
                  <p className="text-sm text-warm-white/50">{booking.room.title}</p>
                </div>
                {getStatusBadge(booking.status)}
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-warm-white/40 text-xs uppercase tracking-wider">Заезд</p>
                  <p>{format(new Date(booking.arrivalDate), 'dd MMM yyyy', { locale: ru })}</p>
                </div>
                <div>
                  <p className="text-warm-white/40 text-xs uppercase tracking-wider">Выезд</p>
                  <p>{format(new Date(booking.departureDate), 'dd MMM yyyy', { locale: ru })}</p>
                </div>
              </div>
              <div className="text-sm">
                <p>{booking.phone}</p>
                {booking.email && <p className="text-warm-white/50 text-xs">{booking.email}</p>}
              </div>
              <div className="pt-2 border-t border-white/5">
                <BookingStatusSelect bookingId={booking.id} currentStatus={booking.status} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
