'use client';

import type { Assignment, Block } from '@/types';
import { CalendarBlock } from '@/components/ui';

interface WorkloadGridCellProps {
  block: Block;
  assignment?: Assignment;
  getTeamName: (id: string) => string;
}

export function WorkloadGridCell({ block, assignment, getTeamName }: WorkloadGridCellProps) {
  return (
    <CalendarBlock
      time={block.startTime}
      variant={assignment ? 'active' : 'inactive'}
      minHeight="50px"
    >
      {assignment ? (
        <p className="text-[9px] font-bold text-blue-300 leading-tight line-clamp-2">
          {getTeamName(assignment.team_id)}
        </p>
      ) : (
        <span className="text-[8px] text-zinc-800 font-mono italic">---</span>
      )}
    </CalendarBlock>
  );
}
