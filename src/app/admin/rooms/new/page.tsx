import RoomForm from "@/components/admin/RoomForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewRoomPage() {
  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/rooms" className="text-warm-white/50 hover:text-gold flex items-center gap-2 mb-4 w-fit transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Назад к номерам
        </Link>
        <h1 className="text-3xl font-serif font-bold">Добавить новый номер</h1>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
        <RoomForm />
      </div>
    </div>
  );
}
