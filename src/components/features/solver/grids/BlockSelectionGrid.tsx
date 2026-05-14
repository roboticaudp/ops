'use client';

import type { Block } from '@/types';
import { Calendar, CalendarBlock } from '@/components/ui';

interface BlockSelectionGridProps {
  selected: string[];
  onChange: (ids: string[]) => void;
}

export function BlockSelectionGrid({ selected, onChange }: BlockSelectionGridProps) {
  const toggleBlock = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter(b => b !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <Calendar
      renderBlock={(block: Block) => {
        const isSelected = selected.includes(block.id);
        
        return (
          <CalendarBlock
            key={block.id}
            time={block.startTime}
            variant={isSelected ? 'active' : 'default'}
            onClick={() => toggleBlock(block.id)}
            minHeight="60px"
            badge={isSelected && <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
          >
            <span className={`text-[8px] font-mono leading-none ${isSelected ? 'text-blue-400 font-bold' : 'text-zinc-500'}`}>
              {block.endTime}
            </span>
          </CalendarBlock>
        );
      }}
    />
  );
}
