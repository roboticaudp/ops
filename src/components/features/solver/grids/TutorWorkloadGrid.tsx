'use client';

import type { Assignment, Block } from '@/types';
import { CalendarGrid } from '@/components/ui';
import { WorkloadGridCell } from '@/components/features/solver/grids/cells/WorkloadGridCell';

interface TutorWorkloadGridProps {
  assignments: Assignment[];
  getTeamName: (id: string) => string;
}

export function TutorWorkloadGrid({ assignments, getTeamName }: TutorWorkloadGridProps) {
  return (
    <CalendarGrid
      renderBlock={(block: Block) => (
        <WorkloadGridCell
          key={block.id}
          block={block}
          assignment={assignments.find(a => a.block_id === block.id)}
          getTeamName={getTeamName}
        />
      )}
    />
  );
}
