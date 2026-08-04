"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <motion.div
            className="absolute inset-0 border-2 border-gold/30 rounded-full"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="w-8 h-8 bg-gold rounded-full shadow-[0_0_20px_rgba(201,169,110,0.5)]"
            animate={{ scale: [1, 0.8, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <motion.p 
          className="text-gold uppercase tracking-[0.3em] text-xs font-serif"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          Загрузка
        </motion.p>
      </div>
    </div>
  );
}
