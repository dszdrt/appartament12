import { db } from "@/lib/db";
import { Star, Eye, EyeOff, Pin, Trash2, Plus } from "lucide-react";
import ReviewManager from "./ReviewManager";

export default async function ReviewsAdminPage() {
  const reviews = await db.review.findMany({
    orderBy: [
      { isPinned: "desc" },
      { order: "asc" },
      { createdAt: "desc" },
    ],
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-warm-white mb-2">Отзывы гостей</h1>
          <p className="text-warm-white/50 text-sm">Управление отзывами, закрепление главных и скрытие нежелательных</p>
        </div>
      </div>

      <ReviewManager initialReviews={reviews} />
    </div>
  );
}
