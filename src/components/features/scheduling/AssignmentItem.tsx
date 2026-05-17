'use client';

import { Lock, Unlock, GripVertical, ArrowLeftRight } from 'lucide-react';

interface AssignmentItemProps {
  teamName: string;
  tutorName: string;
  isFixed?: boolean;
  onToggle?: () => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  isOverTarget?: boolean;
}

export function AssignmentItem({
  teamName,
  tutorName,
  isFixed,
  onToggle,
  draggable,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  isOverTarget
}: AssignmentItemProps) {
  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onToggle}
      className={`animate-pop-in cursor-grab active:cursor-grabbing flex items-center justify-between p-1.5 rounded-md transition-all duration-200 group border ${
        isOverTarget
          ? 'bg-amber-500/15 border-amber-500/50'
          : isFixed
          ? 'bg-blue-600/10 border-blue-500/20'
          : 'hover:bg-zinc-800/40 border-transparent'
      }`}
    >
      <div className="flex items-center gap-1.5 min-w-0 flex-1 px-1 py-0.5">
        <div className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-zinc-500 hover:text-zinc-300">
          <GripVertical size={13} />
        </div>
        <div className="min-w-0 flex-1">
          <span
            className={`text-xs block truncate transition-colors duration-200 ${
              isOverTarget ? 'text-amber-400 font-bold' : isFixed ? 'text-blue-400 font-bold' : 'text-zinc-200 font-bold'
            }`}
            title={teamName}
          >
            {teamName}
          </span>
          <p
            key={tutorName}
            className={`animate-slide-fade text-[10px] truncate transition-colors duration-200 ${
              isOverTarget ? 'text-amber-500/90 font-semibold' : 'text-zinc-500 font-semibold'
            }`}
            title={tutorName}
          >
            {tutorName}
          </p>
        </div>
      </div>

      <div className="flex-shrink-0 ml-2">
        {isOverTarget ? (
          <ArrowLeftRight size={12} className="text-amber-500 animate-pulse" />
        ) : isFixed ? (
          <Lock size={12} className="text-blue-500/80" />
        ) : (
          <Unlock size={12} className="text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>
    </div>
  );
}

