import Sidebar from "@/components/admin/Sidebar";

export const metadata = {
  title: "CMS | Apartments12",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#1A1A1A] text-warm-white">
      <Sidebar />
      <main className="flex-1 p-4 pt-18 lg:p-8 lg:pt-8 overflow-y-auto min-h-screen relative">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
