export default function BookingsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-8 w-64 bg-white/10 rounded-lg" />
        <div className="h-9 w-32 bg-white/10 rounded-lg" />
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-9 w-24 bg-white/5 rounded-lg" />
        ))}
      </div>
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-12 bg-white/5 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
