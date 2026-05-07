'use client';

import type { Block } from '@/types';
import { CalendarBlock } from '@/components/ui';

interface SelectionGridCellProps {
  block: Block;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

export function SelectionGridCell({ block, isSelected, onToggle }: SelectionGridCellProps) {
  return (
    <CalendarBlock
      time={block.startTime}
      variant={isSelected ? 'active' : 'default'}
      onClick={() => onToggle(block.id)}
      minHeight="60px"
      badge={isSelected && <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
    >
      <span className={`text-[8px] font-mono leading-none ${isSelected ? 'text-blue-400 font-bold' : 'text-zinc-500'}`}>
        {block.endTime}
      </span>
    </CalendarBlock>
  );
}
