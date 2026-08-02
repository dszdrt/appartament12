"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton({ 
  children, 
  pendingText = "Сохранение..." 
}: { 
  children: React.ReactNode;
  pendingText?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      disabled={pending}
      className={`bg-gold text-charcoal px-8 py-3 rounded-lg font-medium transition-colors ${pending ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gold/90'}`}
    >
      {pending ? pendingText : children}
    </button>
  );
}
