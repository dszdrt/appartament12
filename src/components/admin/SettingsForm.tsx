"use client";

import { useState } from "react";
import { saveSiteSettings } from "@/app/admin/settings/actions";
import { useRouter } from "next/navigation";

export default function SettingsForm({ config }: { config: Record<string, string> }) {
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-4xl relative">
      {message && (
        <div className="mb-6 p-4 rounded-lg bg-green-500/20 text-green-300 border border-green-500/30 font-medium flex items-center gap-2">
          {message}
        </div>
      )}
      
      <form action={async (formData) => {
        setIsPending(true);
        setMessage('');
        try {
          await saveSiteSettings(formData);
          setMessage("✅ Настройки успешно сохранены!");
          router.refresh();
          
          // Clear message after 3 seconds
          setTimeout(() => setMessage(''), 3000);
        } catch (e) {
          setMessage("❌ Произошла ошибка при сохранении!");
        } finally {
          setIsPending(false);
        }
      }} className="space-y-8">
        
        <section>
          <h2 className="text-xl font-serif mb-4 text-gold">Основные (SEO)</h2>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm text-warm-white/70 mb-1">Название отеля</label>
              <input type="text" name="hotelName" defaultValue={config.hotelName || "Apartments12"} className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white" />
            </div>
            <div>
              <label className="block text-sm text-warm-white/70 mb-1">SEO Title (Заголовок главной страницы)</label>
              <input type="text" name="seoTitle" defaultValue={config.seoTitle || "Бутик-отель Apartments12"} className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white" />
            </div>
            <div>
              <label className="block text-sm text-warm-white/70 mb-1">SEO Description (Описание для поисковиков)</label>
              <textarea name="seoDescription" defaultValue={config.seoDescription || "Уникальные апартаменты в центре города..."} rows={3} className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white" />
            </div>
          </div>
        </section>

        <div className="line-gold opacity-20" />

        <section>
          <h2 className="text-xl font-serif mb-4 text-gold">Контакты</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-warm-white/70 mb-1">Телефон</label>
              <input type="text" name="contactPhone" defaultValue={config.contactPhone || "+7 (495) 123-45-67"} className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white" />
            </div>
            <div>
              <label className="block text-sm text-warm-white/70 mb-1">Email</label>
              <input type="text" name="contactEmail" defaultValue={config.contactEmail || "hello@apartments12.ru"} className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-warm-white/70 mb-1">Адрес</label>
              <input type="text" name="contactAddress" defaultValue={config.contactAddress || "ул. Примерная, 12, Москва"} className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white" />
            </div>
          </div>
        </section>

        <div className="line-gold opacity-20" />

        <section>
          <h2 className="text-xl font-serif mb-4 text-gold">Главная страница (Тексты)</h2>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm text-warm-white/70 mb-1">Главный заголовок (Hero Title)</label>
              <input type="text" name="heroTitle" defaultValue={config.heroTitle || "Место, где каждый номер — история"} className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white" />
            </div>
            <div>
              <label className="block text-sm text-warm-white/70 mb-1">Текст "О нас"</label>
              <textarea name="aboutText" defaultValue={config.aboutText || "Apartments12 — это не просто отель. Это коллекция из 10 уникальных пространств..."} rows={4} className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white" />
            </div>
          </div>
        </section>

        <button type="submit" disabled={isPending} className={`bg-gold text-charcoal px-8 py-3 rounded-lg font-medium transition-colors ${isPending ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gold/90'}`}>
          {isPending ? "Сохранение..." : "Сохранить настройки"}
        </button>
      </form>
    </div>
  );
}
