import { db } from "@/lib/db";
import { Bed, Image as ImageIcon, CheckCircle, Clock } from "lucide-react";

export default async function AdminDashboard() {
  const roomsCount = await db.room.count({ where: { deletedAt: null } });
  const galleryCount = await db.gallery.count();
  
  const stats = [
    { title: "Активных номеров", value: roomsCount, icon: Bed, color: "text-blue-400", bg: "bg-blue-400/10" },
    { title: "Фото в галерее", value: galleryCount, icon: ImageIcon, color: "text-purple-400", bg: "bg-purple-400/10" },
    { title: "Статус системы", value: "В норме", icon: CheckCircle, color: "text-green-400", bg: "bg-green-400/10" },
    { title: "Последнее обновление", value: new Date().toLocaleDateString("ru-RU"), icon: Clock, color: "text-gold", bg: "bg-gold/10" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold mb-8">Обзор</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4">
              <div className={`p-4 rounded-xl ${stat.bg}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-warm-white/50 text-sm mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-warm-white">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4">Добро пожаловать в CMS Apartments12</h2>
        <p className="text-warm-white/70 leading-relaxed max-w-3xl">
          С помощью этой панели управления вы можете редактировать абсолютно все материалы на сайте: 
          добавлять и удалять номера, изменять цены, загружать фотографии в галерею и настраивать 
          тексты на главной странице. Все изменения сохраняются моментально и сразу видны посетителям.
        </p>
      </div>
    </div>
  );
}
