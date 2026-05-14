'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Typography } from './Typography';

interface ProfileProps {
  /** Componente Avatar o cualquier elemento visual a la izquierda/derecha */
  avatar: React.ReactNode;
  /** Título principal (Nombre) */
  title: React.ReactNode;
  /** Descripción secundaria (Email, Escuela, etc.) */
  description?: React.ReactNode;
  /** Invierte el orden (Avatar a la derecha, texto a la izquierda) */
  reverse?: boolean;
  /** Clases adicionales para el contenedor */
  className?: string;
  /** Clases adicionales para el título */
  titleClassName?: string;
}

export function Profile({
  avatar,
  title,
  description,
  reverse = false,
  className = "",
  titleClassName = ""
}: ProfileProps) {
  return (
    <div className={cn(
      "flex items-center gap-3",
      reverse && "flex-row-reverse text-right",
      className
    )}>
      <div className="flex-shrink-0">
        {avatar}
      </div>
      <div className={cn(
        "flex flex-col min-w-0",
        reverse ? "items-end" : "items-start"
      )}>
        <Typography 
          as="p" 
          className={cn(
            "text-sm font-bold truncate w-full tracking-tight",
            titleClassName
          )}
        >
          {title}
        </Typography>
        {description && (
          <div className="text-[11px] text-zinc-500 truncate w-full leading-none mt-0.5">
            {description}
          </div>
        )}
      </div>
    </div>
  );
}
