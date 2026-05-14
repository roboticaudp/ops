import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CompetitionService } from '@/services/competition.service';
import { Assignment } from '@/types';

export const QUERY_KEYS = {
  competitions: ['competitions'],
  competitionData: (id: string) => ['competitions', id, 'bootstrap'],
  competitionAssignments: (id: string) => ['competitions', id, 'assignments'],
};

export function useCompetitions() {
  return useQuery({
    queryKey: QUERY_KEYS.competitions,
    queryFn: () => CompetitionService.getAll(),
    staleTime: 1000 * 60 * 30, // 30 minutos
  });
}

export function useCompetitionData(competitionId: string | undefined) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: QUERY_KEYS.competitionData(competitionId!),
    queryFn: () => CompetitionService.getBootstrapData(competitionId!),
    enabled: !!competitionId,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  return {
    teams: data?.teams || [],
    tutors: data?.tutors || [],
    assignments: data?.assignments || [],
    isLoading,
    isError,
    refetch
  };
}

export function useSaveAssignmentsState() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ competitionId, assignments }: { competitionId: string, assignments: Assignment[] }) =>
      CompetitionService.saveAssignmentsState(competitionId, assignments),
    onSuccess: (_, { competitionId }) => {
      // Invalidar la consulta consolidada para forzar un refresco
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.competitionData(competitionId) });
    },
  });
}
