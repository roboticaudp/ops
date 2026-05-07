'use client';

import React from 'react';
import { TIME_BLOCKS, Day, Block } from '@/types';

const DAYS: Day[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

interface CalendarGridProps {
  renderBlock: (block: Block) => React.ReactNode;
}

export function CalendarGrid({ renderBlock }: CalendarGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
      {DAYS.map(day => (
        <div key={day} className="space-y-4">
          <div className="text-center pb-2 border-b border-zinc-800">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{day}</span>
          </div>
          <div className="space-y-2">
            {TIME_BLOCKS.filter((b: Block) => b.day === day).map((block: Block) => (
              <React.Fragment key={block.id}>
                {renderBlock(block)}
              </React.Fragment>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
