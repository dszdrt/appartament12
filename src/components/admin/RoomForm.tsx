"use client";

import { useState } from "react";
import SortableImageGallery from "./SortableImageGallery";
import { saveRoom } from "@/app/admin/rooms/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

export default function RoomForm({ initialData }: { initialData?: any }) {
  const [images, setImages] = useState<string[]>(
    initialData?.images?.map((img: any) => img.url) || []
  );
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true);
    try {
      images.forEach(url => formData.append("images[]", url));
      await saveRoom(formData, initialData?.id);
      
      toast.success("Информация о номере успешно сохранена!", {
        description: "Изменения мгновенно выгружены на сайт.",
      });

      router.push("/admin/rooms");
      router.refresh();
    } catch (e: any) {
      toast.error("Ошибка сохранения номера", {
        description: e.message || "Проверьте правильность заполнения полей",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="relative">
      <form action={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-warm-white/70 mb-2">Название номера</label>
            <input 
              type="text" 
              name="title" 
              defaultValue={initialData?.title} 
              required 
              placeholder="например: Морской"
              className="w-full bg-black/30 border border-white/10 rounded-xl p-3.5 text-white placeholder-white/20 focus:border-gold focus:outline-none transition-all" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-warm-white/70 mb-2">Slug (URL алиас)</label>
            <input 
              type="text" 
              name="slug" 
              defaultValue={initialData?.slug} 
              required 
              placeholder="morskoy"
              className="w-full bg-black/30 border border-white/10 rounded-xl p-3.5 text-white placeholder-white/20 focus:border-gold focus:outline-none transition-all" 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-warm-white/70 mb-2">Краткое описание (Subtitle)</label>
          <input 
            type="text" 
            name="subtitle" 
            defaultValue={initialData?.subtitle} 
            placeholder="Элегантные апартаменты с балконом и видом на море"
            className="w-full bg-black/30 border border-white/10 rounded-xl p-3.5 text-white placeholder-white/20 focus:border-gold focus:outline-none transition-all" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-warm-white/70 mb-2">Полное описание</label>
          <textarea 
            name="description" 
            defaultValue={initialData?.description} 
            rows={6} 
            placeholder="Подробное описание атмосферы, отделки и особенностей номера..."
            className="w-full bg-black/30 border border-white/10 rounded-xl p-3.5 text-white placeholder-white/20 focus:border-gold focus:outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-warm-white/70 mb-2">Цена (₽ / ночь)</label>
            <input 
              type="number" 
              name="price" 
              defaultValue={initialData?.price} 
              required 
              className="w-full bg-black/30 border border-white/10 rounded-xl p-3.5 text-white focus:border-gold focus:outline-none transition-all" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-warm-white/70 mb-2">Вместимость (чел.)</label>
            <input 
              type="number" 
              name="capacity" 
              defaultValue={initialData?.capacity || 2} 
              required 
              className="w-full bg-black/30 border border-white/10 rounded-xl p-3.5 text-white focus:border-gold focus:outline-none transition-all" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-warm-white/70 mb-2">Кровати</label>
            <input 
              type="number" 
              name="beds" 
              defaultValue={initialData?.beds || 1} 
              required 
              className="w-full bg-black/30 border border-white/10 rounded-xl p-3.5 text-white focus:border-gold focus:outline-none transition-all" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-warm-white/70 mb-2">Площадь (м²)</label>
            <input 
              type="number" 
              name="area" 
              defaultValue={initialData?.area || 25} 
              required 
              className="w-full bg-black/30 border border-white/10 rounded-xl p-3.5 text-white focus:border-gold focus:outline-none transition-all" 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-warm-white/70 mb-2">Статус отображения</label>
          <select 
            name="status" 
            defaultValue={initialData?.status || "ACTIVE"} 
            className="w-full bg-black/30 border border-white/10 rounded-xl p-3.5 text-white focus:border-gold focus:outline-none cursor-pointer transition-all"
          >
            <option value="ACTIVE" className="bg-[#1A1A1A]">Активен (Отображается на сайте)</option>
            <option value="DISABLED" className="bg-[#1A1A1A]">Отключен (Скрыт)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-warm-white/70 mb-4">Фотографии номера (drag-and-drop сортировка)</label>
          <SortableImageGallery images={images} setImages={setImages} />
        </div>

        <div className="pt-4 flex items-center justify-end gap-4">
          <button 
            type="button" 
            onClick={() => router.back()}
            className="px-6 py-3 rounded-xl border border-white/10 text-warm-white/70 hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
          >
            Отмена
          </button>
          <button 
            type="submit" 
            disabled={isPending} 
            className={`btn-gold px-8 py-3.5 rounded-xl font-medium flex items-center gap-2 text-sm shadow-lg transition-all ${
              isPending ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02]"
            }`}
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Сохранение...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Сохранить номер</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
