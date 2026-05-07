'use client';

import { Tutor, Assignment, Block } from '@/types';
import { CalendarGrid } from '@/components/ui';
import { CapacityGridCell } from '@/components/features/solver/grids/cells/CapacityGridCell';

interface SpareCapacityGridProps {
  tutors: Tutor[];
  assignments: Assignment[];
}

export function SpareCapacityGrid({ tutors, assignments }: SpareCapacityGridProps) {
  const getSpareCapacityForBlock = (blockId: string) => {
    return tutors.filter(tutor => {
      const isAvailable = tutor.availability.includes(blockId);
      const isAlreadyAssignedInBlock = assignments.some(a => a.tutor_id === tutor.id && a.block_id === blockId);
      const tutorAssignmentsCount = assignments.filter(a => a.tutor_id === tutor.id).length;
      const hasSpareCapacity = tutorAssignmentsCount < tutor.max_sessions;

      return isAvailable && !isAlreadyAssignedInBlock && hasSpareCapacity;
    });
  };

  return (
    <CalendarGrid
      renderBlock={(block: Block) => (
        <CapacityGridCell
          key={block.id}
          block={block}
          spareTutors={getSpareCapacityForBlock(block.id)}
        />
      )}
    />
  );
}
