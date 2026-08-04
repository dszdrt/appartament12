"use client";

import { useState } from "react";
import SortableImageGallery from "./SortableImageGallery";
import { saveRoom } from "@/app/admin/rooms/actions";

import { useRouter } from "next/navigation";

export default function RoomForm({ initialData }: { initialData?: any }) {
  const [images, setImages] = useState<string[]>(
    initialData?.images?.map((img: any) => img.url) || []
  );
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  return (
    <div className="relative">
      {message && (
        <div className="mb-6 p-4 rounded-lg bg-green-500/20 text-green-300 border border-green-500/30 font-medium flex items-center gap-2">
          {message}
        </div>
      )}
      
      <form action={async (formData) => {
        setIsPending(true);
        setMessage('');
        try {
          images.forEach(url => formData.append("images[]", url));
          await saveRoom(formData, initialData?.id);
          setMessage("✅ Информация о номере успешно обновлена!");
          router.refresh();
          
          setTimeout(() => setMessage(''), 3000);
        } catch (e) {
          setMessage("❌ Ошибка сохранения");
        } finally {
          setIsPending(false);
        }
      }} className="space-y-8">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm mb-2 text-warm-white/70">Название (Title)</label>
          <input type="text" name="title" defaultValue={initialData?.title} required className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white" />
        </div>
        <div>
          <label className="block text-sm mb-2 text-warm-white/70">Slug (URL)</label>
          <input type="text" name="slug" defaultValue={initialData?.slug} required className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white" />
        </div>
      </div>

      <div>
        <label className="block text-sm mb-2 text-warm-white/70">Краткое описание (Subtitle)</label>
        <input type="text" name="subtitle" defaultValue={initialData?.subtitle} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white" />
      </div>

      <div>
        <label className="block text-sm mb-2 text-warm-white/70">Полное описание (Description)</label>
        <textarea name="description" defaultValue={initialData?.description} rows={8} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white"></textarea>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <label className="block text-sm mb-2 text-warm-white/70">Цена (₽)</label>
          <input type="number" name="price" defaultValue={initialData?.price} required className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white" />
        </div>
        <div>
          <label className="block text-sm mb-2 text-warm-white/70">Вместимость (чел.)</label>
          <input type="number" name="capacity" defaultValue={initialData?.capacity} required className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white" />
        </div>
        <div>
          <label className="block text-sm mb-2 text-warm-white/70">Кровати</label>
          <input type="number" name="beds" defaultValue={initialData?.beds} required className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white" />
        </div>
        <div>
          <label className="block text-sm mb-2 text-warm-white/70">Площадь (м²)</label>
          <input type="number" name="area" defaultValue={initialData?.area} required className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white" />
        </div>
      </div>

      <div>
        <label className="block text-sm mb-2 text-warm-white/70">Статус</label>
        <select name="status" defaultValue={initialData?.status || "ACTIVE"} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white">
          <option value="ACTIVE">Активен</option>
          <option value="DISABLED">Отключен</option>
        </select>
      </div>

      <div>
        <label className="block text-sm mb-4 text-warm-white/70">Фотографии номера</label>
        <SortableImageGallery images={images} setImages={setImages} />
      </div>

      <button type="submit" disabled={isPending} className={`bg-gold text-charcoal px-8 py-3 rounded-lg font-medium transition-colors ${isPending ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gold/90'}`}>
        {isPending ? "Сохранение..." : "Сохранить номер"}
      </button>
    </form>
    </div>
  );
}
