import { db } from "@/lib/db";
import GalleryManager from "@/components/admin/GalleryManager";

export default async function GalleryPage() {
  const images = await db.gallery.findMany({
    orderBy: { order: 'asc' }
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-serif font-bold">Галерея отеля</h1>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
        <GalleryManager initialImages={images} />
      </div>
    </div>
  );
}
