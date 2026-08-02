"use client";

import { useState, useCallback } from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  onRemove: () => void;
}

export default function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      onChange(data.url);
    } catch (error) {
      console.error(error);
      alert("Ошибка при загрузке изображения. Проверьте настройки Cloudinary в .env");
    } finally {
      setIsUploading(false);
    }
  }, [onChange]);

  if (value) {
    return (
      <div className="relative w-full h-48 rounded-lg overflow-hidden border border-white/10 group bg-black/20">
        <Image fill src={value} alt="Uploaded" className="object-cover" />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            type="button"
            onClick={onRemove}
            className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-48 border-2 border-dashed border-white/20 rounded-lg bg-white/5 hover:bg-white/10 transition-colors relative flex flex-col items-center justify-center group">
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={isUploading}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />
      {isUploading ? (
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      ) : (
        <>
          <UploadCloud className="w-10 h-10 text-white/40 group-hover:text-gold transition-colors mb-2" />
          <p className="text-sm text-white/50">Нажмите или перетащите изображение</p>
        </>
      )}
    </div>
  );
}
