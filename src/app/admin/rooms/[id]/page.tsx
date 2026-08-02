import RoomForm from "@/components/admin/RoomForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function EditRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const room = await db.room.findUnique({
    where: { id },
    include: { images: { orderBy: { order: 'asc' } } }
  });

  if (!room) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/rooms" className="text-warm-white/50 hover:text-gold flex items-center gap-2 mb-4 w-fit transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Назад к номерам
        </Link>
        <h1 className="text-3xl font-serif font-bold">Редактировать номер: {room.title}</h1>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
        <RoomForm initialData={room} />
      </div>
    </div>
  );
}
