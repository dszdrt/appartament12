"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import { Star, ChevronLeft, ChevronRight, Quote, ExternalLink, ThumbsUp } from "lucide-react";

interface ReviewItem {
  id: string;
  authorName: string;
  avatarUrl: string | null;
  rating: number;
  dateText: string;
  text: string;
  source: string;
  isPinned: boolean;
}

export default function ReviewsSection({ reviews = [] }: { reviews?: ReviewItem[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const yandexReviewsUrl = "https://yandex.ru/maps/org/apartamenty_12/24464261805/reviews/";
  const displayRating = "4.7";

  const nextSlide = useCallback(() => {
    if (reviews.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  }, [reviews.length]);

  const prevSlide = () => {
    if (reviews.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  // Autoplay
  useEffect(() => {
    if (isPaused || reviews.length <= 1) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, reviews.length]);

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 40) {
      nextSlide(); // Swipe left -> Next
    } else if (diff < -40) {
      prevSlide(); // Swipe right -> Prev
    }
    touchStartX.current = null;
  };

  const currentReview = reviews.length > 0 ? reviews[currentIndex] : null;

  return (
    <section id="reviews" className="py-14 sm:py-20 md:py-24 px-4 sm:px-6 relative overflow-hidden bg-charcoal">
      {/* Subtle Background Elements */}
      <div className="absolute top-1/3 right-10 w-72 sm:w-96 h-72 sm:h-96 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header & Rating Summary */}
        <AnimatedSection className="text-center mb-10 sm:mb-14">
          <p className="text-gold tracking-[0.25em] uppercase text-[11px] sm:text-xs font-semibold mb-2 sm:mb-3">
            Впечатления наших гостей
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-warm-white mb-4 sm:mb-6">
            Отзывы о <span className="text-gold italic">Apartments12</span>
          </h2>
          <div className="line-gold w-16 sm:w-20 mx-auto mb-6 sm:mb-8" />

          {/* Rating Badge */}
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-4 bg-white/5 border border-white/10 rounded-2xl px-5 sm:px-6 py-3.5 sm:py-4 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-gold">{displayRating}</span>
              <div className="flex text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-gold text-gold" />
                ))}
              </div>
            </div>
            <div className="hidden sm:block w-[1px] h-8 bg-white/10" />
            <div className="text-warm-white/70 text-xs sm:text-sm font-light text-center sm:text-left">
              <span className="text-warm-white font-medium">Рейтинг 4.7</span> на Яндекс.Путешествиях и Картах
            </div>
          </div>
        </AnimatedSection>

        {/* Carousel Container (if reviews exist) */}
        {currentReview && (
          <div 
            className="relative max-w-4xl mx-auto overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="min-h-[260px] sm:min-h-[240px] relative flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="w-full glass-light p-5 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl relative"
                >
                  <Quote className="absolute top-4 right-5 sm:top-6 sm:right-8 w-8 h-8 sm:w-14 sm:h-14 text-gold/10 pointer-events-none" />

                  {/* Author Info & Source */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div>
                      <div className="flex items-center gap-2 sm:gap-3 mb-0.5 sm:mb-1">
                        <h3 className="font-sans text-lg sm:text-2xl text-warm-white font-bold">
                          {currentReview.authorName}
                        </h3>
                        {currentReview.isPinned && (
                          <span className="text-[9px] sm:text-[10px] uppercase tracking-widest bg-gold/20 text-gold border border-gold/30 px-2 py-0.5 rounded-full font-medium">
                            Рекомендует
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] sm:text-xs text-warm-white/40">{currentReview.dateText}</p>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] sm:text-xs bg-black/40 text-gold border border-gold/20 px-2.5 py-0.5 sm:py-1 rounded-full font-medium">
                        {currentReview.source}
                      </span>
                      <div className="flex text-gold">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                              i < currentReview.rating
                                ? "fill-gold text-gold"
                                : "fill-white/10 text-white/10"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Review Text */}
                  <p className="text-warm-white/80 text-xs sm:text-base md:text-lg leading-relaxed font-light italic">
                    "{currentReview.text}"
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Controls */}
            {reviews.length > 1 && (
              <div className="flex items-center justify-between mt-6 sm:mt-8 px-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevSlide}
                    className="p-2.5 sm:p-3 rounded-full bg-white/5 border border-white/10 text-warm-white/70 hover:text-gold hover:border-gold/50 hover:bg-white/10 transition-all duration-300"
                    aria-label="Предыдущий отзыв"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="p-2.5 sm:p-3 rounded-full bg-white/5 border border-white/10 text-warm-white/70 hover:text-gold hover:border-gold/50 hover:bg-white/10 transition-all duration-300"
                    aria-label="Следующий отзыв"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>

                {/* Slide Dots */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {reviews.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                        idx === currentIndex ? "w-6 sm:w-8 bg-gold" : "w-1.5 sm:w-2 bg-white/20 hover:bg-white/40"
                      }`}
                      aria-label={`Перейти к отзыву ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* View All Reviews Button */}
        <AnimatedSection className="text-center mt-10 sm:mt-16">
          <a
            href={yandexReviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold text-[10px] sm:text-xs py-3 sm:py-3.5 px-6 sm:px-8 rounded-full inline-flex items-center gap-2 sm:gap-3 shadow-[0_0_20px_rgba(201,169,110,0.2)]"
          >
            <ThumbsUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Читать реальные отзывы на Яндекс Картах</span>
            <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </a>
        </AnimatedSection>
      </div>
    </section>
  );
}
