"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("CMS Error:", error);
  }, [error]);

  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="bg-white/5 border border-red-500/20 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/30">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold font-serif text-warm-white">Произошла ошибка загрузки</h2>
          <p className="text-warm-white/60 text-sm">
            {error.message || "Не удалось загрузить данные системы. Пожалуйста, попробуйте еще раз."}
          </p>
        </div>
        <button
          onClick={() => reset()}
          className="w-full bg-gold hover:bg-gold/90 text-charcoal font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Попробовать снова</span>
        </button>
      </div>
    </div>
  );
}
