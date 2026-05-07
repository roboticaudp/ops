'use client';
import { TeamCard } from '@/components/features/teams/TeamCard';
import { AddTeamForm } from '@/components/features/teams/AddTeamForm';
import { useCompetition } from '@/lib/context/CompetitionContext';
import { useTeamsData } from '@/lib/hooks/useTeamsData';
import { Skeleton, Typography } from '@/components/ui';

export default function TeamsPage() {
  const { activeCompetition } = useCompetition();
  const { teams, loading, addTeam, updateTeam } = useTeamsData(activeCompetition?.id);

  if (!activeCompetition) return null;

  return (
    <div className="space-y-12 pb-20">
      <header className="mb-10">
        <Typography as="h1" className="text-5xl lg:text-6xl font-bold mb-3">
          {activeCompetition.name}
        </Typography>
        <Typography as="p" emphasis="medium">
          Gestión de equipos de la competencia.
        </Typography>
      </header>

      <AddTeamForm
        competitionId={activeCompetition.id}
        onAdd={addTeam}
      />

      <div className="space-y-4">
        <Typography as="h2">Listado de Equipos</Typography>

        {loading ? (
          <Skeleton variant="list" />
        ) : (
          <div className="flex flex-col gap-8">
            {teams.length === 0 ? (
              <Typography emphasis="medium" as="p">No hay equipos registrados para este contexto.</Typography>
            ) : (
              teams.map(team => (
                <TeamCard
                  key={team.id}
                  team={team}
                  onUpdate={updateTeam}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

