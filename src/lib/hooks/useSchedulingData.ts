'use client';

import { useMemo, useCallback } from 'react';
import { Team, Tutor, Assignment } from '@/types';

export function useSchedulingData(teams: Team[], tutors: Tutor[], assignments: Assignment[]) {
  // Mapas para búsqueda O(1) de nombres
  const teamNamesMap = useMemo(() => 
    new Map<string, string>(teams.map((t: Team) => [t.id, t.name])), 
  [teams]);

  const tutorNamesMap = useMemo(() => 
    new Map<string, string>(tutors.map((t: Tutor) => [t.id, t.name])), 
  [tutors]);

  // Agrupación de asignaciones por tutor
  const assignmentsByTutor = useMemo(() => {
    const map = new Map<string, Assignment[]>();
    assignments.forEach(a => {
      const current = map.get(a.tutor_id) || [];
      map.set(a.tutor_id, [...current, a]);
    });
    return map;
  }, [assignments]);

  const getTeamName = useCallback((id: string) => teamNamesMap.get(id) || id, [teamNamesMap]);
  const getTutorName = useCallback((id: string) => tutorNamesMap.get(id) || id, [tutorNamesMap]);

  return {
    maps: {
      teamNames: teamNamesMap,
      tutorNames: tutorNamesMap
    },
    utils: {
      getTeamName,
      getTutorName,
      assignmentsByTutor
    }
  };
}
