"use client";

import { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { format, startOfMonth, endOfMonth, addMonths } from "date-fns";
import { ru } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import "react-day-picker/dist/style.css";

export default function PremiumBookingCalendar() {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [availability, setAvailability] = useState<Record<string, "available" | "booked" | "maintenance">>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAvailability = async () => {
      setIsLoading(true);
      try {
        const start = startOfMonth(currentMonth);
        const end = endOfMonth(addMonths(currentMonth, 1)); // Fetch 2 months to preload
        
        const res = await fetch(`/api/availability?start=${start.toISOString()}&end=${end.toISOString()}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        
        setAvailability(prev => ({ ...prev, ...data.dates }));
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailability();
  }, [currentMonth]);

  const modifiers = {
    booked: (date: Date) => availability[format(date, 'yyyy-MM-dd')] === "booked",
    maintenance: (date: Date) => availability[format(date, 'yyyy-MM-dd')] === "maintenance",
    available: (date: Date) => !availability[format(date, 'yyyy-MM-dd')] && date >= new Date(new Date().setHours(0,0,0,0)),
    past: (date: Date) => date < new Date(new Date().setHours(0,0,0,0))
  };

  const modifiersStyles = {
    booked: { color: "#ef4444", textDecoration: "line-through", opacity: 0.7 },
    maintenance: { color: "#f97316", opacity: 0.8 },
    available: { color: "#22c55e", fontWeight: "bold" },
    past: { opacity: 0.3 }
  };

  return (
    <div className="glass-light rounded-3xl p-8 shadow-2xl border border-white/10 relative overflow-hidden">
      {isLoading && (
        <div className="absolute top-4 right-4 flex gap-1">
          <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 rounded-full bg-gold" />
          <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 rounded-full bg-gold" />
          <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 rounded-full bg-gold" />
        </div>
      )}

      <h3 className="font-serif text-2xl text-warm-white mb-6 text-center">Доступность номеров</h3>
      
      <style>{`
        .rdp { --rdp-cell-size: 45px; --rdp-accent-color: #C9A96E; --rdp-background-color: rgba(201, 169, 110, 0.1); margin: 0 auto; }
        .rdp-day_selected { background-color: var(--rdp-accent-color); color: #1a1a1a !important; font-weight: bold; }
        .rdp-day:hover:not(.rdp-day_disabled) { background-color: rgba(201, 169, 110, 0.2); }
        .rdp-nav_button { color: var(--color-gold); }
        .rdp-nav_button:hover { background: rgba(201, 169, 110, 0.1); }
        .rdp-caption_label { font-family: 'Playfair Display', serif; font-size: 1.25rem; color: var(--color-warm-white); }
        .rdp-head_cell { font-weight: 400; color: rgba(250, 248, 245, 0.4); text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.1em; }
      `}</style>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMonth.toISOString()}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <DayPicker
            mode="single"
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            locale={ru}
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            disabled={[{ before: new Date() }]}
          />
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
          <span className="text-warm-white/70">Свободно</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
          <span className="text-warm-white/70">Занято</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
          <span className="text-warm-white/70">Ремонт / Блок</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-white/20" />
          <span className="text-warm-white/70">Прошло</span>
        </div>
      </div>
    </div>
  );
}
