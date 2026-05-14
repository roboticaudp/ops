'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DropMenuProps {
  children: React.ReactNode;
  className?: string;
  position?: 'up' | 'down';
}

export function DropMenu({ children, className = "", position = 'down' }: DropMenuProps) {
  const positionClasses = {
    down: "top-full pt-2",
    up: "bottom-full pb-2"
  };

  return (
    <div className={cn(
      "absolute right-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50",
      positionClasses[position],
      className
    )}>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-1.5 min-w-[180px] backdrop-blur-xl">
        {children}
      </div>
    </div>
  );
}

interface DropMenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: LucideIcon;
  variant?: 'default' | 'danger';
  className?: string;
}

export function DropMenuItem({ 
  children, 
  onClick, 
  icon: Icon, 
  variant = 'default', 
  className = "" 
}: DropMenuItemProps) {
  const variants = {
    default: "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50",
    danger: "text-red-400/80 hover:text-red-400 hover:bg-red-400/10"
  };

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${variants[variant]} ${className}`}
    >
      {Icon && <Icon size={14} className="flex-shrink-0" />}
      <span className="truncate">{children}</span>
    </button>
  );
}

export function DropMenuSeparator() {
  return <div className="h-px bg-zinc-800 my-1 mx-1.5" />;
}
