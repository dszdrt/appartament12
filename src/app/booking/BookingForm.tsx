"use client";

import { useState, useEffect } from "react";
import { submitBooking } from "./actions";
import { Loader2, Calendar as CalendarIcon } from "lucide-react";
import Link from "next/link";
import { format, isBefore, startOfDay, isSameDay, isSameMonth, addMonths, subMonths } from "date-fns";
import { ru } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getCalendarDays, weekDays } from "@/lib/calendar-utils";

export default function BookingForm({ rooms }: { rooms: { id: string, title: string }[] }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  
  const [dateRange, setDateRange] = useState<{from: Date | null, to: Date | null}>({
    from: null,
    to: null
  });

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(startOfDay(new Date()));

  useEffect(() => {
    if (selectedRoom) {
      setBlockedDates([]);
      setDateRange({ from: null, to: null });
      fetch(`/api/rooms/${selectedRoom}/availability`)
        .then(res => res.json())
        .then(data => {
          if (data.dates) {
            setBlockedDates(data.dates.map((d: string) => new Date(d)));
          }
        });
    }
  }, [selectedRoom]);

  const isDayBlocked = (day: Date) => {
    return blockedDates.some(blocked => isSameDay(blocked, day));
  };

  const handleDayClick = (day: Date) => {
    if (isBefore(day, startOfDay(new Date())) || isDayBlocked(day)) return;

    if (!dateRange.from || (dateRange.from && dateRange.to)) {
      setDateRange({ from: day, to: null });
    } else {
      if (isBefore(day, dateRange.from)) {
        setDateRange({ from: day, to: dateRange.from });
      } else {
        // Ensure no blocked dates in range
        const hasBlocked = blockedDates.some(b => b > dateRange.from! && b < day);
        if (hasBlocked) {
          alert("Выбранный период включает недоступные даты.");
          setDateRange({ from: day, to: null });
          return;
        }
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

  const handleSubmit = async (formData: FormData) => {
    if (!dateRange.from || !dateRange.to) {
      alert("Пожалуйста, выберите даты заезда и выезда.");
      return;
    }

    formData.set("arrivalDate", format(dateRange.from, 'yyyy-MM-dd'));
    formData.set("departureDate", format(dateRange.to, 'yyyy-MM-dd'));

    setLoading(true);
    try {
      const res = await submitBooking(formData);
      if (res && res.error) {
        alert(res.error);
        return;
      }
      setSubmitted(true);
    } catch (e) {
      alert("Ошибка сети при отправке заявки. Пожалуйста, попробуйте еще раз.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="glass-light p-12 text-center">
        <div className="text-gold text-5xl mb-6">✓</div>
        <h2 className="font-serif text-3xl text-warm-white mb-4">
          Спасибо за бронирование!
        </h2>
        <p className="text-warm-white/50 text-lg mb-8">
          Ваша заявка принята. Мы свяжемся с вами в ближайшее время для подтверждения бронирования.
        </p>
        <Link href="/" className="btn-outline inline-block">
          На главную
        </Link>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="glass-light p-8 md:p-12 space-y-6 relative">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-warm-white/40 text-xs tracking-[0.15em] uppercase block mb-2">Имя</label>
          <input type="text" name="guestName" required placeholder="Ваше имя" className="w-full bg-charcoal-light border border-white/10 text-warm-white px-4 py-3 text-sm focus:border-gold focus:outline-none transition-colors" />
        </div>
        <div>
          <label className="text-warm-white/40 text-xs tracking-[0.15em] uppercase block mb-2">Телефон</label>
          <input type="tel" name="phone" required placeholder="+7 (999) 123-45-67" className="w-full bg-charcoal-light border border-white/10 text-warm-white px-4 py-3 text-sm focus:border-gold focus:outline-none transition-colors" />
        </div>
      </div>

      <div>
        <label className="text-warm-white/40 text-xs tracking-[0.15em] uppercase block mb-2">Email</label>
        <input type="email" name="email" placeholder="your@email.com (необязательно)" className="w-full bg-charcoal-light border border-white/10 text-warm-white px-4 py-3 text-sm focus:border-gold focus:outline-none transition-colors" />
      </div>

      <div className="line-gold my-8" />

      <div>
        <label className="text-warm-white/40 text-xs tracking-[0.15em] uppercase block mb-2">Номер</label>
        <select
          name="roomId"
          required
          value={selectedRoom}
          onChange={(e) => setSelectedRoom(e.target.value)}
          className="w-full bg-charcoal-light border border-white/10 text-warm-white px-4 py-3 text-sm focus:border-gold focus:outline-none transition-colors appearance-none"
        >
          <option value="">Выберите номер</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>{room.title}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        <div className="md:col-span-1">
          <label className="text-warm-white/40 text-xs tracking-[0.15em] uppercase block mb-2">Даты проживания</label>
          <button
            type="button"
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            disabled={!selectedRoom}
            className="w-full bg-charcoal-light border border-white/10 text-left text-warm-white px-4 py-3 text-sm focus:border-gold focus:outline-none transition-colors flex items-center justify-between disabled:opacity-50"
          >
            <span>
              {dateRange.from && dateRange.to 
                ? `${format(dateRange.from, 'dd MMM', {locale: ru})} - ${format(dateRange.to, 'dd MMM', {locale: ru})}` 
                : !selectedRoom ? "Сначала выберите номер" : "Выберите даты"}
            </span>
            <CalendarIcon className="w-4 h-4 text-warm-white/50" />
          </button>
          
          {isCalendarOpen && (
            <div className="absolute z-50 top-full mt-2 left-0 bg-[#1A1A1A] border border-white/10 p-4 rounded-2xl shadow-2xl w-80 md:w-96">
              <div className="flex items-center justify-between mb-4">
                <button type="button" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 text-warm-white/70 hover:text-gold hover:bg-white/5 rounded-full transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="font-serif text-lg text-warm-white capitalize">
                  {format(currentMonth, 'LLLL yyyy', { locale: ru })}
                </span>
                <button type="button" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 text-warm-white/70 hover:text-gold hover:bg-white/5 rounded-full transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map(d => (
                  <div key={d} className="text-center text-xs text-warm-white/40 font-medium py-1">
                    {d}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-y-1">
                {days.map((day, idx) => {
                  const disabled = isBefore(day, startOfDay(new Date())) || isDayBlocked(day);
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
                        type="button"
                        onClick={() => handleDayClick(day)}
                        disabled={disabled}
                        className={`
                          relative z-10 w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-xs transition-all
                          ${disabled ? 'text-white/20 cursor-not-allowed line-through decoration-red-500/50' : 'cursor-pointer'}
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

              <button 
                type="button"
                onClick={() => setIsCalendarOpen(false)}
                className="w-full mt-4 text-sm text-gold hover:text-gold-light py-2"
              >
                Закрыть
              </button>
            </div>
          )}
        </div>
        
        <div>
          <label className="text-warm-white/40 text-xs tracking-[0.15em] uppercase block mb-2">Гости</label>
          <select name="guests" required className="w-full bg-charcoal-light border border-white/10 text-warm-white px-4 py-3 text-sm focus:border-gold focus:outline-none transition-colors appearance-none">
            <option value="1">1 гость</option>
            <option value="2">2 гостя</option>
            <option value="3">3 гостя</option>
            <option value="4">4 гостя</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-warm-white/40 text-xs tracking-[0.15em] uppercase block mb-2">Пожелания</label>
        <textarea name="notes" rows={3} placeholder="Особые пожелания или комментарии" className="w-full bg-charcoal-light border border-white/10 text-warm-white px-4 py-3 text-sm focus:border-gold focus:outline-none transition-colors placeholder:text-warm-white/20 resize-none" />
      </div>

      <button type="submit" disabled={loading} className="btn-gold w-full mt-4 flex items-center justify-center gap-2 disabled:opacity-50">
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Отправить заявку"}
      </button>

      <p className="text-warm-white/20 text-xs text-center">Нажимая кнопку, вы соглашаетесь на обработку персональных данных</p>
    </form>
  );
}
