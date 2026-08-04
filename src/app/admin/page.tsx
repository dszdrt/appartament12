import { db } from "@/lib/db";
import { Bed, Image as ImageIcon, CheckCircle, Clock, CalendarCheck, XCircle } from "lucide-react";
import Link from "next/link";
import DashboardCalendar from "@/components/admin/DashboardCalendar";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

export default async function AdminDashboard() {
  const roomsCount = await db.room.count({ where: { deletedAt: null } });
  
  // Real data aggregations
  const bookings = await db.booking.findMany({
    include: { room: true },
    orderBy: { createdAt: 'desc' }
  });

  const pendingCount = bookings.filter(b => b.status === "PENDING").length;
  const approvedCount = bookings.filter(b => b.status === "APPROVED").length;
  const completedCount = bookings.filter(b => b.status === "COMPLETED").length;
  const cancelledCount = bookings.filter(b => b.status === "CANCELLED").length;
  const galleryCount = await db.gallery.count();

  // Current occupied rooms (today between arrival and departure and approved)
  const today = new Date();
  const occupiedRoomsCount = bookings.filter(b => {
    return b.status === "APPROVED" && new Date(b.arrivalDate) <= today && new Date(b.departureDate) > today;
  }).length;

  const availableRoomsCount = roomsCount - occupiedRoomsCount;

  const stats = [
    { title: "Свободных номеров", value: availableRoomsCount, icon: Bed, color: "text-green-400", bg: "bg-green-400/10", href: "/admin/rooms" },
    { title: "Занятых номеров", value: occupiedRoomsCount, icon: Bed, color: "text-red-400", bg: "bg-red-400/10", href: "/admin/bookings" },
    { title: "Новых (ожидают)", value: pendingCount, icon: Clock, color: "text-yellow-400", bg: "bg-yellow-400/10", href: "/admin/bookings?status=PENDING" },
    { title: "Подтверждены", value: approvedCount, icon: CalendarCheck, color: "text-blue-400", bg: "bg-blue-400/10", href: "/admin/bookings?status=APPROVED" },
    { title: "Завершены", value: completedCount, icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-400/10", href: "/admin/bookings?status=COMPLETED" },
    { title: "Отменены", value: cancelledCount, icon: XCircle, color: "text-gray-400", bg: "bg-gray-400/10", href: "/admin/bookings?status=CANCELLED" },
    { title: "Всего номеров", value: roomsCount, icon: Bed, color: "text-purple-400", bg: "bg-purple-400/10", href: "/admin/rooms" },
    { title: "Фото в галерее", value: galleryCount, icon: ImageIcon, color: "text-pink-400", bg: "bg-pink-400/10", href: "/admin/gallery" },
  ];

  const recentBookings = bookings.slice(0, 5);

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold mb-8">Обзор и статистика</h1>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          const content = (
            <div key={i} className={`bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 ${stat.href ? 'hover:bg-white/10 transition-colors cursor-pointer' : ''} h-full`}>
              <div className={`p-3 md:p-4 rounded-xl ${stat.bg} shrink-0`}>
                <Icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-warm-white/50 text-xs md:text-sm mb-1">{stat.title}</p>
                <p className="text-xl md:text-2xl font-bold text-warm-white">{stat.value}</p>
              </div>
            </div>
          );
          return stat.href ? (
            <Link key={i} href={stat.href} className="block h-full">{content}</Link>
          ) : (
            <div key={i} className="h-full">{content}</div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Calendar Widget */}
        <div className="xl:col-span-2">
          <DashboardCalendar bookings={bookings} />
        </div>

        {/* Recent Activity */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6 font-serif">Недавние бронирования</h2>
          <div className="space-y-4">
            {recentBookings.length === 0 ? (
              <p className="text-warm-white/50 text-sm">Нет недавних бронирований</p>
            ) : (
              recentBookings.map(b => (
                <div key={b.id} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-bold">{b.guestName}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded uppercase tracking-wider ${
                      b.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                      b.status === 'APPROVED' ? 'bg-blue-500/20 text-blue-400' :
                      b.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {b.status}
                    </span>
                  </div>
                  <p className="text-sm text-warm-white/70 mb-1">{b.room.title}</p>
                  <p className="text-xs text-warm-white/40">
                    {format(new Date(b.arrivalDate), 'dd.MM.yy')} — {format(new Date(b.departureDate), 'dd.MM.yy')}
                  </p>
                </div>
              ))
            )}
          </div>
          <Link href="/admin/bookings" className="text-sm text-gold hover:text-gold-light transition-colors mt-6 block text-center uppercase tracking-widest border border-gold/30 rounded-lg py-2 hover:bg-gold/10">
            Показать все
          </Link>
        </div>
      </div>
    </div>
  );
}
