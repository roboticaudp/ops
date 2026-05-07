'use client';

import { TIME_BLOCKS, Day } from '@/types';
import { BlockStatus } from '@/lib/diagnostics';
import { Legend, LegendItem } from '@/components/ui';

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
        <Legend className="pt-1">
          <LegendItem color="bg-green-500/80">Disponible</LegendItem>
          <LegendItem color="bg-amber-500/80">Sin cupo</LegendItem>
          <LegendItem color="bg-red-500/80">Lleno (4/4)</LegendItem>
        </Legend>
      )}
    </div>
  );
}

