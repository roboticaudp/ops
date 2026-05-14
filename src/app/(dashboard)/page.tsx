import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { createSupabaseServer } from '@/lib/supabase-server';
import { CompetitionService } from '@/services/competition.service';
import { QUERY_KEYS } from '@/lib/hooks/useQueries';
import { SchedulingView } from '@/components/features/scheduling/SchedulingView';

export default async function SchedulingPage() {
  const queryClient = new QueryClient();
  const supabase = await createSupabaseServer();

  // Pre-fetch de la lista de competencias
  await queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.competitions,
    queryFn: () => CompetitionService.getAll(supabase),
  });

  // Intentar obtener la competencia activa para pre-fetch de sus datos
  const activeCompetition = await CompetitionService.getActive(supabase);
  
  if (activeCompetition) {
    await queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.competitionData(activeCompetition.id),
      queryFn: () => CompetitionService.getBootstrapData(activeCompetition.id, supabase),
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SchedulingView />
    </HydrationBoundary>
  );
}
