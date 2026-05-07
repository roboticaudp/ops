'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface CalendarBlockProps {
  time?: string;
  badge?: React.ReactNode;
  children?: React.ReactNode;
  variant?: 'default' | 'active' | 'inactive' | 'highlight';
  className?: string;
  onClick?: () => void;
  minHeight?: string;
}

export function CalendarBlock({
  time,
  badge,
  children,
  variant = 'default',
  className,
  onClick,
  minHeight = "85px"
}: CalendarBlockProps) {
  const Component = onClick ? 'button' : 'div';

  const variants = {
    default: "bg-zinc-900/20 border-zinc-800/50",
    active: "bg-zinc-900/60 border-zinc-800/50",
    inactive: "opacity-10 border-dashed grayscale pointer-events-none",
    highlight: "bg-zinc-900/40 border-zinc-800"
  };

  return (
    <Component
      onClick={onClick}
      style={{ minHeight }}
      className={cn(
        "w-full p-3 rounded-lg border transition-all flex flex-col justify-between text-left group",
        variants[variant],
        onClick && "active:scale-[0.99]",
        className
      )}
    >
      <div className="flex justify-between items-start mb-2 w-full">
        {time && (
          <span className={cn(
            "text-[10px] font-mono font-semibold transition-colors",
            variant === 'inactive' ? 'opacity-60' : 'opacity-[0.37]'
          )}>
            {time}
          </span>
        )}
        {badge}
      </div>

      <div className="flex-1 w-full flex flex-col">
        {children}
      </div>
    </Component>
  );
}
