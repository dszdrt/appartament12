"use client";

import React, { useState } from 'react';
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
import { GripVertical, X } from 'lucide-react';
import ImageUpload from './ImageUpload';

interface SortableImageProps {
  id: string;
  url: string;
  onRemove: (id: string) => void;
  isCover: boolean;
}

function SortableImage({ id, url, onRemove, isCover }: SortableImageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative aspect-video rounded-lg overflow-hidden group bg-black/20 border border-white/10">
      <img src={url} alt="" className="object-cover w-full h-full" />
      
      {isCover && (
        <div className="absolute top-2 left-2 bg-gold text-charcoal text-xs font-bold px-2 py-1 rounded shadow-md pointer-events-none">
          Обложка
        </div>
      )}

      {/* Drag handle */}
      <div 
        className="absolute bottom-2 left-2 p-1.5 bg-black/50 hover:bg-black/80 rounded cursor-grab active:cursor-grabbing text-white opacity-0 group-hover:opacity-100 transition-opacity"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-4 h-4" />
      </div>

      <button 
        type="button" 
        onClick={() => onRemove(id)}
        className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function SortableImageGallery({ 
  images, 
  setImages 
}: { 
  images: string[], 
  setImages: (images: string[]) => void 
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = images.indexOf(active.id as string);
      const newIndex = images.indexOf(over.id as string);
      setImages(arrayMove(images, oldIndex, newIndex));
    }
  };

  return (
    <div>
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <SortableContext items={images} strategy={rectSortingStrategy}>
            {images.map((url, index) => (
              <SortableImage 
                key={url} 
                id={url} 
                url={url} 
                onRemove={(id) => setImages(images.filter(img => img !== id))}
                isCover={index === 0}
              />
            ))}
          </SortableContext>
          <ImageUpload value="" onChange={(url) => setImages([...images, url])} onRemove={() => {}} />
        </div>
      </DndContext>
      <p className="text-xs text-white/40">Перетаскивайте фотографии для изменения порядка. Первое фото будет обложкой номера.</p>
    </div>
  );
}
