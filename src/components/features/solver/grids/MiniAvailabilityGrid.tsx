'use client';

import { TIME_BLOCKS, Day } from '@/types';
import { BlockStatus } from '@/lib/diagnostics';

interface AvailabilityGridProps {
  selectedBlocks: string[];
  blockStatuses?: BlockStatus[];
}

const DAYS: Day[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const DAY_ABBR: Record<Day, string> = {
  Lunes: 'L', Martes: 'M', Miércoles: 'X', Jueves: 'J', Viernes: 'V', Sábado: 'S'
};

export function MiniAvailabilityGrid({ selectedBlocks, blockStatuses }: AvailabilityGridProps) {
  const getBlockColor = (blockId: string): string => {
    if (!selectedBlocks.includes(blockId)) return 'bg-zinc-900';

    if (blockStatuses) {
      const status = blockStatuses.find(s => s.blockId === blockId);
      if (!status) return 'bg-zinc-700';
      if (status.isPhysicallyFull) return 'bg-red-500/80';
      if (status.hasAvailableTutor) return 'bg-green-500/80';
      return 'bg-amber-500/80';
    }

    return 'bg-blue-500';
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-6 gap-1 w-full">
        {DAYS.map((day) => (
          <div key={day} className="flex flex-col gap-0.5 items-center">
            <span className="text-[9px] font-bold text-zinc-600 mb-0.5">{DAY_ABBR[day]}</span>
            {TIME_BLOCKS.filter((b) => b.day === day).map((block) => (
              <div
                key={block.id}
                title={`${block.day} ${block.startTime}`}
                className={`h-2 w-full rounded-[2px] transition-colors ${getBlockColor(block.id)}`}
              />
            ))}
          </div>
        ))}
      </div>

      {blockStatuses && (
        <div className="flex items-center gap-3 pt-1">
          <span className="flex items-center gap-1 text-[10px] text-zinc-500">
            <span className="w-2 h-2 rounded-[2px] bg-green-500/80 inline-block" />
            Disponible
          </span>
          <span className="flex items-center gap-1 text-[10px] text-zinc-500">
            <span className="w-2 h-2 rounded-[2px] bg-amber-500/80 inline-block" />
            Sin cupo
          </span>
          <span className="flex items-center gap-1 text-[10px] text-zinc-500">
            <span className="w-2 h-2 rounded-[2px] bg-red-500/80 inline-block" />
            Lleno (4/4)
          </span>
        </div>
      )}
    </div>
  );
}

