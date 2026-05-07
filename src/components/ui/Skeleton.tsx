'use client';

import React from 'react';

interface SkeletonProps {
  variant?: 'calendar' | 'title' | 'text' | 'box' | 'years' | 'header' | 'card' | 'list' | 'user';
  className?: string;
}

export function Skeleton({ variant = 'box', className = "" }: SkeletonProps) {
  const baseClass = "animate-pulse bg-zinc-900/50 rounded-lg";

  if (variant === 'calendar') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-6 gap-4 ${className}`}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-4 animate-pulse">
            <div className="h-4 bg-zinc-900 rounded w-1/2 mx-auto" />
            <div className="space-y-2">
              {[...Array(5)].map((_, j) => (
                <div key={j} className="h-24 bg-zinc-900/40 rounded-xl border border-zinc-800/50" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'header') {
    return (
      <div className={`flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 ${className}`}>
        <div className="space-y-3 flex-1">
          <div className={`${baseClass} h-14 w-2/3 lg:w-1/2`} />
          <div className={`${baseClass} h-5 w-1/3`} />
        </div>
        <div className={`${baseClass} h-10 w-48 mb-1`} />
      </div>
    );
  }

  if (variant === 'years') {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className={`${baseClass} h-[42px] w-24`} />
        ))}
      </div>
    );
  }

  if (variant === 'title') {
    return <div className={`${baseClass} h-12 w-3/4 md:w-1/2 ${className}`} />;
  }

  if (variant === 'text') {
    return <div className={`${baseClass} h-4 w-full ${className}`} />;
  }

  if (variant === 'card') {
    return (
      <div className={`p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-6 ${className}`}>
        <div className="flex justify-between items-start">
          <div className="flex gap-4 items-center">
            <div className={`${baseClass} w-12 h-12 rounded-full`} />
            <div className="space-y-2">
              <div className={`${baseClass} h-6 w-48`} />
              <div className={`${baseClass} h-4 w-32`} />
            </div>
          </div>
          <div className={`${baseClass} h-8 w-24`} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className={`${baseClass} h-4 w-24`} />
            <div className="grid grid-cols-4 gap-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className={`${baseClass} h-8 rounded-md`} />
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <div className={`${baseClass} h-4 w-32`} />
            <div className={`${baseClass} h-20 rounded-xl`} />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'user') {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <div className="flex flex-col items-end gap-2">
          <div className={`${baseClass} h-3 w-20`} />
          <div className={`${baseClass} h-2 w-28`} />
        </div>
        <div className={`${baseClass} h-8 w-8 rounded-full`} />
      </div>
    );
  }

  return <div className={`${baseClass} ${className}`} />;
}
