"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Bed, Image as ImageIcon, Settings, Home, LogOut, CalendarCheck, CalendarDays } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";

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

  return (
    <aside className="w-64 bg-[#111111] border-r border-white/5 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-white/5">
        <Link href="/admin" className="flex items-center gap-3">
          <Image src="/images/logo.png" alt="Logo" width={32} height={32} className="filter-gold" />
          <span className="font-serif text-xl text-warm-white font-bold">CMS</span>
        </Link>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/admin");

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
  );
}
