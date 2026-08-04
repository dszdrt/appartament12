"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bed,
  Image as ImageIcon,
  Settings,
  LogOut,
  CalendarCheck,
  CalendarDays,
  Menu,
  X,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useState, useEffect } from "react";

const navItems = [
  { href: "/admin", label: "Дашборд", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Заявки", icon: CalendarCheck },
  { href: "/admin/calendar", label: "Календарь", icon: CalendarDays },
  { href: "/admin/rooms", label: "Номера", icon: Bed },
  { href: "/admin/gallery", label: "Галерея", icon: ImageIcon },
  { href: "/admin/settings", label: "Настройки", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close sidebar on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile header bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-[#111111] border-b border-white/5 flex items-center justify-between px-4">
        <Link href="/admin" className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={28}
            height={28}
            className="filter-gold"
          />
          <span className="font-serif text-lg text-warm-white font-bold">
            CMS
          </span>
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-warm-white/70 hover:text-gold transition-colors"
          aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-40 h-screen
          w-64 bg-[#111111] border-r border-white/5 flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          lg:translate-x-0
        `}
      >
        {/* Desktop logo */}
        <div className="hidden lg:block p-6 border-b border-white/5">
          <Link href="/admin" className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={32}
              height={32}
              className="filter-gold"
            />
            <span className="font-serif text-xl text-warm-white font-bold">
              CMS
            </span>
          </Link>
        </div>

        {/* Mobile spacer for the fixed header */}
        <div className="lg:hidden h-14 flex-shrink-0" />

        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (pathname.startsWith(item.href) && item.href !== "/admin");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-gold/10 text-gold"
                    : "text-warm-white/70 hover:bg-white/5 hover:text-warm-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Выйти</span>
          </button>
        </div>
      </aside>
    </>
  );
}
