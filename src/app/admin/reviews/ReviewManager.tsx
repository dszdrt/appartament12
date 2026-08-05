"use client";

import { useState } from "react";
import { Star, Eye, EyeOff, Pin, Trash2, Plus, Edit2, X, Search } from "lucide-react";
import { saveReview, toggleReviewVisibility, toggleReviewPin, deleteReview } from "./actions";
import { toast } from "sonner";

interface Review {
  id: string;
  authorName: string;
  avatarUrl: string | null;
  rating: number;
  dateText: string;
  text: string;
  source: string;
  isPinned: boolean;
  isVisible: boolean;
  order: number;
}

export default function ReviewManager({ initialReviews }: { initialReviews: Review[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleOpenAdd = () => {
    setEditingReview(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (review: Review) => {
    setEditingReview(review);
    setIsModalOpen(true);
  };

  const filteredReviews = initialReviews.filter(
    (rev) =>
      rev.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.source.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Top Header Bar with Live Search & Add */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по автору или тексту..."
            className="w-full bg-black/30 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-warm-white focus:outline-none focus:border-gold/50 transition-all"
          />
        </div>

        <button
          onClick={handleOpenAdd}
          className="btn-gold text-xs py-2.5 px-5 flex items-center gap-2 rounded-xl shrink-0 w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          Добавить отзыв
        </button>
      </div>

      {/* List of reviews */}
      {filteredReviews.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center text-warm-white/50 space-y-2">
          <p className="text-base font-medium">Отзывов не найдено</p>
          <p className="text-xs text-warm-white/30">Попробуйте изменить поисковый запрос</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className={`bg-white/5 border rounded-2xl p-6 relative transition-all ${
                !rev.isVisible
                  ? "border-white/5 opacity-50 bg-black/40"
                  : rev.isPinned
                  ? "border-gold/50 bg-gold/5 shadow-[0_0_15px_rgba(201,169,110,0.15)]"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              {/* Top actions */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs bg-black/40 border border-white/10 px-2.5 py-1 rounded-full text-gold font-medium">
                    {rev.source}
                  </span>
                  {rev.isPinned && (
                    <span className="text-xs bg-gold/20 text-gold border border-gold/30 px-2.5 py-1 rounded-full flex items-center gap-1 font-medium">
                      <Pin className="w-3 h-3 fill-gold" /> Закреплен
                    </span>
                  )}
                  {!rev.isVisible && (
                    <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-2.5 py-1 rounded-full font-medium">
                      Скрыт
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={async () => {
                      try {
                        await toggleReviewPin(rev.id, !rev.isPinned);
                        toast.success(rev.isPinned ? "Отзыв откреплен" : "Отзыв закреплен в начале");
                      } catch (err: any) {
                        toast.error("Ошибка при обновлении закрепления");
                      }
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      rev.isPinned
                        ? "text-gold bg-gold/10 hover:bg-gold/20"
                        : "text-warm-white/40 hover:text-warm-white hover:bg-white/5"
                    }`}
                    title={rev.isPinned ? "Открепить" : "Закрепить в начале"}
                  >
                    <Pin className="w-4 h-4" />
                  </button>

                  <button
                    onClick={async () => {
                      try {
                        await toggleReviewVisibility(rev.id, !rev.isVisible);
                        toast.success(rev.isVisible ? "Отзыв скрыт с сайта" : "Отзыв опубликован на сайте");
                      } catch (err: any) {
                        toast.error("Ошибка при смене видимости");
                      }
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      rev.isVisible
                        ? "text-green-400 bg-green-500/10 hover:bg-green-500/20"
                        : "text-warm-white/40 hover:text-warm-white hover:bg-white/5"
                    }`}
                    title={rev.isVisible ? "Скрыть отзыв" : "Показать отзыв"}
                  >
                    {rev.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => handleOpenEdit(rev)}
                    className="p-2 rounded-lg text-warm-white/40 hover:text-gold hover:bg-white/5 transition-colors"
                    title="Редактировать"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={async () => {
                      if (confirm(`Вы уверены, что хотите удалить отзыв автора «${rev.authorName}»?`)) {
                        try {
                          await deleteReview(rev.id);
                          toast.success("Отзыв успешно удален");
                        } catch (err: any) {
                          toast.error("Ошибка при удалении отзыва");
                        }
                      }
                    }}
                    className="p-2 rounded-lg text-warm-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Удалить"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Stars & Author */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-serif text-lg font-bold text-warm-white">{rev.authorName}</h3>
                  <p className="text-xs text-warm-white/40">{rev.dateText}</p>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < rev.rating ? "text-gold fill-gold" : "text-white/10 fill-white/5"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Text */}
              <p className="text-warm-white/70 text-sm leading-relaxed whitespace-pre-line font-light italic">
                "{rev.text}"
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl max-w-lg w-full p-6 relative shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-warm-white/40 hover:text-warm-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-serif font-bold text-warm-white mb-6">
              {editingReview ? "Редактировать отзыв" : "Добавить отзыв"}
            </h2>

            <form
              action={async (formData) => {
                setIsPending(true);
                try {
                  await saveReview(formData, editingReview?.id);
                  toast.success(editingReview ? "Отзыв успешно обновлен!" : "Новый отзыв добавлен!");
                  setIsModalOpen(false);
                } catch (e: any) {
                  toast.error("Ошибка сохранения отзыва", {
                    description: e.message || "Заполните обязательные поля",
                  });
                } finally {
                  setIsPending(false);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs uppercase tracking-wider text-warm-white/50 mb-1">
                  Имя автора
                </label>
                <input
                  type="text"
                  name="authorName"
                  defaultValue={editingReview?.authorName}
                  required
                  placeholder="Екатерина В."
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-warm-white outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-warm-white/50 mb-1">
                    Оценка (1 - 5)
                  </label>
                  <select
                    name="rating"
                    defaultValue={editingReview?.rating || 5}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-warm-white outline-none focus:border-gold cursor-pointer"
                  >
                    <option value={5} className="bg-[#1A1A1A]">5 ★★★★★</option>
                    <option value={4} className="bg-[#1A1A1A]">4 ★★★★☆</option>
                    <option value={3} className="bg-[#1A1A1A]">3 ★★★☆☆</option>
                    <option value={2} className="bg-[#1A1A1A]">2 ★★☆☆☆</option>
                    <option value={1} className="bg-[#1A1A1A]">1 ★☆☆☆☆</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-warm-white/50 mb-1">
                    Дата (текст)
                  </label>
                  <input
                    type="text"
                    name="dateText"
                    defaultValue={editingReview?.dateText || "Август 2026"}
                    required
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-warm-white outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-warm-white/50 mb-1">
                  Источник
                </label>
                <input
                  type="text"
                  name="source"
                  defaultValue={editingReview?.source || "Яндекс Путешествия"}
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-warm-white outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-warm-white/50 mb-1">
                  Текст отзыва
                </label>
                <textarea
                  name="text"
                  defaultValue={editingReview?.text}
                  rows={4}
                  required
                  placeholder="Отличный отель..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-warm-white outline-none focus:border-gold"
                ></textarea>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-warm-white/70">
                  <input
                    type="checkbox"
                    name="isPinned"
                    value="true"
                    defaultChecked={editingReview?.isPinned || false}
                    className="accent-gold w-4 h-4"
                  />
                  <span>Закрепить вверху</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-sm text-warm-white/70">
                  <input
                    type="checkbox"
                    name="isVisible"
                    value="true"
                    defaultChecked={editingReview?.isVisible ?? true}
                    className="accent-gold w-4 h-4"
                  />
                  <span>Показывать на сайте</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-white/10 text-warm-white/70 text-sm hover:bg-white/5 transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn-gold text-xs py-2.5 px-6 rounded-xl font-medium"
                >
                  {isPending ? "Сохранение..." : "Сохранить"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
