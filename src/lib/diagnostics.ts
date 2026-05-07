import { Team, Tutor, Assignment } from '@/types';

export type DiagnosticType = 'NO_TUTOR' | 'CAPACITY_LIMIT' | 'PHYSICAL_LIMIT' | 'COMPLEX_CONFLICT';

export interface DiagnosticResult {
  type: DiagnosticType;
  tutors: string[];
}

export function analyzeFailureReason(
  team: Team,
  tutors: Tutor[],
  assignments: Assignment[]
): DiagnosticResult {
  const tutorsWithReachedCapacity: string[] = [];
  let allBlocksPhysicallyFull = true;
  let anyTutorMarkedAnyBlock = false;

  team.availability.forEach(blockId => {
    const tutorsAvailableInThisBlock = tutors.filter(t => t.availability.includes(blockId));
    if (tutorsAvailableInThisBlock.length > 0) anyTutorMarkedAnyBlock = true;

    const teamsInBlockCount = assignments.filter(a => a.block_id === blockId).length || 0;
    if (teamsInBlockCount < 4) allBlocksPhysicallyFull = false;

    tutorsAvailableInThisBlock.forEach(t => {
      const weeklyUsage = assignments.filter(a => a.tutor_id === t.id).length || 0;
      const isTutorAlreadyBusyInThisSpecificBlock = assignments.some(a => a.block_id === blockId && a.tutor_id === t.id);
      if (weeklyUsage >= t.max_sessions && !isTutorAlreadyBusyInThisSpecificBlock) {
        if (!tutorsWithReachedCapacity.includes(t.name)) tutorsWithReachedCapacity.push(t.name);
      }
    });
  });

  if (!anyTutorMarkedAnyBlock) return { type: 'NO_TUTOR', tutors: [] };
  if (allBlocksPhysicallyFull) return { type: 'PHYSICAL_LIMIT', tutors: [] };
  if (tutorsWithReachedCapacity.length > 0) return { type: 'CAPACITY_LIMIT', tutors: tutorsWithReachedCapacity };
  
  return { type: 'COMPLEX_CONFLICT', tutors: [] };
}
