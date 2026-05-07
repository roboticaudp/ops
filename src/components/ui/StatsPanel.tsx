import React from 'react';
import { cn } from '@/lib/utils';

interface StatsPanelProps {
  children: React.ReactNode;
  className?: string;
}

export function StatsPanel({ children, className }: StatsPanelProps) {
  const childrenArray = React.Children.toArray(children);

  return (
    <div className={cn("flex items-center gap-4 px-3 py-2 bg-zinc-950/50 rounded-lg border border-zinc-900", className)}>
      {childrenArray.map((child, index) => (
        <React.Fragment key={index}>
          {child}
          {index < childrenArray.length - 1 && (
            <div className="w-px h-8 bg-zinc-800" aria-hidden="true" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

interface StatsItemProps {
  label: string;
  value: string | number;
  valueClassName?: string;
  className?: string;
}

export function StatsItem({ label, value, valueClassName, className }: StatsItemProps) {
  return (
    <div className={cn("flex-1 text-center", className)}>
      <p className={cn("text-lg font-bold text-zinc-200", valueClassName)}>{value}</p>
      <p className="text-[10px] text-zinc-500">{label}</p>
    </div>
  );
}
