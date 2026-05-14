'use client';

import type { Assignment, Block } from '@/types';
import { Calendar, Badge, CalendarBlock } from '@/components/ui';
import { AssignmentItem } from '@/components/features/scheduling/AssignmentItem';

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
    <Calendar
      renderBlock={(block: Block) => {
        const blockAssignments = assignments.filter(a => a.block_id === block.id);
        const isFull = blockAssignments.length >= 4;
        const hasAssignments = blockAssignments.length > 0;

        return (
          <CalendarBlock
            key={block.id}
            time={block.startTime}
            variant={hasAssignments ? 'active' : 'inactive'}
            badge={<Badge color={isFull ? 'green' : 'blue'}>{blockAssignments.length}/4</Badge>}
          >
            <div className="space-y-0.5">
              {blockAssignments.map((a, i) => (
                <AssignmentItem
                  key={i}
                  teamName={getTeamName(a.team_id)}
                  tutorName={getTutorName(a.tutor_id)}
                  isFixed={a.is_fixed}
                  onToggle={() => onToggleFixed(a)}
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
      }}
    />
  );
}
