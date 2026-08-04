"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar as CalendarIcon, Users, Search } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { motion, AnimatePresence } from "framer-motion";
import "react-day-picker/dist/style.css";
import { useRouter } from "next/navigation";

export default function BookingSearchWidget() {
  const router = useRouter();
  const [dateRange, setDateRange] = useState<{from: Date | undefined, to: Date | undefined}>({
    from: undefined,
    to: undefined
  });
  const [guests, setGuests] = useState(2);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleSearch = () => {
    if (!dateRange.from || !dateRange.to) {
      alert("Пожалуйста, выберите даты заезда и выезда");
      return;
    }
    const start = format(dateRange.from, 'yyyy-MM-dd');
    const end = format(dateRange.to, 'yyyy-MM-dd');
    
    // Smooth scroll to rooms section, and add query params
    router.push(`/?start=${start}&end=${end}&guests=${guests}#rooms`);
  };

  return (
    <div className="glass-light p-4 md:p-6 rounded-2xl md:rounded-full border border-white/10 shadow-2xl relative w-full max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row items-center gap-4">
        
        {/* Dates */}
        <div className="w-full md:w-1/2 relative">
          <button
            type="button"
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            className="w-full bg-black/20 hover:bg-black/30 transition-colors rounded-xl md:rounded-full px-6 py-4 flex items-center gap-4 text-left border border-white/5"
          >
            <CalendarIcon className="w-5 h-5 text-gold" />
            <div className="flex flex-col">
              <span className="text-xs text-warm-white/50 uppercase tracking-widest font-medium">Даты проживания</span>
              <span className="text-warm-white text-sm">
                {dateRange.from && dateRange.to 
                  ? `${format(dateRange.from, 'dd MMM', {locale: ru})} - ${format(dateRange.to, 'dd MMM', {locale: ru})}` 
                  : "Выберите даты"}
              </span>
            </div>
          </button>

          <AnimatePresence>
            {isCalendarOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute z-50 top-full mt-4 left-0 md:left-auto md:right-0 bg-charcoal border border-white/10 p-6 rounded-2xl shadow-2xl"
              >
                <style>{`
                  .rdp { --rdp-cell-size: 40px; --rdp-accent-color: #C9A96E; --rdp-background-color: rgba(201, 169, 110, 0.2); margin: 0; }
                  .rdp-day_selected, .rdp-day_selected:hover, .rdp-day_selected:focus { 
                    background-color: #C9A96E !important; 
                    color: #1a1a1a !important; 
                    font-weight: bold !important; 
                  }
                  .rdp-day_selected:not([disabled]) {
                    background-color: #C9A96E !important;
                    color: #1a1a1a !important;
                  }
                `}</style>
                <DayPicker
                  mode="range"
                  selected={dateRange as any}
                  onSelect={(range: any) => {
                    setDateRange(range || {from: undefined, to: undefined});
                    if (range?.from && range?.to) setIsCalendarOpen(false);
                  }}
                  disabled={[{ before: new Date() }]}
                  locale={ru}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Guests */}
        <div className="w-full md:w-1/4 relative">
          <div className="w-full bg-black/20 rounded-xl md:rounded-full px-6 py-4 flex items-center gap-4 border border-white/5">
            <Users className="w-5 h-5 text-gold shrink-0" />
            <div className="flex flex-col w-full">
              <span className="text-xs text-warm-white/50 uppercase tracking-widest font-medium">Гости</span>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="bg-transparent text-warm-white text-sm focus:outline-none appearance-none cursor-pointer w-full"
              >
                {[1,2,3,4].map(n => <option key={n} value={n} className="bg-charcoal text-white">{n} {n === 1 ? 'гость' : n < 5 ? 'гостя' : 'гостей'}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <div className="w-full md:w-1/4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSearch}
            className="w-full bg-gradient-to-r from-gold to-gold-dark hover:from-gold-light hover:to-gold text-charcoal rounded-xl md:rounded-full px-6 py-4 flex items-center justify-center gap-2 font-medium tracking-wide transition-all shadow-[0_0_20px_rgba(201,169,110,0.3)]"
          >
            <Search className="w-4 h-4" />
            НАЙТИ
          </motion.button>
        </div>
      </div>
    </div>
  );
}
