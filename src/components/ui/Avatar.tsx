'use client';

import { useState } from 'react';
import Image from 'next/image';
import { UI_CONFIG } from '@/lib/constants';

interface AvatarProps {
  src?: string;
  name?: string;
  className?: string;
}

export function Avatar({ src, name, className = "" }: AvatarProps) {
  const [imageError, setImageError] = useState(false);

  // Genera un avatar de iniciales profesional si no hay imagen (usando DiceBear)
  const fallbackUrl = `${UI_CONFIG.DICEBEAR_API}?seed=${encodeURIComponent(name || 'User')}&backgroundColor=18181b&fontSize=${UI_CONFIG.AVATAR_FALLBACK_SIZE}&bold=true`;

  return (
    <div className={`${className} h-9 w-9 rounded-full border border-zinc-700 overflow-hidden transition-all duration-300 relative`}>
      <Image
        src={(!imageError && src) ? src : fallbackUrl}
        alt={name || "Avatar"}
        fill
        sizes="40px"
        unoptimized={imageError || !src} // Evita optimizar el SVG de DiceBear si falla la principal
        referrerPolicy="no-referrer"
        onError={() => setImageError(true)}
        className="object-cover"
      />
    </div>
  );
}
