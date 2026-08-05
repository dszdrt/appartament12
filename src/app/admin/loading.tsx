export default function AdminDashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Title Skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-64 bg-white/10 rounded-lg" />
        <div className="h-4 w-96 bg-white/5 rounded-lg" />
      </div>

      {/* Grid Stats Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-4 w-28 bg-white/10 rounded" />
              <div className="w-8 h-8 rounded-lg bg-gold/10" />
            </div>
            <div className="h-8 w-16 bg-white/10 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 h-80" />
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-80 space-y-4">
          <div className="h-6 w-40 bg-white/10 rounded" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 bg-white/5 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
