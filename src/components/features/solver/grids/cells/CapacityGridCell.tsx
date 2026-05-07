'use client';

import type { Tutor, Block } from '@/types';
import { Badge, CalendarBlock, Typography } from '@/components/ui';

interface CapacityGridCellProps {
  block: Block;
  spareTutors: Tutor[];
}

export function CapacityGridCell({ block, spareTutors }: CapacityGridCellProps) {
  const hasSpare = spareTutors.length > 0;

  return (
    <CalendarBlock
      time={block.startTime}
      variant={hasSpare ? 'active' : 'inactive'}
      badge={hasSpare && (
        <Badge color="blue">
          {spareTutors.length} {spareTutors.length === 1 ? 'Libre' : 'Libres'}
        </Badge>
      )}
    >
      {hasSpare ? (
        <div className="space-y-2">
          <Typography as="p" emphasis="high" className="text-xs text-blue-400">
            Tutor disponible
          </Typography>
          <div className="flex flex-wrap gap-1">
            {spareTutors.slice(0, 2).map(t => (
              <span key={t.id} className="text-[10px] font-bold text-zinc-300 bg-zinc-900/80 px-2 py-0.5 rounded border border-zinc-800">
                {t.name.split(' ')[0]}
              </span>
            ))}
            {spareTutors.length > 2 && (
              <span className="text-[10px] text-zinc-600 font-bold self-center">
                +{spareTutors.length - 2}
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="flex justify-center py-2">
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
        </div>
      )
      }
    </CalendarBlock >
  );
}
