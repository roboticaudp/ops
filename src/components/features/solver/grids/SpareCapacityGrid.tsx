'use client';

import { Tutor, Team, Assignment, Block } from '@/types';
import { Calendar } from '@/components/ui';
import { CapacityGridCell } from '@/components/features/solver/grids/cells/CapacityGridCell';
import { SchedulingRules } from '@/lib/solver';

interface SpareCapacityGridProps {
  tutors: Tutor[];
  teams: Team[];
  assignments: Assignment[];
}

export function SpareCapacityGrid({ tutors, teams, assignments }: SpareCapacityGridProps) {
  const getSpareCapacityForBlock = (blockId: string) => {
    // 1. Verificar si el bloque ya alcanzó su capacidad máxima
    if (SchedulingRules.isBlockAtFullCapacity(blockId, assignments)) return [];

    // 2. Verificar si hay equipos sin asignar que necesiten este bloque
    const unassignedTeamsInBlock = teams.filter(team => {
      const needsBlock = team.availability.includes(blockId);
      const isAlreadyAssigned = assignments.some(a => a.team_id === team.id);
      return needsBlock && !isAlreadyAssigned;
    });

    // Si no hay equipos sin asignar para este bloque, no hay capacidad útil
    if (unassignedTeamsInBlock.length === 0) return [];

    // 3. Filtrar tutores con capacidad real disponible
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

