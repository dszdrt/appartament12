"use client";

import React, { useState, useTransition } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X, Loader2 } from 'lucide-react';
import ImageUpload from './ImageUpload';
import { addGalleryImage, removeGalleryImage, reorderGalleryImages } from '@/app/admin/gallery/actions';

interface GalleryImage {
  id: string;
  url: string;
}

function SortableGalleryItem({ image, onRemove }: { image: GalleryImage, onRemove: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative aspect-square rounded-lg overflow-hidden group bg-black/20 border border-white/10">
      <img src={image.url} alt="" className="object-cover w-full h-full" />
      
      <div 
        className="absolute bottom-2 left-2 p-1.5 bg-black/50 hover:bg-black/80 rounded cursor-grab active:cursor-grabbing text-white opacity-0 group-hover:opacity-100 transition-opacity"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-4 h-4" />
      </div>

      <button 
        type="button" 
        onClick={() => onRemove(image.id)}
        className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function GalleryManager({ initialImages }: { initialImages: GalleryImage[] }) {
  const [images, setImages] = useState(initialImages);
  const [isPending, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex(img => img.id === active.id);
      const newIndex = images.findIndex(img => img.id === over.id);
      
      const newArray = arrayMove(images, oldIndex, newIndex);
      setImages(newArray);
      
      startTransition(async () => {
        await reorderGalleryImages(newArray.map(img => img.id));
      });
    }
  };

  const handleUpload = async (url: string) => {
    startTransition(async () => {
      await addGalleryImage(url);
      // Wait for revalidation or just force reload / Optimistic UI
      // Here server action revalidates the path, so Next.js will refresh data 
      // But since we keep local state, we should ideally let server components handle data 
      // Or we can just reload the window for simplicity since it's an admin panel.
      window.location.reload();
    });
  };

  const handleRemove = async (id: string) => {
    setImages(images.filter(img => img.id !== id));
    startTransition(async () => {
      await removeGalleryImage(id);
    });
  };

  return (
    <div>
      {isPending && (
        <div className="flex items-center gap-2 text-gold mb-4 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" /> Сохранение изменений...
        </div>
      )}
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <SortableContext items={images.map(img => img.id)} strategy={rectSortingStrategy}>
            {images.map((img) => (
              <SortableGalleryItem 
                key={img.id} 
                image={img} 
                onRemove={handleRemove}
              />
            ))}
          </SortableContext>
          <div className="aspect-square">
            <ImageUpload value="" onChange={handleUpload} onRemove={() => {}} />
          </div>
        </div>
      </DndContext>
      <p className="text-xs text-white/40 mt-4">Перетаскивайте фотографии для изменения порядка на главной странице.</p>
    </div>
  );
}
