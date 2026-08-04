"use client";

import { useState } from "react";
import { format, isSameDay, isSameMonth, addMonths, subMonths, isBefore, startOfDay } from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar as CalendarIcon, Users, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { getCalendarDays, weekDays } from "@/lib/calendar-utils";

export default function BookingSearchWidget() {
  const router = useRouter();
  const [dateRange, setDateRange] = useState<{from: Date | null, to: Date | null}>({
    from: null,
    to: null
  });
  const [guests, setGuests] = useState(2);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(startOfDay(new Date()));

  const handleSearch = () => {
    if (!dateRange.from || !dateRange.to) {
      alert("Пожалуйста, выберите даты заезда и выезда");
      return;
    }
    const start = format(dateRange.from, 'yyyy-MM-dd');
    const end = format(dateRange.to, 'yyyy-MM-dd');
    
    router.push(`/?start=${start}&end=${end}&guests=${guests}#rooms`);
  };

  const handleDayClick = (day: Date) => {
    if (isBefore(day, startOfDay(new Date()))) return;

    if (!dateRange.from || (dateRange.from && dateRange.to)) {
      setDateRange({ from: day, to: null });
    } else {
      if (isBefore(day, dateRange.from)) {
        setDateRange({ from: day, to: dateRange.from });
      } else {
        setDateRange({ from: dateRange.from, to: day });
        setIsCalendarOpen(false);
      }
    }
  };

  const isSelected = (day: Date) => {
    if (dateRange.from && isSameDay(day, dateRange.from)) return true;
    if (dateRange.to && isSameDay(day, dateRange.to)) return true;
    return false;
  };

  const isInRange = (day: Date) => {
    if (dateRange.from && dateRange.to) {
      return day > dateRange.from && day < dateRange.to;
    }
    return false;
  };

  const days = getCalendarDays(currentMonth);

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
                className="absolute z-50 top-full mt-4 left-0 md:left-auto md:right-0 bg-[#1A1A1A] border border-white/10 p-6 rounded-3xl shadow-2xl w-80 md:w-96"
              >
                <div className="flex items-center justify-between mb-6">
                  <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 text-warm-white/70 hover:text-gold hover:bg-white/5 rounded-full transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="font-serif text-lg text-warm-white capitalize">
                    {format(currentMonth, 'LLLL yyyy', { locale: ru })}
                  </span>
                  <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 text-warm-white/70 hover:text-gold hover:bg-white/5 rounded-full transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {weekDays.map(d => (
                    <div key={d} className="text-center text-xs text-warm-white/40 font-medium py-2">
                      {d}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-y-2">
                  {days.map((day, idx) => {
                    const disabled = isBefore(day, startOfDay(new Date()));
                    const selected = isSelected(day);
                    const range = isInRange(day);
                    const isCurrentMonth = isSameMonth(day, currentMonth);

                    return (
                      <div key={idx} className="relative flex justify-center items-center h-10">
                        {range && (
                          <div className="absolute inset-0 bg-gold/20" />
                        )}
                        {selected && dateRange.from && dateRange.to && (
                          <div className={`absolute inset-y-0 w-1/2 bg-gold/20 ${isSameDay(day, dateRange.from) ? 'right-0' : 'left-0'}`} />
                        )}
                        <button
                          onClick={() => handleDayClick(day)}
                          disabled={disabled}
                          className={`
                            relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all
                            ${disabled ? 'text-white/20 cursor-not-allowed' : 'cursor-pointer'}
                            ${!disabled && !selected && !range ? 'hover:bg-gold/20' : ''}
                            ${selected ? 'bg-gold text-charcoal font-bold shadow-lg' : ''}
                            ${range && !selected ? 'text-gold' : ''}
                            ${!selected && !range && !disabled && isCurrentMonth ? 'text-warm-white' : ''}
                            ${!selected && !range && !disabled && !isCurrentMonth ? 'text-warm-white/40' : ''}
                          `}
                        >
                          {format(day, 'd')}
                        </button>
                      </div>
                    );
                  })}
                </div>
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
                {[1,2,3,4].map(n => <option key={n} value={n} className="bg-[#1A1A1A] text-white">{n} {n === 1 ? 'гость' : n < 5 ? 'гостя' : 'гостей'}</option>)}
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
