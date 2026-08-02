import { useState, useEffect } from "react";
import { submitBooking } from "./actions";
import { Loader2, Calendar as CalendarIcon } from "lucide-react";
import Link from "next/link";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import "react-day-picker/dist/style.css";

export default function BookingForm({ rooms }: { rooms: { id: string, title: string }[] }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  
  const [dateRange, setDateRange] = useState<{from: Date | undefined, to: Date | undefined}>({
    from: undefined,
    to: undefined
  });

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  useEffect(() => {
    if (selectedRoom) {
      setBlockedDates([]);
      setDateRange({ from: undefined, to: undefined });
      fetch(`/api/rooms/${selectedRoom}/availability`)
        .then(res => res.json())
        .then(data => {
          if (data.dates) {
            setBlockedDates(data.dates.map((d: string) => new Date(d)));
          }
        });
    }
  }, [selectedRoom]);

  const handleSubmit = async (formData: FormData) => {
    if (!dateRange.from || !dateRange.to) {
      alert("Пожалуйста, выберите даты заезда и выезда.");
      return;
    }

    formData.set("arrivalDate", dateRange.from.toISOString());
    formData.set("departureDate", dateRange.to.toISOString());

    setLoading(true);
    try {
      await submitBooking(formData);
      setSubmitted(true);
    } catch (e) {
      alert("Ошибка при отправке заявки. Пожалуйста, проверьте все поля.");
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
            <div className="absolute z-50 top-full mt-2 left-0 bg-charcoal border border-white/10 p-4 rounded-xl shadow-xl">
              <style>{`
                .rdp { --rdp-cell-size: 40px; --rdp-accent-color: #C9A96E; --rdp-background-color: rgba(201, 169, 110, 0.2); }
                .rdp-day_selected { background-color: var(--rdp-accent-color); color: #1a1a1a; font-weight: bold; }
                .rdp-day_disabled { opacity: 0.2; text-decoration: line-through; }
              `}</style>
              <DayPicker
                mode="range"
                selected={dateRange as any}
                onSelect={(range: any) => {
                  setDateRange(range || {from: undefined, to: undefined});
                }}
                disabled={[
                  { before: new Date() },
                  ...blockedDates
                ]}
                locale={ru}
              />
              <button 
                type="button"
                onClick={() => setIsCalendarOpen(false)}
                className="w-full mt-4 text-sm text-gold hover:text-gold-light"
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
