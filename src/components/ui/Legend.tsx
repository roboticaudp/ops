import React from 'react';
import { cn } from '@/lib/utils';

interface LegendProps {
  children: React.ReactNode;
  className?: string;
}

export function Legend({ children, className }: LegendProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {children}
    </div>
  );
}

interface LegendItemProps {
  children: React.ReactNode;
  color: string;
  className?: string;
}

export function LegendItem({ children, color, className }: LegendItemProps) {
  return (
    <span className={cn("flex items-center gap-1 text-[10px] text-zinc-500", className)}>
      <span className={cn("w-2 h-2 rounded-[2px] inline-block", color)} />
      {children}
    </span>
  );
}
