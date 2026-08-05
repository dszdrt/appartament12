"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  LayoutDashboard, 
  CalendarCheck, 
  CalendarDays, 
  Bed, 
  Image as ImageIcon, 
  Star, 
  Settings, 
  Plus, 
  ExternalLink,
  X
} from "lucide-react";

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  // Keyboard shortcut listener (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const commands = [
    { title: "Дашборд", category: "Навигация", href: "/admin", icon: LayoutDashboard },
    { title: "Заявки бронирования", category: "Навигация", href: "/admin/bookings", icon: CalendarCheck },
    { title: "Календарь занятости", category: "Навигация", href: "/admin/calendar", icon: CalendarDays },
    { title: "Управление номерами", category: "Навигация", href: "/admin/rooms", icon: Bed },
    { title: "Фотогалерея", category: "Навигация", href: "/admin/gallery", icon: ImageIcon },
    { title: "Отзывы гостей", category: "Навигация", href: "/admin/reviews", icon: Star },
    { title: "Настройки сайта", category: "Навигация", href: "/admin/settings", icon: Settings },
    { title: "Добавить новый номер", category: "Быстрые действия", href: "/admin/rooms/new", icon: Plus },
    { title: "Перейти на главный сайт", category: "Быстрые действия", href: "/", icon: ExternalLink, external: true },
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  const navigateTo = (href: string, external?: boolean) => {
    setIsOpen(false);
    setQuery("");
    if (external) {
      window.open(href, "_blank");
    } else {
      router.push(href);
    }
  };

  return (
    <>
      {/* Trigger Button in Admin Header / Layout */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-3 px-3.5 py-2 bg-black/40 border border-white/10 hover:border-gold/30 rounded-xl text-warm-white/60 hover:text-warm-white transition-all text-xs w-full sm:w-64 justify-between group shadow-sm"
      >
        <span className="flex items-center gap-2">
          <Search className="w-3.5 h-3.5 text-gold/70 group-hover:text-gold transition-colors" />
          <span>Быстрый поиск...</span>
        </span>
        <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white/10 text-warm-white/50 rounded border border-white/10">
          Ctrl K
        </kbd>
      </button>

      {/* Modal Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 px-4">
          <div 
            className="bg-[#1C1C1C] border border-white/15 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Input Header */}
            <div className="flex items-center px-4 border-b border-white/10 relative">
              <Search className="w-5 h-5 text-gold shrink-0 mr-3" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск по разделам и действиям... (например: Номера)"
                className="w-full py-4 bg-transparent text-warm-white placeholder-white/40 focus:outline-none text-sm"
              />
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-warm-white/50 hover:text-warm-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results List */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              {filteredCommands.length === 0 ? (
                <div className="p-8 text-center text-warm-white/40 text-sm">
                  Ничего не найдено по запросу «{query}»
                </div>
              ) : (
                filteredCommands.map((cmd, idx) => {
                  const Icon = cmd.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => navigateTo(cmd.href, cmd.external)}
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gold/10 hover:border hover:border-gold/20 text-left group transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white/5 text-warm-white/70 group-hover:text-gold group-hover:bg-gold/20 transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-warm-white group-hover:text-gold transition-colors">
                            {cmd.title}
                          </p>
                          <p className="text-[11px] text-warm-white/40">{cmd.category}</p>
                        </div>
                      </div>
                      <span className="text-xs text-warm-white/30 group-hover:text-gold/70 transition-colors font-mono">
                        ⏎
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer Hint */}
            <div className="px-4 py-2.5 bg-black/30 border-t border-white/5 flex items-center justify-between text-[11px] text-warm-white/40">
              <span>Используйте <kbd className="px-1 py-0.5 bg-white/10 rounded font-mono text-warm-white/60">Esc</kbd> для закрытия</span>
              <span>Apartments12 CMS</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
