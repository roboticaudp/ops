'use client';

import { useState, useEffect, useCallback } from 'react';
import { TutorService } from '@/services/tutor.service';
import { CompetitionService } from '@/services/competition.service';
import { Tutor, Assignment } from '@/types';

export function useTutorsData(competitionId: string | undefined) {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!competitionId) return;
    setLoading(true);
    setError(null);

    try {
      const [tutorsData, assignmentsData] = await Promise.all([
        TutorService.getByCompetition(competitionId),
        CompetitionService.getAssignmentsState(competitionId)
      ]);
      setTutors(tutorsData || []);
      setAssignments(assignmentsData || []);
    } catch (err: any) {
      setError(err.message || 'Error al cargar tutores');
    } finally {
      setLoading(false);
    }
  }, [competitionId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /** Optimistic add: agrega al estado local inmediatamente, luego persiste en DB */
  const addTutor = useCallback(async (payload: Omit<Tutor, 'id'>): Promise<boolean> => {
    setError(null);

    const tempId = `temp-${Date.now()}`;
    const optimisticTutor: Tutor = { ...payload, id: tempId } as Tutor;

    setTutors(prev => [...prev, optimisticTutor]);

    try {
      const created = await TutorService.create(payload);
      setTutors(prev => prev.map(t => t.id === tempId ? created : t));
      return true;
    } catch (err: any) {
      setTutors(prev => prev.filter(t => t.id !== tempId));
      setError(err.message || 'Error al agregar tutor');
      return false;
    }
  }, []);

  /** Optimistic update: actualiza el estado local inmediatamente, luego persiste en DB */
  const updateTutor = useCallback(async (id: string, updates: Partial<Tutor>): Promise<boolean> => {
    setError(null);

    const snapshot = tutors.find(t => t.id === id);
    if (!snapshot) return false;

    setTutors(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));

    try {
      await TutorService.update(id, updates);
      return true;
    } catch (err: any) {
      setTutors(prev => prev.map(t => t.id === id ? snapshot : t));
      setError(err.message || 'Error al actualizar tutor');
      return false;
    }
  }, [tutors]);

  return { tutors, assignments, loading, error, addTutor, updateTutor, refresh: loadData };
}

