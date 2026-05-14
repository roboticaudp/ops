'use client';

import type { Assignment, Block } from '@/types';
import { Calendar, CalendarBlock } from '@/components/ui';

interface TutorWorkloadGridProps {
  assignments: Assignment[];
  getTeamName: (id: string) => string;
}

export function TutorWorkloadGrid({ assignments, getTeamName }: TutorWorkloadGridProps) {
  return (
    <Calendar
      renderBlock={(block: Block) => {
        const assignment = assignments.find(a => a.block_id === block.id);
        
        return (
          <CalendarBlock
            key={block.id}
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
      }}
    />
  );
}
