'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'calendar' | 'title' | 'text' | 'box' | 'years' | 'header' | 'card' | 'list' | 'user';
  className?: string;
}

/**
 * Main Skeleton component.
 * Acts as a primitive pulse box if no variant is provided, 
 * otherwise renders a predefined layout for backward compatibility.
 */
export function Skeleton({ variant, className, ...props }: SkeletonProps) {
  const baseClass = "animate-pulse bg-zinc-900/50 rounded-lg";

  // If no variant, act as a primitive
  if (!variant || variant === 'box') {
    return <div className={cn(baseClass, className)} {...props} />;
  }

  // Predefined Layouts
  if (variant === 'calendar') {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-6 gap-4", className)}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-4 w-1/2 mx-auto" />
            <div className="space-y-2">
              {[...Array(5)].map((_, j) => (
                <Skeleton key={j} className="h-24 rounded-xl border border-zinc-800/50 bg-zinc-900/40" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'header') {
    return (
      <div className={cn("flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10", className)}>
        <div className="space-y-3 flex-1">
          <Skeleton className="h-14 w-2/3 lg:w-1/2" />
          <Skeleton className="h-5 w-1/3" />
        </div>
        <Skeleton className="h-10 w-48 mb-1" />
      </div>
    );
  }

  if (variant === 'years') {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-[42px] w-24" />
        ))}
      </div>
    );
  }

  if (variant === 'title') {
    return <Skeleton className={cn("h-12 w-3/4 md:w-1/2", className)} />;
  }

  if (variant === 'text') {
    return <SkeletonText lines={1} className={className} />;
  }

  if (variant === 'card') {
    return (
      <div className={cn("p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-6", className)}>
        <div className="flex justify-between items-start">
          <div className="flex gap-4 items-center">
            <SkeletonCircle size="md" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <div className="grid grid-cols-4 gap-2">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-8 rounded-md" />
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-20 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'user') {
    return (
      <div className={cn("flex items-center gap-4", className)}>
        <div className="flex flex-col items-end gap-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-2 w-28" />
        </div>
        <SkeletonCircle size={32} />
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={cn("space-y-4", className)}>
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  return <div className={cn(baseClass, className)} {...props} />;
}

/**
 * Specialized Skeleton for Circles (Avatars, icons).
 */
export function SkeletonCircle({ size = "md", className, ...props }: React.HTMLAttributes<HTMLDivElement> & { size?: 'sm' | 'md' | 'lg' | number }) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16"
  };

  const finalStyle = typeof size === 'number' ? { width: size, height: size } : {};

  return (
    <Skeleton
      className={cn("rounded-full flex-shrink-0", typeof size === 'string' && sizeClasses[size], className)}
      style={finalStyle}
      {...props}
    />
  );
}

/**
 * Specialized Skeleton for multi-line text.
 */
export function SkeletonText({
  lines = 1,
  gap = "gap-2",
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { lines?: number, gap?: string }) {
  return (
    <div className={cn("flex flex-col w-full", gap, className)} {...props}>
      {[...Array(lines)].map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-4 w-full",
            // Hace que la última línea sea más corta si hay varias para realismo
            i === lines - 1 && lines > 1 && "w-[60%]"
          )}
        />
      ))}
    </div>
  );
}
