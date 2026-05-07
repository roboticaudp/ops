'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Competition } from '@/types';
import { CompetitionService } from '@/services/competition.service';

interface CompetitionState {
  activeCompetition: Competition | null;
  competitions: Competition[];
  loading: boolean;
}

interface CompetitionActions {
  selectCompetition: (id: string) => void;
  refreshCompetitions: () => Promise<void>;
}

const CompetitionStateContext = createContext<CompetitionState | undefined>(undefined);
const CompetitionActionsContext = createContext<CompetitionActions | undefined>(undefined);

export function CompetitionProvider({ children }: { children: React.ReactNode }) {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [activeCompetition, setActiveCompetition] = useState<Competition | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const all = await CompetitionService.getAll();
      setCompetitions(all);
      
      setActiveCompetition(prev => {
        if (!prev) return all.find(c => c.status === 'active') || all.find(c => c.was_held) || null;
        return all.find(c => c.id === prev.id) || null;
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const selectCompetition = useCallback((id: string) => {
    setActiveCompetition(prev => {
      const comp = competitions.find(c => c.id === id);
      return comp || prev;
    });
  }, [competitions]);

  const stateValue = useMemo(() => ({
    activeCompetition,
    competitions,
    loading
  }), [activeCompetition, competitions, loading]);

  const actionsValue = useMemo(() => ({
    selectCompetition,
    refreshCompetitions: loadData
  }), [selectCompetition, loadData]);

  return (
    <CompetitionStateContext.Provider value={stateValue}>
      <CompetitionActionsContext.Provider value={actionsValue}>
        {children}
      </CompetitionActionsContext.Provider>
    </CompetitionStateContext.Provider>
  );
}

export function useCompetition() {
  const state = useContext(CompetitionStateContext);
  const actions = useContext(CompetitionActionsContext);
  
  if (state === undefined || actions === undefined) {
    throw new Error('useCompetition must be used within a CompetitionProvider');
  }
  
  return { ...state, ...actions };
}
