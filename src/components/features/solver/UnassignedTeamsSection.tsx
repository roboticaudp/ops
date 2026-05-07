'use client';

import { Team, Tutor, Assignment } from '@/types';
import { FailureDiagnosisCard } from '@/components/features/solver/FailureDiagnosisCard';

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
      <div className="p-8 bg-zinc-900/20 border border-zinc-800 rounded-2xl text-center">
        <p className="text-sm text-green-400 font-bold italic">¡Asignación completa! Todos los equipos tienen tutor.</p>
      </div>
    );
  }

  return (
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
  );
}
