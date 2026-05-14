'use client';

import { Tutor, Team, Assignment, Block } from '@/types';
import { Calendar, CalendarBlock, Typography } from '@/components/ui';
import { SchedulingRules } from '@/lib/solver';

interface SpareCapacityGridProps {
  tutors: Tutor[];
  teams: Team[];
  assignments: Assignment[];
}

export function SpareCapacityGrid({ tutors, teams, assignments }: SpareCapacityGridProps) {
  const getSpareCapacityForBlock = (blockId: string) => {
    if (SchedulingRules.isBlockAtFullCapacity(blockId, assignments)) return [];

    const unassignedTeamsInBlock = teams.filter(team => {
      const needsBlock = team.availability.includes(blockId);
      const isAlreadyAssigned = assignments.some(a => a.team_id === team.id);
      return needsBlock && !isAlreadyAssigned;
    });

    if (unassignedTeamsInBlock.length === 0) return [];

    return tutors.filter(tutor => {
      const isAvailable = tutor.availability.includes(blockId);
      const isAlreadyAssignedInBlock = assignments.some(a => a.tutor_id === tutor.id && a.block_id === blockId);
      const tutorAssignmentsCount = assignments.filter(a => a.tutor_id === tutor.id).length;
      const hasSpareCapacity = tutorAssignmentsCount < tutor.max_sessions;

      return isAvailable && !isAlreadyAssignedInBlock && hasSpareCapacity;
    });
  };

  return (
    <Calendar
      renderBlock={(block: Block) => {
        const spareTutors = getSpareCapacityForBlock(block.id);
        const percentage = Math.min(100, (spareTutors.length / 4) * 100);
        const isFull = spareTutors.length >= 4;

        return (
          <CalendarBlock
            key={block.id}
            time={block.startTime}
            variant={spareTutors.length > 0 ? 'default' : 'inactive'}
            minHeight="100px"
          >
            <div className="space-y-3 h-full flex flex-col">
              <div className="space-y-1">
                <div className="flex justify-between items-center px-0.5">
                   <Typography as="p" emphasis="medium" className="text-[9px]">Capacidad</Typography>
                   <span className={`text-[9px] font-bold ${isFull ? 'text-green-400' : 'text-blue-400'}`}>
                      {spareTutors.length}/4
                   </span>
                </div>
                <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                   <div 
                     className={`h-full transition-all duration-500 ${isFull ? 'bg-green-500' : 'bg-blue-500'}`}
                     style={{ width: `${percentage}%` }}
                   />
                </div>
              </div>

              <div className="flex-1 flex flex-wrap gap-1 content-start overflow-y-auto pr-1 scrollbar-hide">
                {spareTutors.map(tutor => (
                  <div
                    key={tutor.id}
                    className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-[8px] text-zinc-400"
                  >
                    {tutor.name.split(' ')[0]}
                  </div>
                ))}
                {spareTutors.length === 0 && (
                  <span className="text-[8px] text-zinc-900 italic">Sin disponibilidad</span>
                )}
              </div>
            </div>
          </CalendarBlock>
        );
      }}
    />
  );
}
