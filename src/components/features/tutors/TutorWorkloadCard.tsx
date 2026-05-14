'use client';

import { Tutor, Assignment } from '@/types';
import { Card, Typography, Badge, Avatar, StatsPanel, StatsItem } from '@/components/ui';
import { TutorWorkloadGrid } from '@/components/features/solver/grids';
import { Mail, Check, AlertCircle } from 'lucide-react';

import { EntitySidebar } from '@/components/layout/EntitySidebar';

interface TutorWorkloadCardProps {
  tutor: Tutor;
  assignments: Assignment[];
  getTeamName: (id: string) => string;
}

export function TutorWorkloadCard({ tutor, assignments, getTeamName }: TutorWorkloadCardProps) {
  return (
    <Card className="flex flex-col xl:flex-row gap-8 p-0 overflow-hidden border-zinc-800/50 bg-zinc-900/20">
      <EntitySidebar>
        <div className="space-y-6">
          <div className="space-y-2">
            <Avatar name={tutor.name} />
            <Typography as="h3">{tutor.name}</Typography>
            <div className="flex items-center gap-2 text-zinc-500 text-[10px]">
              <Mail size={10} />
              <span className="truncate">{tutor.email || 'Sin correo'}</span>
            </div>
          </div>

          <StatsPanel>
            <StatsItem label="Cupos" value={tutor.max_sessions} />
            <StatsItem 
              label="Carga" 
              value={assignments.length} 
              valueClassName={assignments.length > 0 ? 'text-blue-400' : 'text-zinc-600'} 
            />
          </StatsPanel>
        </div>

        <div className="mt-8 pt-4 border-t border-zinc-800/50">
          <Badge color={assignments.length === tutor.max_sessions ? 'green' : 'blue'}>
            {assignments.length === tutor.max_sessions ? (
              <>
                <Check size={11} />
                Full
              </>
            ) : (
              <>
                <AlertCircle size={11} />
                Disponible
              </>
            )}
          </Badge>
        </div>
      </EntitySidebar>

      <div className="flex-1 p-6 bg-zinc-950/10">
        <div className="mb-4 flex items-center justify-between">
          <Typography as="p" emphasis="medium" className="text-xs uppercase font-bold tracking-widest">Calendario de Asignaciones</Typography>
          <span className="text-[9px] font-bold text-zinc-600 px-2 py-0.5 bg-zinc-900 rounded-full border border-zinc-800">
            Vista Semanal
          </span>
        </div>
        <TutorWorkloadGrid
          assignments={assignments}
          getTeamName={getTeamName}
        />
      </div>
    </Card>
  );
}
