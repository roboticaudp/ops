import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CompetitionService } from '@/services/competition.service';
import { TeamService } from '@/services/team.service';
import { TutorService } from '@/services/tutor.service';
import { Assignment } from '@/types';

export const QUERY_KEYS = {
  competitions: ['competitions'],
  competitionAssignments: (id: string) => ['competitions', id, 'assignments'],
  teams: (compId: string) => ['competitions', compId, 'teams'],
  tutors: (compId: string) => ['competitions', compId, 'tutors'],
};

export function useCompetitions() {
  return useQuery({
    queryKey: QUERY_KEYS.competitions,
    queryFn: () => CompetitionService.getAll(),
    staleTime: 1000 * 60 * 30, // 30 minutos (las competencias no cambian seguido)
  });
}

export function useCompetitionData(competitionId: string | undefined) {
  const isEnabled = !!competitionId;

  const teamsQuery = useQuery({
    queryKey: QUERY_KEYS.teams(competitionId!),
    queryFn: () => TeamService.getByCompetition(competitionId!),
    enabled: isEnabled,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  const tutorsQuery = useQuery({
    queryKey: QUERY_KEYS.tutors(competitionId!),
    queryFn: () => TutorService.getByCompetition(competitionId!),
    enabled: isEnabled,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  const assignmentsQuery = useQuery({
    queryKey: QUERY_KEYS.competitionAssignments(competitionId!),
    queryFn: () => CompetitionService.getAssignmentsState(competitionId!),
    enabled: isEnabled,
    staleTime: 1000 * 60 * 2, // 2 minutos (esto cambia más seguido)
  });

  return {
    teams: teamsQuery.data || [],
    tutors: tutorsQuery.data || [],
    assignments: assignmentsQuery.data || [],
    isLoading: teamsQuery.isLoading || tutorsQuery.isLoading || assignmentsQuery.isLoading,
    isError: teamsQuery.isError || tutorsQuery.isError || assignmentsQuery.isError,
    refetch: async () => {
      await Promise.all([
        teamsQuery.refetch(),
        tutorsQuery.refetch(),
        assignmentsQuery.refetch(),
      ]);
    }
  };
}

export function useSaveAssignmentsState() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ competitionId, assignments }: { competitionId: string, assignments: Assignment[] }) =>
      CompetitionService.saveAssignmentsState(competitionId, assignments),
    onSuccess: (_, { competitionId }) => {
      // Invalidar la consulta de asignaciones para forzar un refresco
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.competitionAssignments(competitionId) });
    },
  });
}
