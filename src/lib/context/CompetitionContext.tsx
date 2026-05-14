'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Competition } from '@/types';
import { useCompetitions } from '../hooks/useQueries';

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
  const { data: competitions = [], isLoading, refetch } = useCompetitions();
  const [activeCompetition, setActiveCompetition] = useState<Competition | null>(null);

  // Sincronizar la competencia activa cuando se cargan los datos
  useEffect(() => {
    if (competitions.length > 0 && !activeCompetition) {
      const active = competitions.find(c => c.status === 'active') || competitions.find(c => c.was_held) || competitions[0];
      if (active) {
        // Usamos una microtarea para evitar el aviso de renderizado en cascada síncrono
        queueMicrotask(() => setActiveCompetition(active));
      }
    }
  }, [competitions, activeCompetition]);

  const selectCompetition = useCallback((id: string) => {
    const comp = competitions.find(c => c.id === id);
    if (comp) setActiveCompetition(comp);
  }, [competitions]);

  const stateValue = useMemo(() => ({
    activeCompetition,
    competitions,
    loading: isLoading
  }), [activeCompetition, competitions, isLoading]);

  const actionsValue = useMemo(() => ({
    selectCompetition,
    refreshCompetitions: async () => { await refetch(); }
  }), [selectCompetition, refetch]);

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
