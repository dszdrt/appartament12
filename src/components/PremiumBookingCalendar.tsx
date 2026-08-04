"use client";

import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, addMonths, subMonths, isBefore, startOfDay, isSameMonth } from "date-fns";
import { ru } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getCalendarDays, weekDays } from "@/lib/calendar-utils";

export default function PremiumBookingCalendar({ rooms }: { rooms: { id: string, title: string }[] }) {
  const [currentMonth, setCurrentMonth] = useState<Date>(startOfDay(new Date()));
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [availability, setAvailability] = useState<Record<string, "available" | "booked" | "maintenance">>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAvailability = async () => {
      setIsLoading(true);
      try {
        const start = startOfMonth(currentMonth);
        const end = endOfMonth(addMonths(currentMonth, 1)); // Fetch 2 months
        
        let url = `/api/availability?start=${start.toISOString()}&end=${end.toISOString()}`;
        if (selectedRoom) {
          url += `&roomId=${selectedRoom}`;
        }
        
        const res = await fetch(url);
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
  }, [currentMonth, selectedRoom]);

  const days = getCalendarDays(currentMonth);

  const getStatus = (day: Date) => {
    if (isBefore(day, startOfDay(new Date()))) return 'past';
    const dateStr = format(day, 'yyyy-MM-dd');
    return availability[dateStr] || 'available'; // Default to available if in future and no blocks
  };

  return (
    <div className="glass-light rounded-3xl p-8 shadow-2xl border border-white/10 relative overflow-hidden">
      {isLoading && (
        <div className="absolute top-4 right-4 flex gap-1 z-20">
          <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 rounded-full bg-gold" />
          <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 rounded-full bg-gold" />
          <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 rounded-full bg-gold" />
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h3 className="font-serif text-2xl text-warm-white text-center md:text-left m-0">Доступность номеров</h3>
        <select
          value={selectedRoom}
          onChange={(e) => setSelectedRoom(e.target.value)}
          className="bg-black/20 border border-white/10 text-warm-white px-4 py-2 rounded-xl text-sm focus:border-gold focus:outline-none transition-colors appearance-none cursor-pointer max-w-[200px]"
        >
          <option value="" className="bg-[#1A1A1A]">Любой номер</option>
          {rooms.map(room => (
            <option key={room.id} value={room.id} className="bg-[#1A1A1A]">{room.title}</option>
          ))}
        </select>
      </div>
      
      <div className="max-w-sm mx-auto relative">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} 
            className="p-2 text-warm-white/70 hover:text-gold hover:bg-white/5 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <AnimatePresence mode="wait">
            <motion.span 
              key={currentMonth.toISOString()}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="font-serif text-xl text-warm-white capitalize tracking-wide"
            >
              {format(currentMonth, 'LLLL yyyy', { locale: ru })}
            </motion.span>
          </AnimatePresence>
          <button 
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} 
            className="p-2 text-warm-white/70 hover:text-gold hover:bg-white/5 rounded-full transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-4">
          {weekDays.map(d => (
            <div key={d} className="text-center text-xs text-warm-white/40 uppercase tracking-widest font-medium py-2">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-4 gap-x-2 relative min-h-[350px]">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentMonth.toISOString()}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="col-span-7 grid grid-cols-7 gap-y-4 gap-x-2 absolute inset-0"
            >
              {days.map((day, idx) => {
                const status = getStatus(day);
                const isCurrentMonth = isSameMonth(day, currentMonth);
                
                return (
                  <div key={idx} className="relative flex flex-col justify-center items-center group">
                    <div 
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all
                        ${status === 'past' ? 'text-white/20' : 'cursor-default'}
                        ${status !== 'past' && isCurrentMonth ? 'text-warm-white' : ''}
                        ${status !== 'past' && !isCurrentMonth ? 'text-warm-white/40' : ''}
                        ${status === 'booked' ? 'text-red-300 opacity-70 line-through decoration-red-500/50' : ''}
                      `}
                    >
                      {format(day, 'd')}
                    </div>
                    {/* Status dot */}
                    {status !== 'past' && (
                      <div className={`absolute bottom-0 w-1.5 h-1.5 rounded-full mt-1 
                        ${status === 'available' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : ''}
                        ${status === 'booked' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' : ''}
                        ${status === 'maintenance' ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]' : ''}
                      `} />
                    )}

                    {/* Tooltip */}
                    {status !== 'past' && (
                      <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 w-max px-3 py-1.5 bg-black/80 backdrop-blur rounded-lg text-xs border border-white/10 shadow-xl">
                        {status === 'available' && <span className="text-green-400">Свободно</span>}
                        {status === 'booked' && <span className="text-red-400">Мест нет</span>}
                        {status === 'maintenance' && <span className="text-orange-400">Частично недоступно</span>}
                      </div>
                    )}
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-12 flex flex-wrap justify-center gap-x-6 gap-y-4 text-xs">
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
