'use client';

import { TIME_BLOCKS, Day } from '@/types';

interface AvailabilityGridProps {
  selectedBlocks: string[];
}

export function MiniAvailabilityGrid({ selectedBlocks }: AvailabilityGridProps) {
  const DAYS: Day[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  return (
    <div className="grid grid-cols-6 gap-1 w-full max-w-sm">
      {DAYS.map((day) => (
        <div key={day} className="flex flex-col gap-0.5">
          {TIME_BLOCKS.filter((b) => b.day === day).map((block) => (
            <div
              key={block.id}
              className={`h-2 rounded-[1px] ${selectedBlocks.includes(block.id) ? 'bg-blue-500' : 'bg-zinc-800'
                }`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
