'use client';

import { Team, Tutor, Assignment } from '@/types';
import { FailureDiagnosisCard } from '@/components/features/solver/FailureDiagnosisCard';
import { analyzeFailureReason } from '@/lib/diagnostics';
import { ShieldX, AlertTriangle, GitMerge, CheckCircle2 } from 'lucide-react';

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
      {/* Resumen de severidades */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex items-center gap-3 px-4 py-3 bg-red-950/20 border border-red-900/30 rounded-xl">
          <ShieldX size={18} className="text-red-400 shrink-0" />
          <div>
            <p className="text-xl font-bold text-red-300">{critical}</p>
            <p className="text-[10px] text-red-600 font-medium">Sin solución directa</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 bg-amber-950/20 border border-amber-900/30 rounded-xl">
          <AlertTriangle size={18} className="text-amber-400 shrink-0" />
          <div>
            <p className="text-xl font-bold text-amber-300">{capacityIssues}</p>
            <p className="text-[10px] text-amber-600 font-medium">Aumentar cupo de tutor</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 bg-zinc-900/40 border border-zinc-800 rounded-xl">
          <GitMerge size={18} className="text-zinc-400 shrink-0" />
          <div>
            <p className="text-xl font-bold text-zinc-300">{conflicts}</p>
            <p className="text-[10px] text-zinc-600 font-medium">Conflicto de horarios</p>
          </div>
        </div>
      </div>

      {/* Tarjetas de diagnóstico */}
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

