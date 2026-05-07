'use client';

import type { Assignment, Block } from '@/types';
import { CalendarGrid } from '@/components/ui';
import { AssignmentGridCell } from '@/components/features/solver/grids/cells/AssignmentGridCell';

interface MainAssignmentGridProps {
  assignments: Assignment[];
  getTeamName: (id: string) => string;
  getTutorName: (id: string) => string;
  onToggleFixed: (assignment: Assignment) => void;
}

export function MainAssignmentGrid({
  assignments,
  getTeamName,
  getTutorName,
  onToggleFixed
}: MainAssignmentGridProps) {
  return (
    <CalendarGrid
      renderBlock={(block: Block) => (
        <AssignmentGridCell
          key={block.id}
          block={block}
          assignments={assignments.filter(a => a.block_id === block.id)}
          getTeamName={getTeamName}
          getTutorName={getTutorName}
          onToggleFixed={onToggleFixed}
        />
      )}
    />
  );
}
