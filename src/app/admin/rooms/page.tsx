import { db } from "@/lib/db";
import Link from "next/link";
import { Plus, Edit2, Trash2 } from "lucide-react";
import Image from "next/image";
import { deleteRoom } from "./actions";

export default async function RoomsPage() {
  const rooms = await db.room.findMany({
    where: { deletedAt: null },
    include: { images: true },
    orderBy: { order: 'asc' },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-serif font-bold">Управление номерами</h1>
        <Link href="/admin/rooms/new" className="btn-gold flex items-center gap-2 whitespace-nowrap text-xs">
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
          <span className="hidden sm:inline">Добавить номер</span>
          <span className="sm:hidden">Новый</span>
        </Link>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-black/20 border-b border-white/10">
            <tr>
              <th className="p-4 text-warm-white/70 font-medium">Фото</th>
              <th className="p-4 text-warm-white/70 font-medium">Название</th>
              <th className="p-4 text-warm-white/70 font-medium">Цена</th>
              <th className="p-4 text-warm-white/70 font-medium">Статус</th>
              <th className="p-4 text-warm-white/70 font-medium text-right">Действия</th>
            </tr>
          </thead>
          <tbody>
            {rooms.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-warm-white/50">
                  Номеров пока нет
                </td>
              </tr>
            ) : (
              rooms.map((room) => {
                const cover = room.images.find(img => img.isCover) || room.images[0];
                return (
                  <tr key={room.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      {cover ? (
                        <div className="w-16 h-12 relative rounded overflow-hidden">
                          <Image src={cover.url} alt={room.title} fill className="object-cover" sizes="64px" />
                        </div>
                      ) : (
                        <div className="w-16 h-12 bg-black/40 rounded flex items-center justify-center text-xs text-white/30">Нет фото</div>
                      )}
                    </td>
                    <td className="p-4 font-medium">{room.title}</td>
                    <td className="p-4">{room.price.toLocaleString("ru-RU")} ₽</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs ${room.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {room.status === 'ACTIVE' ? 'Активен' : 'Отключен'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/rooms/${room.id}`} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <form action={async () => {
                          "use server";
                          await deleteRoom(room.id);
                        }}>
                          <button type="submit" className="p-2 text-red-400 hover:bg-red-400/10 rounded transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile card view */}
      <div className="md:hidden space-y-3">
        {rooms.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center text-warm-white/50">
            Номеров пока нет
          </div>
        ) : (
          rooms.map((room) => {
            const cover = room.images.find(img => img.isCover) || room.images[0];
            return (
              <div key={room.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4">
                {cover ? (
                  <div className="w-16 h-16 relative rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={cover.url} alt={room.title} fill className="object-cover" sizes="64px" />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-black/40 rounded-lg flex items-center justify-center text-xs text-white/30 flex-shrink-0">
                    Нет
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{room.title}</p>
                  <p className="text-sm text-warm-white/50">{room.price.toLocaleString("ru-RU")} ₽</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs ${room.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {room.status === 'ACTIVE' ? 'Активен' : 'Отключен'}
                  </span>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <Link href={`/admin/rooms/${room.id}`} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </Link>
                  <form action={async () => {
                    "use server";
                    await deleteRoom(room.id);
                  }}>
                    <button type="submit" className="p-2 text-red-400 hover:bg-red-400/10 rounded transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
