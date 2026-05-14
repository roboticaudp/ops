'use client';

import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { Team, Tutor, Assignment } from '@/types';
import { SolverResult } from '@/lib';
import { useCompetition } from '@/lib/context/CompetitionContext';
import { useCompetitionData, useSaveAssignmentsState } from './useQueries';

export function useScheduling() {
  const { activeCompetition } = useCompetition();
  
  // 1. Datos de Red
  const { teams, tutors, assignments, isLoading: isDataLoading } = useCompetitionData(activeCompetition?.id);
  const saveAssignments = useSaveAssignmentsState();

  // 2. Estado del Solver
  const [solverResult, setSolverResult] = useState<SolverResult | null>(null);
  const [isSolving, setIsSolving] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  // 3. Lógica del Worker
  const startSolverWorker = useCallback(() => {
    if (!teams.length || !tutors.length) return;

    setIsSolving(true);
    workerRef.current?.terminate();
    const worker = new Worker(new URL('../../workers/solver.worker.ts', import.meta.url));
    workerRef.current = worker;

    worker.onmessage = (e: MessageEvent<SolverResult>) => {
      setSolverResult(e.data);
      setIsSolving(false);
    };

    const fixed = assignments.filter(a => !!a.is_fixed);
    worker.postMessage({ teams, tutors, fixedAssignments: fixed });
  }, [teams, tutors, assignments]);

  useEffect(() => {
    startSolverWorker();
    return () => workerRef.current?.terminate();
  }, [startSolverWorker]);

  // 4. Acciones (Handlers)
  const toggleFixed = async (assignment: Assignment) => {
    if (!activeCompetition || !solverResult) return;

    const isNowFixed = !assignment.is_fixed;
    const updatedAssignments = solverResult.assignments.map(a =>
      a.team_id === assignment.team_id ? { ...a, is_fixed: isNowFixed } : a
    );

    await saveAssignments.mutateAsync({ 
      competitionId: activeCompetition.id, 
      assignments: updatedAssignments 
    });
  };

  const fixAll = async () => {
    if (!solverResult || !activeCompetition) return;
    const allFixed = solverResult.assignments.map(a => ({ ...a, is_fixed: true }));
    await saveAssignments.mutateAsync({ competitionId: activeCompetition.id, assignments: allFixed });
  };

  const unfixAll = async () => {
    if (!solverResult || !activeCompetition) return;
    const allUnfixed = solverResult.assignments.map(a => ({ ...a, is_fixed: false }));
    await saveAssignments.mutateAsync({ competitionId: activeCompetition.id, assignments: allUnfixed });
  };

  // 5. Utilidades y Formateo
  const teamNamesMap = useMemo(() => new Map<string, string>(teams.map((t: Team) => [t.id, t.name])), [teams]);
  const tutorNamesMap = useMemo(() => new Map<string, string>(tutors.map((t: Tutor) => [t.id, t.name])), [tutors]);

  const assignmentsByTutor = useMemo(() => {
    const map = new Map<string, Assignment[]>();
    solverResult?.assignments.forEach(a => {
      const current = map.get(a.tutor_id) || [];
      map.set(a.tutor_id, [...current, a]);
    });
    return map;
  }, [solverResult?.assignments]);

  const getTeamName = useCallback((id: string) => teamNamesMap.get(id) || id, [teamNamesMap]);
  const getTutorName = useCallback((id: string) => tutorNamesMap.get(id) || id, [tutorNamesMap]);

  return {
    activeCompetition,
    data: {
      teams,
      tutors,
      solverResult,
      assignmentsByTutor
    },
    status: {
      isLoading: isDataLoading,
      isSolving,
      isSaving: saveAssignments.isPending
    },
    actions: {
      toggleFixed,
      fixAll,
      unfixAll
    },
    utils: {
      getTeamName,
      getTutorName
    }
  };
}
