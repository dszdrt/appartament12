import fs from 'fs';
import path from 'path';

export interface RoomImage {
  src: string;
  alt: string;
}

export interface Room {
  slug: string;
  number: number;
  name: string;
  nameRu: string;
  images: RoomImage[];
  coverImage: RoomImage;
}

const ROOM_SLUGS: Record<string, { number: number; name: string; nameRu: string }> = {
  'japan': { number: 1, name: 'Japan', nameRu: 'Япония' },
  'hunt': { number: 2, name: 'Hunt', nameRu: 'Охота' },
  'country': { number: 3, name: 'Country', nameRu: 'Кантри' },
  'rome': { number: 4, name: 'Rome', nameRu: 'Рим' },
  'hi-tech': { number: 5, name: 'Hi-Tech', nameRu: 'Хай-тек' },
  'minimal': { number: 6, name: 'Minimal', nameRu: 'Минимал' },
  'safari': { number: 7, name: 'Safari', nameRu: 'Сафари' },
  'village': { number: 8, name: 'Village', nameRu: 'Деревня' },
  'north': { number: 9, name: 'North', nameRu: 'Север' },
  'marine': { number: 10, name: 'Marine', nameRu: 'Морской' },
};

// Function to get images dir path
function getImagesDir(): string {
  return path.join(process.cwd(), 'public', 'images');
}

// Scan a directory for image files
function scanDirectory(dirPath: string): string[] {
  try {
    const files = fs.readdirSync(dirPath);
    return files
      .filter(f => /\.(jpg|jpeg|png|webp|avif)$/i.test(f))
      .sort();
  } catch {
    return [];
  }
}

// Get all common/hotel images
export function getCommonImages(): RoomImage[] {
  const dir = path.join(getImagesDir(), 'common');
  const files = scanDirectory(dir);
  return files.map(f => ({
    src: `/images/common/${f}`,
    alt: 'Apartments 12 — отель',
  }));
}

// Get a specific room by slug
export function getRoom(slug: string): Room | null {
  const meta = ROOM_SLUGS[slug];
  if (!meta) return null;
  
  const dir = path.join(getImagesDir(), slug);
  const files = scanDirectory(dir);
  const images = files.map(f => ({
    src: `/images/${slug}/${f}`,
    alt: `Апартаменты ${meta.nameRu} — Apartments 12`,
  }));
  
  return {
    slug,
    number: meta.number,
    name: meta.name,
    nameRu: meta.nameRu,
    images,
    coverImage: images[0] || { src: '', alt: '' },
  };
}

// Get all rooms
export function getAllRooms(): Room[] {
  return Object.keys(ROOM_SLUGS)
    .map(slug => getRoom(slug)!)
    .filter(Boolean)
    .sort((a, b) => a.number - b.number);
}

// Get all room slugs (for generateStaticParams)
export function getAllRoomSlugs(): string[] {
  return Object.keys(ROOM_SLUGS);
}
