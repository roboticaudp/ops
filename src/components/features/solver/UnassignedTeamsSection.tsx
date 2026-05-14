'use client';

import { Team, Tutor, Assignment } from '@/types';
import { FailureDiagnosisCard } from '@/components/features/solver/FailureDiagnosisCard';
import { analyzeFailureReason } from '@/lib/diagnostics';
import { ShieldX, AlertTriangle, GitMerge, CheckCircle2 } from 'lucide-react';
import { StatusCard, StatusCardValue, StatusCardDescription } from '@/components/ui';

interface UnassignedTeamsSectionProps {
  teams: Team[];
  tutors: Tutor[];
  unassignedTeamNames: string[];
  assignments: Assignment[];
}

export function UnassignedTeamsSection({
  teams,
  tutors,
  unassignedTeamNames,
  assignments
}: UnassignedTeamsSectionProps) {
  const unassignedTeamDetails = teams.filter(t => unassignedTeamNames.includes(t.name));

  if (unassignedTeamDetails.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 p-10 bg-green-950/20 border border-green-800/30 rounded-2xl text-center">
        <CheckCircle2 size={32} className="text-green-400" />
        <div>
          <p className="text-sm text-green-300 font-bold">¡Asignación completa!</p>
          <p className="text-xs text-green-600 mt-0.5">Todos los equipos tienen tutor asignado.</p>
        </div>
      </div>
    );
  }

  // Calcular severidades para el resumen
  const diagnostics = unassignedTeamDetails.map(team => ({
    team,
    diagnostic: analyzeFailureReason(team, tutors, assignments),
  }));

  const critical = diagnostics.filter(d => d.diagnostic.type === 'NO_TUTOR' || d.diagnostic.type === 'PHYSICAL_LIMIT').length;
  const capacityIssues = diagnostics.filter(d => d.diagnostic.type === 'CAPACITY_LIMIT').length;
  const conflicts = diagnostics.filter(d => d.diagnostic.type === 'COMPLEX_CONFLICT').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        <StatusCard variant="red" icon={ShieldX}>
          <StatusCardValue>{critical}</StatusCardValue>
          <StatusCardDescription>Sin solución directa</StatusCardDescription>
        </StatusCard>

        <StatusCard variant="amber" icon={AlertTriangle}>
          <StatusCardValue>{capacityIssues}</StatusCardValue>
          <StatusCardDescription>Aumentar cupo de tutor</StatusCardDescription>
        </StatusCard>

        <StatusCard variant="zinc" icon={GitMerge}>
          <StatusCardValue>{conflicts}</StatusCardValue>
          <StatusCardDescription>Conflicto de horarios</StatusCardDescription>
        </StatusCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {unassignedTeamDetails.map(team => (
          <FailureDiagnosisCard
            key={team.id}
            team={team}
            tutors={tutors}
            assignments={assignments}
          />
        ))}
      </div>
    </div>
  );
}

