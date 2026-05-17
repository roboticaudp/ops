'use client';

import React from 'react';
import { TIME_BLOCKS, Day, Block } from '@/types';
import { cn } from "@/lib/utils";

const DAYS: Day[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

interface CalendarProps {
  renderBlock: (block: Block) => React.ReactNode;
  className?: string;
}

export function Calendar({ renderBlock, className }: CalendarProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-6 gap-4", className)}>
      {DAYS.map(day => (
        <div key={day} className="space-y-4">
          <div className="text-center pb-2 border-b border-zinc-800">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{day}</span>
          </div>
          <div className="space-y-2">
            {TIME_BLOCKS.filter((b: Block) => b.day === day).map((block: Block) => (
              <React.Fragment key={block.id}>
                {renderBlock(block)}
              </React.Fragment>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

interface CalendarBlockProps {
  time?: string;
  badge?: React.ReactNode;
  children?: React.ReactNode;
  variant?: 'default' | 'active' | 'inactive' | 'highlight';
  className?: string;
  onClick?: () => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  minHeight?: string;
}

export function CalendarBlock({
  time,
  badge,
  children,
  variant = 'default',
  className,
  onClick,
  onDragOver,
  onDragLeave,
  onDrop,
  minHeight = "85px"
}: CalendarBlockProps) {
  const Component = onClick ? 'button' : 'div';

  const variants = {
    default: "bg-zinc-900/20 border-zinc-800/50",
    active: "bg-zinc-900/60 border-zinc-800/50",
    inactive: "opacity-40 bg-zinc-900/10 border-dashed border-zinc-800/40 pointer-events-none",
    highlight: "opacity-90 bg-blue-500/[0.05] border-dashed border-blue-500/40"
  };

  return (
    <Component
      onClick={onClick}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      style={{ minHeight }}
      className={cn(
        "w-full p-3 rounded-xl border transition-all duration-300 ease-in-out flex flex-col justify-between text-left group",
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
