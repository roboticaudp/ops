'use client';
import { TutorCard } from '@/components/features/tutors/TutorCard';
import { AddTutorForm } from '@/components/features/tutors/AddTutorForm';
import { useCompetition } from '@/lib/context/CompetitionContext';
import { Typography, Skeleton } from '@/components/ui';
import { useTutorsData } from '@/lib/hooks/useTutorsData';

export default function TutorsPage() {
  const { activeCompetition } = useCompetition();
  const { tutors, assignments, loading, refresh } = useTutorsData(activeCompetition?.id);

  if (!activeCompetition) return null;

  return (
    <div className="space-y-12 pb-20">
      <header className="mb-10">
        <Typography as="h1" className="text-5xl lg:text-6xl font-bold mb-3">
          {activeCompetition.name}
        </Typography>
        <Typography as="p" emphasis="medium">
          Gestión de tutores de la competencia.
        </Typography>
      </header>

      <AddTutorForm
        competitionId={activeCompetition.id}
        onSuccess={refresh}
      />

      <div className="space-y-4">
        <Typography as="h2">
          Directorio de Tutores
        </Typography>

        {loading ? (
          <Skeleton variant="list" />
        ) : (
          <div className="flex flex-col gap-8">
            {tutors.length === 0 ? (
              <Typography as="p" emphasis="medium">No hay tutores registrados para este contexto.</Typography>
            ) : (
              tutors.map(tutor => (
                <TutorCard
                  key={tutor.id}
                  tutor={tutor}
                  assignments={assignments.filter(a => a.tutor_id === tutor.id)}
                  onUpdate={refresh}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
