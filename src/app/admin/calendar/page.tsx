import { db } from "@/lib/db";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { blockDateRange, unblockDateRange } from "./actions";

export default async function CalendarPage({ searchParams }: { searchParams: { roomId?: string } }) {
  const rooms = await db.room.findMany({
    where: { deletedAt: null },
    orderBy: { order: 'asc' },
    select: { id: true, title: true }
  });

  const selectedRoomId = searchParams.roomId || (rooms.length > 0 ? rooms[0].id : undefined);

  let availabilities: any[] = [];
  if (selectedRoomId) {
    availabilities = await db.roomAvailability.findMany({
      where: { roomId: selectedRoomId, date: { gte: new Date() } },
      orderBy: { date: 'asc' }
    });
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'OCCUPIED': return 'Занято';
      case 'MAINTENANCE': return 'Обслуживание';
      case 'UNAVAILABLE': return 'Недоступно';
      default: return status;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-serif font-bold">Календарь доступности</h1>
      </div>

      <div className="flex gap-4 mb-8">
        <form className="flex items-center gap-4">
          <label className="text-warm-white/70">Выберите номер:</label>
          <select 
            name="roomId"
            defaultValue={selectedRoomId}
            // Inline onChange for simple navigation
            onChange={(e) => {
              // This relies on client JS, safe for admin panel typically.
              // We could use a Client Component for proper routing but this works if JS is enabled.
            }}
            className="bg-black/20 border border-white/10 rounded px-4 py-2 text-white outline-none"
          >
            {rooms.map(room => (
              <option key={room.id} value={room.id}>{room.title}</option>
            ))}
          </select>
          <button type="submit" className="btn-outline px-4 py-2 text-sm">
            Показать
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Block Form */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-fit">
          <h2 className="text-xl font-serif mb-6">Изменить доступность</h2>
          <form action={blockDateRange} className="space-y-4 mb-8">
            <input type="hidden" name="roomId" value={selectedRoomId} />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-warm-white/70 mb-1">С даты</label>
                <input type="date" name="startDate" required className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-warm-white/70 mb-1">По дату (включительно)</label>
                <input type="date" name="endDate" required className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-warm-white/70 mb-1">Причина (Статус)</label>
              <select name="status" required className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white">
                <option value="OCCUPIED">Занято (Бронь вне сайта)</option>
                <option value="MAINTENANCE">Обслуживание (Ремонт)</option>
                <option value="UNAVAILABLE">Недоступно (Закрыто)</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-gold text-charcoal py-2 rounded font-medium hover:bg-gold/90 transition-colors">
              Заблокировать даты
            </button>
          </form>

          <div className="line-gold mb-8 opacity-20" />

          <h2 className="text-xl font-serif mb-6 text-red-400">Разблокировать даты</h2>
          <form action={unblockDateRange} className="space-y-4">
            <input type="hidden" name="roomId" value={selectedRoomId} />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-warm-white/70 mb-1">С даты</label>
                <input type="date" name="startDate" required className="w-full bg-black/20 border border-red-500/30 rounded px-3 py-2 text-white focus:border-red-500" />
              </div>
              <div>
                <label className="block text-sm text-warm-white/70 mb-1">По дату</label>
                <input type="date" name="endDate" required className="w-full bg-black/20 border border-red-500/30 rounded px-3 py-2 text-white focus:border-red-500" />
              </div>
            </div>
            <button type="submit" className="w-full bg-red-500/20 text-red-400 border border-red-500/50 py-2 rounded font-medium hover:bg-red-500 hover:text-white transition-colors">
              Открыть даты для бронирования
            </button>
          </form>
        </div>

        {/* List view */}
        <div className="bg-black/20 border border-white/10 rounded-2xl overflow-hidden h-fit max-h-[600px] overflow-y-auto">
          <table className="w-full text-left">
            <thead className="bg-black/40 border-b border-white/10 sticky top-0">
              <tr>
                <th className="p-4 text-warm-white/70 font-medium">Дата (Ближайшие)</th>
                <th className="p-4 text-warm-white/70 font-medium">Статус</th>
              </tr>
            </thead>
            <tbody>
              {availabilities.length === 0 ? (
                <tr>
                  <td colSpan={2} className="p-8 text-center text-warm-white/50">
                    Нет заблокированных дат
                  </td>
                </tr>
              ) : (
                availabilities.map((av) => (
                  <tr key={av.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">{format(new Date(av.date), 'dd MMMM yyyy', { locale: ru })}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded text-xs bg-white/10">
                        {getStatusText(av.status)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
