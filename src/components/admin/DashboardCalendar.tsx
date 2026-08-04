"use client";

import { useState } from "react";
import { format, isSameDay, startOfMonth, addMonths, subMonths, isSameMonth } from "date-fns";
import { ru } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, LogIn, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { getCalendarDays, weekDays } from "@/lib/calendar-utils";

interface DashboardCalendarProps {
  bookings: any[];
}

export default function DashboardCalendar({ bookings }: DashboardCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getDayData = (date: Date) => {
    const arrivals = bookings.filter(b => isSameDay(new Date(b.arrivalDate), date) && b.status === 'APPROVED');
    const departures = bookings.filter(b => isSameDay(new Date(b.departureDate), date) && b.status === 'APPROVED');
    const inHouse = bookings.filter(b => {
      const arr = new Date(b.arrivalDate);
      const dep = new Date(b.departureDate);
      arr.setUTCHours(0,0,0,0);
      dep.setUTCHours(0,0,0,0);
      const sel = new Date(date);
      sel.setUTCHours(0,0,0,0);
      return sel >= arr && sel < dep && b.status === 'APPROVED';
    });
    return { arrivals, departures, inHouse };
  };

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setIsModalOpen(true);
  };

  const days = getCalendarDays(currentMonth);
  const selectedData = getDayData(selectedDate);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative">
      <h2 className="text-xl font-bold mb-4 font-serif text-warm-white">Календарь загруженности</h2>
      
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} 
            className="p-2 text-warm-white/70 hover:text-gold hover:bg-white/5 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-serif text-lg text-warm-white capitalize tracking-wide">
            {format(currentMonth, 'LLLL yyyy', { locale: ru })}
          </span>
          <button 
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} 
            className="p-2 text-warm-white/70 hover:text-gold hover:bg-white/5 rounded-full transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(d => (
            <div key={d} className="text-center text-xs text-warm-white/40 uppercase tracking-widest font-medium py-1">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-2 relative min-h-[280px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMonth.toISOString()}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="col-span-7 grid grid-cols-7 gap-y-2 absolute inset-0"
            >
              {days.map((day, idx) => {
                const { arrivals, departures } = getDayData(day);
                const isSelected = isSameDay(day, selectedDate);
                const isCurrentMonth = isSameMonth(day, currentMonth);

                return (
                  <div key={idx} className="relative flex justify-center items-center h-12">
                    <button
                      onClick={() => handleDayClick(day)}
                      className={`
                        w-10 h-10 rounded-full flex flex-col items-center justify-center text-sm transition-all
                        ${!isCurrentMonth ? 'text-warm-white/30' : 'text-warm-white'}
                        ${isSelected ? 'bg-gold text-charcoal font-bold shadow-lg scale-110' : 'hover:bg-white/10'}
                      `}
                    >
                      <span>{format(day, 'd')}</span>
                      
                      {/* Event indicators */}
                      <div className="flex gap-1 mt-0.5">
                        {arrivals.length > 0 && <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-green-700' : 'bg-green-500'}`} />}
                        {departures.length > 0 && <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-red-700' : 'bg-red-500'}`} />}
                      </div>
                    </button>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-4 flex gap-6 text-xs justify-center border-t border-white/10 pt-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-warm-white/70">Заезды</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-warm-white/70">Выезды</span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-[#1A1A1A] border border-white/10 p-6 rounded-2xl w-full max-w-md shadow-2xl z-10"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-warm-white/50 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h3 className="text-xl font-bold mb-6 text-gold font-serif capitalize">
                {format(selectedDate, 'dd MMMM yyyy', { locale: ru })}
              </h3>

              <div className="space-y-6">
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-medium text-green-400 mb-3 uppercase tracking-wider">
                    <LogIn className="w-4 h-4" /> Заезды ({selectedData.arrivals.length})
                  </h4>
                  {selectedData.arrivals.length > 0 ? (
                    <div className="space-y-2">
                      {selectedData.arrivals.map(b => (
                        <div key={b.id} className="bg-white/5 p-3 rounded-lg text-sm border-l-2 border-green-400">
                          <p className="font-bold">{b.room.title}</p>
                          <p className="text-warm-white/70 flex items-center gap-1 mt-1"><User className="w-3 h-3"/> {b.guestName} ({b.phone})</p>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-sm text-warm-white/30">Нет заездов</p>}
                </div>

                <div>
                  <h4 className="flex items-center gap-2 text-sm font-medium text-red-400 mb-3 uppercase tracking-wider">
                    <LogOut className="w-4 h-4" /> Выезды ({selectedData.departures.length})
                  </h4>
                  {selectedData.departures.length > 0 ? (
                    <div className="space-y-2">
                      {selectedData.departures.map(b => (
                        <div key={b.id} className="bg-white/5 p-3 rounded-lg text-sm border-l-2 border-red-400">
                          <p className="font-bold">{b.room.title}</p>
                          <p className="text-warm-white/70 flex items-center gap-1 mt-1"><User className="w-3 h-3"/> {b.guestName} ({b.phone})</p>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-sm text-warm-white/30">Нет выездов</p>}
                </div>

                <div>
                  <h4 className="flex items-center gap-2 text-sm font-medium text-blue-400 mb-3 uppercase tracking-wider">
                    Проживают ({selectedData.inHouse.length})
                  </h4>
                  {selectedData.inHouse.length > 0 ? (
                    <div className="space-y-2">
                      {selectedData.inHouse.map(b => (
                        <div key={b.id} className="bg-white/5 p-3 rounded-lg text-sm border-l-2 border-blue-400">
                          <p className="font-bold">{b.room.title}</p>
                          <p className="text-warm-white/70 flex items-center gap-1 mt-1"><User className="w-3 h-3"/> {b.guestName}</p>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-sm text-warm-white/30">Свободно</p>}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
