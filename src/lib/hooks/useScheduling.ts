import { useCallback } from 'react';
import { Assignment } from '@/types';
import { useCompetition } from '@/lib/context/CompetitionContext';
import { useCompetitionData, useSaveAssignmentsState } from './useQueries';
import { useSolver } from './useSolver';
import { useSchedulingData } from './useSchedulingData';

export function useScheduling() {
  const { activeCompetition } = useCompetition();
  
  // 1. Datos y Mutaciones
  const { teams, tutors, assignments, isLoading: isDataLoading } = useCompetitionData(activeCompetition?.id);
  const saveAssignments = useSaveAssignmentsState();

  // 2. Lógica del Solver (Web Worker)
  const { solverResult, isSolving } = useSolver(teams, tutors, assignments);

  // 3. Utilidades y Formateo
  const { utils } = useSchedulingData(teams, tutors, solverResult?.assignments || []);

  // 4. Acciones (Handlers)
  const toggleFixed = useCallback(async (assignment: Assignment) => {
    if (!activeCompetition || !solverResult) return;

    const isNowFixed = !assignment.is_fixed;
    const updatedAssignments = solverResult.assignments.map(a =>
      a.team_id === assignment.team_id ? { ...a, is_fixed: isNowFixed } : a
    );

    await saveAssignments.mutateAsync({ 
      competitionId: activeCompetition.id, 
      assignments: updatedAssignments 
    });
  }, [activeCompetition, solverResult, saveAssignments]);

  const fixAll = useCallback(async () => {
    if (!solverResult || !activeCompetition) return;
    const allFixed = solverResult.assignments.map(a => ({ ...a, is_fixed: true }));
    await saveAssignments.mutateAsync({ competitionId: activeCompetition.id, assignments: allFixed });
  }, [activeCompetition, solverResult, saveAssignments]);

  const unfixAll = useCallback(async () => {
    if (!solverResult || !activeCompetition) return;
    const allUnfixed = solverResult.assignments.map(a => ({ ...a, is_fixed: false }));
    await saveAssignments.mutateAsync({ competitionId: activeCompetition.id, assignments: allUnfixed });
  }, [activeCompetition, solverResult, saveAssignments]);

  const moveAssignment = useCallback(async (assignment: Assignment, newBlockId: string) => {
    if (!activeCompetition || !solverResult) return;

    const updatedAssignments = solverResult.assignments.map(a =>
      a.team_id === assignment.team_id ? { ...a, block_id: newBlockId, is_fixed: true } : a
    );

    await saveAssignments.mutateAsync({
      competitionId: activeCompetition.id,
      assignments: updatedAssignments
    });
  }, [activeCompetition, solverResult, saveAssignments]);

  const swapAssignments = useCallback(async (source: Assignment, target: Assignment) => {
    if (!activeCompetition || !solverResult) return;

    // Intercambiar ÚNICAMENTE tutor_id, manteniendo los bloques originales intactos
    const updatedAssignments = solverResult.assignments.map(a => {
      if (a.team_id === source.team_id) {
        return { ...a, tutor_id: target.tutor_id, is_fixed: true };
      }
      if (a.team_id === target.team_id) {
        return { ...a, tutor_id: source.tutor_id, is_fixed: true };
      }
      return a;
    });

    await saveAssignments.mutateAsync({
      competitionId: activeCompetition.id,
      assignments: updatedAssignments
    });
  }, [activeCompetition, solverResult, saveAssignments]);

  return {
    activeCompetition,
    data: {
      teams,
      tutors,
      solverResult,
      assignmentsByTutor: utils.assignmentsByTutor
    },
    status: {
      isLoading: isDataLoading,
      isSolving,
      isSaving: saveAssignments.isPending
    },
    actions: {
      toggleFixed,
      fixAll,
      unfixAll,
      moveAssignment,
      swapAssignments
    },
    utils: {
      getTeamName: utils.getTeamName,
      getTutorName: utils.getTutorName
    }
  };
}
