'use client';

import { useState, useEffect, useCallback } from 'react';
import { TeamService } from '@/services/team.service';
import { Team } from '@/types';

export function useTeamsData(competitionId: string | undefined) {
  const [state, setState] = useState({
    teams: [] as Team[],
    loading: true
  });

  const loadData = useCallback(async () => {
    if (!competitionId) return;
    setState(prev => ({ ...prev, loading: true }));
    
    const teams = await TeamService.getByCompetition(competitionId);
    setState({ teams, loading: false });
  }, [competitionId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { ...state, refresh: loadData };
}
