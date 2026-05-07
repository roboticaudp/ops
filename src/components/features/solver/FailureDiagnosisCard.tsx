'use client';

import { Team, Tutor, Assignment } from '@/types';
import { Card, Typography, Alert } from '@/components/ui';
import { MiniAvailabilityGrid } from '@/components/features/solver/grids';
import { analyzeFailureReason } from '@/lib/diagnostics';

interface FailureDiagnosisCardProps {
  team: Team;
  tutors: Tutor[];
  assignments: Assignment[];
}

export function FailureDiagnosisCard({ team, tutors, assignments }: FailureDiagnosisCardProps) {
  const diagnostic = analyzeFailureReason(team, tutors, assignments);
  const isCritical = diagnostic.type === 'NO_TUTOR';

  return (
    <Card className={`flex flex-col gap-4 transition-all ${isCritical ? 'border-red-900/40 bg-red-950/10' : 'border-amber-500/30 bg-amber-500/5'
      }`}>
      <div>
        <Typography as="h3">
          {team.name}
        </Typography>
        <Typography as="p" emphasis="medium" className="text-xs">
          {team.school}
        </Typography>
      </div>

      <Alert
        variant={isCritical ? 'error' : 'warning'}
        title={isCritical ? 'Falla Crítica' : 'Sugerencia'}
      >
        {diagnostic.type === 'NO_TUTOR' && "Ningún tutor disponible en los bloques marcados por el equipo."}
        {diagnostic.type === 'CAPACITY_LIMIT' && (
          <>Aumentar cupos a: <span className="font-bold text-amber-200">{diagnostic.tutors.join(', ')}</span> permitiría asignar este equipo.</>
        )}
        {diagnostic.type === 'PHYSICAL_LIMIT' && "Todos los bloques compatibles están llenos (4/4 equipos)."}
        {diagnostic.type === 'COMPLEX_CONFLICT' && "Límite físico de bloques alcanzado o tutores ya ocupados en esos horarios."}
      </Alert>

      <div className='space-y-2'>
        <Typography as="p" emphasis="medium" className="text-xs mb-2">
          Disponibilidad del equipo
        </Typography>
        <MiniAvailabilityGrid selectedBlocks={team.availability} />
      </div>
    </Card>
  );
}
