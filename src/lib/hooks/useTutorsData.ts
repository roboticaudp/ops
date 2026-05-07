'use client';

import { useState, useEffect, useCallback } from 'react';
import { TutorService } from '@/services/tutor.service';
import { CompetitionService } from '@/services/competition.service';
import { Tutor, Assignment } from '@/types';

export function useTutorsData(competitionId: string | undefined) {
  const [state, setState] = useState({
    tutors: [] as Tutor[],
    assignments: [] as Assignment[],
    loading: true
  });

  const loadData = useCallback(async () => {
    if (!competitionId) return;
    setState(prev => ({ ...prev, loading: true }));
    
    const [tutors, assignments] = await Promise.all([
      TutorService.getByCompetition(competitionId),
      CompetitionService.getAssignmentsState(competitionId)
    ]);

    setState({ tutors, assignments, loading: false });
  }, [competitionId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { ...state, refresh: loadData };
}
