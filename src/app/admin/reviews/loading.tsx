export default function ReviewsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-8 w-48 bg-white/10 rounded-lg" />
        <div className="h-4 w-80 bg-white/5 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 h-48 space-y-3" />
        ))}
      </div>
    </div>
  );
}
