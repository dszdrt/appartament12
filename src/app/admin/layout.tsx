import Sidebar from "@/components/admin/Sidebar";
import CommandPalette from "@/components/admin/CommandPalette";
import { Toaster } from "sonner";

export const metadata = {
  title: "CMS | Apartments12",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#1A1A1A] text-warm-white">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto min-h-screen relative">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Top Bar with Command Palette & Status */}
          <div className="flex items-center justify-between pb-4 border-b border-white/5 gap-4">
            <CommandPalette />
            <div className="flex items-center gap-2 text-xs text-warm-white/40">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="hidden sm:inline">Система активна</span>
            </div>
          </div>

          {children}
        </div>
      </main>

      {/* Global Toast System */}
      <Toaster position="bottom-right" theme="dark" richColors />
    </div>
  );
}
