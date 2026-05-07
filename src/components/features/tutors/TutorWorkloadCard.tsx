'use client';

import { Tutor, Assignment } from '@/types';
import { Card, Typography, Badge, Avatar } from '@/components/ui';
import { TutorWorkloadGrid } from '@/components/features/solver/grids';
import { Mail } from 'lucide-react';

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

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800/50">
              <p className="text-[8px] font-black text-zinc-600 uppercase mb-1">Cupos</p>
              <p className="text-lg font-mono font-bold text-zinc-300">{tutor.max_sessions}</p>
            </div>
            <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800/50">
              <p className="text-[8px] font-black text-zinc-600 uppercase mb-1">Carga</p>
              <p className={`text-lg font-mono font-bold ${assignments.length > 0 ? 'text-blue-400' : 'text-zinc-600'}`}>
                {assignments.length}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-zinc-800/50">
          <Badge color={assignments.length === tutor.max_sessions ? 'green' : 'blue'}>
            {assignments.length === tutor.max_sessions ? 'Full' : 'Disponible'}
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
