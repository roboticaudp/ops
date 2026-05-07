import { Team, Tutor, Assignment } from '@/types';
import { SchedulingRules } from '@/lib/solver';

export type DiagnosticType = 'NO_TUTOR' | 'CAPACITY_LIMIT' | 'PHYSICAL_LIMIT' | 'COMPLEX_CONFLICT';

export interface BlockStatus {
  blockId: string;
  day: string;
  isPhysicallyFull: boolean;   // bloque con 4/4 equipos
  hasAvailableTutor: boolean;  // al menos 1 tutor disponible con cupo
}

export interface CapacityHint {
  tutorName: string;
  tutorId: string;
  availableBlocks: string[];   // bloques del equipo donde este tutor puede atender
}

export interface DiagnosticResult {
  type: DiagnosticType;
  /** @deprecated use capacityHints instead */
  tutors: string[];
  blockStatuses: BlockStatus[];
  capacityHints: CapacityHint[];
  openBlocks: number;   // bloques del equipo con espacio real
  fullBlocks: number;   // bloques del equipo físicamente llenos
}

export function analyzeFailureReason(
  team: Team,
  tutors: Tutor[],
  assignments: Assignment[]
): DiagnosticResult {
  const blockStatuses: BlockStatus[] = [];
  const tutorsWithReachedCapacity: string[] = [];
  const capacityHints: CapacityHint[] = [];
  let allBlocksPhysicallyFull = true;
  let anyTutorMarkedAnyBlock = false;

  team.availability.forEach(blockId => {
    const [day] = blockId.split('-');
    const isPhysicallyFull = SchedulingRules.isBlockAtFullCapacity(blockId, assignments);
    if (!isPhysicallyFull) allBlocksPhysicallyFull = false;

    const tutorsInThisBlock = tutors.filter(t => t.availability.includes(blockId));
    if (tutorsInThisBlock.length > 0) anyTutorMarkedAnyBlock = true;

    // ¿Hay algún tutor con cupo real en este bloque?
    const hasAvailableTutor = tutorsInThisBlock.some(t => {
      const isBusy = assignments.some(a => a.block_id === blockId && a.tutor_id === t.id);
      const weeklyUsage = assignments.filter(a => a.tutor_id === t.id).length;
      return !isBusy && weeklyUsage < t.max_sessions && !isPhysicallyFull;
    });

    blockStatuses.push({ blockId, day, isPhysicallyFull, hasAvailableTutor });

    // Tutores que podrían desbloquearse si aumentan su cupo
    tutorsInThisBlock.forEach(t => {
      const weeklyUsage = assignments.filter(a => a.tutor_id === t.id).length;
      const isBusyInBlock = assignments.some(a => a.block_id === blockId && a.tutor_id === t.id);
      if (weeklyUsage >= t.max_sessions && !isBusyInBlock && !isPhysicallyFull) {
        if (!tutorsWithReachedCapacity.includes(t.name)) {
          tutorsWithReachedCapacity.push(t.name);
        }
        // Agregar o enriquecer el hint de este tutor
        const existing = capacityHints.find(h => h.tutorId === t.id);
        if (existing) {
          existing.availableBlocks.push(blockId);
        } else {
          capacityHints.push({
            tutorName: t.name,
            tutorId: t.id,
            availableBlocks: [blockId],
          });
        }
      }
    });
  });

  const openBlocks = blockStatuses.filter(b => !b.isPhysicallyFull && b.hasAvailableTutor).length;
  const fullBlocks = blockStatuses.filter(b => b.isPhysicallyFull).length;

  if (!anyTutorMarkedAnyBlock) return { type: 'NO_TUTOR', tutors: [], blockStatuses, capacityHints, openBlocks, fullBlocks };
  if (allBlocksPhysicallyFull) return { type: 'PHYSICAL_LIMIT', tutors: [], blockStatuses, capacityHints, openBlocks, fullBlocks };
  if (tutorsWithReachedCapacity.length > 0) return { type: 'CAPACITY_LIMIT', tutors: tutorsWithReachedCapacity, blockStatuses, capacityHints, openBlocks, fullBlocks };

  return { type: 'COMPLEX_CONFLICT', tutors: [], blockStatuses, capacityHints, openBlocks, fullBlocks };
}

