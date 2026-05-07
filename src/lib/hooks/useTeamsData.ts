'use client';

import { useState, useEffect, useCallback } from 'react';
import { TeamService } from '@/services/team.service';
import { Team } from '@/types';

export function useTeamsData(competitionId: string | undefined) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!competitionId) return;
    setLoading(true);
    setError(null);

    try {
      const data = await TeamService.getByCompetition(competitionId);
      setTeams(data || []);
    } catch (err: any) {
      setError(err.message || 'Error al cargar equipos');
    } finally {
      setLoading(false);
    }
  }, [competitionId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /** Optimistic add: agrega al estado local inmediatamente, luego persiste en DB */
  const addTeam = useCallback(async (payload: Omit<Team, 'id'>): Promise<boolean> => {
    setError(null);

    // 1. Crear item temporal con ID placeholder
    const tempId = `temp-${Date.now()}`;
    const optimisticTeam: Team = { ...payload, id: tempId } as Team;

    // 2. Agregar optimistamente a la lista
    setTeams(prev => [...prev, optimisticTeam]);

    try {
      // 3. Persistir en DB (retorna el record real con ID)
      const created = await TeamService.create(payload);

      // 4. Reemplazar item temporal con el real
      setTeams(prev => prev.map(t => t.id === tempId ? created : t));
      return true;
    } catch (err: any) {
      // 5. Rollback: quitar el item temporal
      setTeams(prev => prev.filter(t => t.id !== tempId));
      setError(err.message || 'Error al agregar equipo');
      return false;
    }
  }, []);

  /** Optimistic update: actualiza el estado local inmediatamente, luego persiste en DB */
  const updateTeam = useCallback(async (id: string, updates: Partial<Team>): Promise<boolean> => {
    setError(null);

    // 1. Snapshot para rollback
    const snapshot = teams.find(t => t.id === id);
    if (!snapshot) return false;

    // 2. Aplicar cambios optimistamente
    setTeams(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));

    try {
      // 3. Persistir en DB
      await TeamService.update(id, updates);
      return true;
    } catch (err: any) {
      // 4. Rollback al snapshot original
      setTeams(prev => prev.map(t => t.id === id ? snapshot : t));
      setError(err.message || 'Error al actualizar equipo');
      return false;
    }
  }, [teams]);

  return { teams, loading, error, addTeam, updateTeam, refresh: loadData };
}
