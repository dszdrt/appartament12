'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface RoomCardProps {
  slug: string;
  number: number;
  nameRu: string;
  shortDescription: string;
  price: string;
  coverImage: string;
  index: number;
  unavailable?: boolean;
}

export default function RoomCard({
  slug,
  number,
  nameRu,
  shortDescription,
  price,
  coverImage,
  index,
  unavailable = false,
}: RoomCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
    >
      <Link href={unavailable ? "#" : `/rooms/${slug}`} className={`group block ${unavailable ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}>
        <div className="relative overflow-hidden aspect-[3/4] mb-6 rounded-2xl">
          <Image
            src={coverImage}
            alt={`Апартаменты ${nameRu}`}
            fill
            className={`object-cover transition-transform duration-700 ease-out ${unavailable ? 'grayscale' : 'group-hover:scale-110'}`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {unavailable && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-4 text-center">
              <span className="text-warm-white font-medium px-4 py-2 bg-red-500/80 rounded-lg text-sm backdrop-blur-md border border-white/20 shadow-xl">
                Недоступно на выбранные даты
              </span>
            </div>
          )}

          {/* Room number overlay */}
          <div className="absolute top-4 left-4">
            <span className="text-gold/30 font-serif text-6xl font-bold">{'0' + number}</span>
          </div>

          {/* Hover content */}
          {!unavailable && (
            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
              <span className="btn-outline text-xs py-2 px-6 inline-block">
                Подробнее
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <h3 className="font-serif text-xl text-warm-white group-hover:text-gold transition-colors duration-300">
              {nameRu}
            </h3>
            <span className="text-gold text-sm">{price}</span>
          </div>
          <p className="text-warm-white/50 text-sm font-light line-clamp-2">
            {shortDescription}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
