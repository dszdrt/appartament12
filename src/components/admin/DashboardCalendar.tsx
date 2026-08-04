"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { format, isSameDay } from "date-fns";
import { ru } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import "react-day-picker/dist/style.css";
import { X, User, LogIn, LogOut } from "lucide-react";

interface DashboardCalendarProps {
  bookings: any[];
}

export default function DashboardCalendar({ bookings }: DashboardCalendarProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter bookings for the selected date
  const todaysArrivals = bookings.filter(b => isSameDay(new Date(b.arrivalDate), selectedDate) && b.status === 'APPROVED');
  const todaysDepartures = bookings.filter(b => isSameDay(new Date(b.departureDate), selectedDate) && b.status === 'APPROVED');
  const inHouse = bookings.filter(b => {
    const arr = new Date(b.arrivalDate);
    const dep = new Date(b.departureDate);
    const sel = selectedDate;
    arr.setUTCHours(0,0,0,0);
    dep.setUTCHours(0,0,0,0);
    sel.setUTCHours(0,0,0,0);
    return sel >= arr && sel < dep && b.status === 'APPROVED';
  });

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setIsModalOpen(true);
  };

  // Modifiers to show indicators on the calendar
  const modifiers = {
    hasArrival: (date: Date) => bookings.some(b => isSameDay(new Date(b.arrivalDate), date) && b.status === 'APPROVED'),
    hasDeparture: (date: Date) => bookings.some(b => isSameDay(new Date(b.departureDate), date) && b.status === 'APPROVED'),
  };

  const modifiersStyles = {
    hasArrival: { borderBottom: '2px solid #22c55e' },
    hasDeparture: { borderTop: '2px solid #ef4444' },
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h2 className="text-xl font-bold mb-4 font-serif">Календарь загруженности</h2>
      
      <style>{`
        .admin-calendar { --rdp-cell-size: 38px; --rdp-accent-color: #C9A96E; margin: 0 auto; }
        .admin-calendar .rdp-day_selected { background-color: var(--rdp-accent-color); color: #1a1a1a; font-weight: bold; }
        .admin-calendar .rdp-nav_button { color: var(--color-gold); }
      `}</style>
      
      <div className="flex justify-center">
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={(d) => d && handleDayClick(d)}
          month={currentDate}
          onMonthChange={setCurrentDate}
          locale={ru}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          className="admin-calendar"
        />
      </div>

      <div className="mt-4 flex gap-4 text-xs justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0 border-b-2 border-green-500" />
          <span className="text-warm-white/70">Заезды</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0 border-t-2 border-red-500" />
          <span className="text-warm-white/70">Выезды</span>
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
              className="relative bg-charcoal-light border border-white/10 p-6 rounded-2xl w-full max-w-md shadow-2xl z-10"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-warm-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h3 className="text-xl font-bold mb-6 text-gold font-serif">
                {format(selectedDate, 'dd MMMM yyyy', { locale: ru })}
              </h3>

              <div className="space-y-6">
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-medium text-green-400 mb-3 uppercase tracking-wider">
                    <LogIn className="w-4 h-4" /> Заезды ({todaysArrivals.length})
                  </h4>
                  {todaysArrivals.length > 0 ? (
                    <div className="space-y-2">
                      {todaysArrivals.map(b => (
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
                    <LogOut className="w-4 h-4" /> Выезды ({todaysDepartures.length})
                  </h4>
                  {todaysDepartures.length > 0 ? (
                    <div className="space-y-2">
                      {todaysDepartures.map(b => (
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
                    Проживают ({inHouse.length})
                  </h4>
                  {inHouse.length > 0 ? (
                    <div className="space-y-2">
                      {inHouse.map(b => (
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
