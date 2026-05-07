'use client';

import { Lock, Unlock } from 'lucide-react';

interface AssignmentItemProps {
  teamName: string;
  tutorName: string;
  isFixed?: boolean;
  onToggle?: () => void;
}

export function AssignmentItem({ teamName, tutorName, isFixed, onToggle }: AssignmentItemProps) {
  return (
    <div
      onClick={onToggle}
      className={`cursor-pointer flex items-center justify-between p-1.5 rounded-md transition-all group ${isFixed ? 'bg-blue-600/5' : 'hover:bg-zinc-800/40'
        }`}
    >
      <div className="min-w-0 flex-1 px-2 py-1">
        <span
          className={`text-xs font-bold block truncate mb-1 ${isFixed ? 'text-blue-400' : 'text-zinc-200'}`}
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

      <div className="flex-shrink-0 ml-2">
        {isFixed ? (
          <Lock size={12} className="text-blue-500/60" />
        ) : (
          <Unlock size={12} className="text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>
    </div>
  );
}
