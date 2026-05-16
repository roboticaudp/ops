'use client';

import { Lock, Unlock, GripVertical } from 'lucide-react';

interface AssignmentItemProps {
  teamName: string;
  tutorName: string;
  isFixed?: boolean;
  onToggle?: () => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}

export function AssignmentItem({
  teamName,
  tutorName,
  isFixed,
  onToggle,
  draggable,
  onDragStart,
  onDragEnd
}: AssignmentItemProps) {
  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onToggle}
      className={`cursor-grab active:cursor-grabbing flex items-center justify-between p-1.5 rounded-md transition-all group ${
        isFixed ? 'bg-blue-600/10 border border-blue-500/20' : 'hover:bg-zinc-800/40 border border-transparent'
      }`}
    >
      <div className="flex items-center gap-1.5 min-w-0 flex-1 px-1 py-0.5">
        <div className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-zinc-500 hover:text-zinc-300">
          <GripVertical size={13} />
        </div>
        <div className="min-w-0 flex-1">
          <span
            className={`text-xs font-bold block truncate ${isFixed ? 'text-blue-400' : 'text-zinc-200'}`}
            title={teamName}
          >
            {teamName}
          </span>
          <p
            className="text-[10px] font-semibold text-zinc-500 truncate"
            title={tutorName}
          >
            {tutorName}
          </p>
        </div>
      </div>

      <div className="flex-shrink-0 ml-2">
        {isFixed ? (
          <Lock size={12} className="text-blue-500/80" />
        ) : (
          <Unlock size={12} className="text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>
    </div>
  );
}

