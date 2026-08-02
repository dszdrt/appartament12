import { db } from "@/lib/db";
import { saveSiteSettings } from "./actions";

export default async function SettingsPage() {
  const settings = await db.siteSetting.findMany();
  
  // Convert array to object for easier default values
  const config: Record<string, string> = {};
  settings.forEach(s => { config[s.key] = s.value; });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-serif font-bold">Настройки сайта</h1>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-4xl">
        <form action={saveSiteSettings} className="space-y-8">
          
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

          <button type="submit" className="bg-gold text-charcoal px-8 py-3 rounded-lg font-medium hover:bg-gold/90 transition-colors">
            Сохранить настройки
          </button>
        </form>
      </div>
    </div>
  );
}
