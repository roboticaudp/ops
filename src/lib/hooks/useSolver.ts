'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Team, Tutor, Assignment } from '@/types';
import { SolverResult } from '@/lib';

export function useSolver(teams: Team[], tutors: Tutor[], assignments: Assignment[]) {
  const [solverResult, setSolverResult] = useState<SolverResult | null>(null);
  const [isSolving, setIsSolving] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  const startSolverWorker = useCallback(() => {
    if (!teams.length || !tutors.length) return;

    setIsSolving(true);
    workerRef.current?.terminate();
    
    // Crear el worker de forma dinámica
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
    const hasData = teams.length > 0 && tutors.length > 0;
    if (hasData) {
      queueMicrotask(() => startSolverWorker());
    }
    return () => workerRef.current?.terminate();
  }, [startSolverWorker, teams.length, tutors.length]);

  return {
    solverResult,
    isSolving,
    reSolve: startSolverWorker
  };
}
