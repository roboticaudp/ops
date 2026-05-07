'use client';

import type { Assignment, Block } from '@/types';
import { Badge, CalendarBlock } from '@/components/ui';
import { AssignmentItem } from '@/components/features/scheduling/AssignmentItem';

interface AssignmentGridCellProps {
  block: Block;
  assignments: Assignment[];
  getTeamName: (id: string) => string;
  getTutorName: (id: string) => string;
  onToggleFixed?: (assignment: Assignment) => void;
}

export function AssignmentGridCell({
  block,
  assignments,
  getTeamName,
  getTutorName,
  onToggleFixed
}: AssignmentGridCellProps) {
  const isFull = assignments.length >= 4;
  const hasAssignments = assignments.length > 0;

  return (
    <CalendarBlock
      time={block.startTime}
      variant={hasAssignments ? 'active' : 'inactive'}
      badge={<Badge color={isFull ? 'green' : 'blue'}>{assignments.length}/4</Badge>}
    >
      <div className="space-y-0.5">
        {assignments.map((a, i) => (
          <AssignmentItem
            key={i}
            teamName={getTeamName(a.team_id)}
            tutorName={getTutorName(a.tutor_id)}
            isFixed={a.is_fixed}
            onToggle={() => onToggleFixed?.(a)}
          />
        ))}
        {!hasAssignments && (
          <div className="py-4 text-center border border-dashed border-zinc-800/50 rounded-lg">
            <p className="text-xs font-bold text-zinc-700">Libre</p>
          </div>
        )}
      </div>
    </CalendarBlock>
  );
}
