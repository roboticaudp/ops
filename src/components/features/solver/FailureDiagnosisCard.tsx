'use client';

import { Team, Tutor, Assignment, TIME_BLOCKS } from '@/types';
import { Card, Typography } from '@/components/ui';
import { MiniAvailabilityGrid } from '@/components/features/solver/grids';
import { analyzeFailureReason, DiagnosticType } from '@/lib/diagnostics';
import { AlertTriangle, ShieldX, GitMerge, Info } from 'lucide-react';

interface FailureDiagnosisCardProps {
  team: Team;
  tutors: Tutor[];
  assignments: Assignment[];
}

const SEVERITY_CONFIG: Record<DiagnosticType, {
  label: string;
  icon: React.ElementType;
  badgeClass: string;
  borderClass: string;
  bgClass: string;
}> = {
  NO_TUTOR: {
    label: 'Crítico',
    icon: ShieldX,
    badgeClass: 'text-red-400 bg-red-500/10 border-red-500/20',
    borderClass: 'border-red-900/40',
    bgClass: 'bg-red-950/10',
  },
  PHYSICAL_LIMIT: {
    label: 'Límite físico',
    icon: ShieldX,
    badgeClass: 'text-red-400 bg-red-500/10 border-red-500/20',
    borderClass: 'border-red-900/40',
    bgClass: 'bg-red-950/10',
  },
  CAPACITY_LIMIT: {
    label: 'Sin cupo',
    icon: AlertTriangle,
    badgeClass: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    borderClass: 'border-amber-500/20',
    bgClass: 'bg-amber-500/5',
  },
  COMPLEX_CONFLICT: {
    label: 'Conflicto',
    icon: GitMerge,
    badgeClass: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    borderClass: 'border-amber-500/20',
    bgClass: 'bg-amber-500/5',
  },
};

function formatBlockLabel(blockId: string): string {
  const block = TIME_BLOCKS.find(b => b.id === blockId);
  if (!block) return blockId;
  const dayAbbr: Record<string, string> = {
    Lunes: 'Lun', Martes: 'Mar', Miércoles: 'Mié', Jueves: 'Jue', Viernes: 'Vie', Sábado: 'Sáb'
  };
  return `${dayAbbr[block.day] ?? block.day} ${block.startTime}`;
}

export function FailureDiagnosisCard({ team, tutors, assignments }: FailureDiagnosisCardProps) {
  const diagnostic = analyzeFailureReason(team, tutors, assignments);
  const cfg = SEVERITY_CONFIG[diagnostic.type];
  const Icon = cfg.icon;

  return (
    <Card className={`flex flex-col gap-5 transition-all ${cfg.borderClass} ${cfg.bgClass}`}>

      {/* Header: nombre + badge de severidad */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <Typography as="h3" className="text-base">{team.name}</Typography>
          <Typography as="p" emphasis="medium" className="text-xs">{team.school}</Typography>
        </div>
        <span className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[11px] font-bold shrink-0 ${cfg.badgeClass}`}>
          <Icon size={11} />
          {cfg.label}
        </span>
      </div>

      {/* Razón del fallo */}
      <div className="space-y-1">
        <Typography as="p" emphasis="medium" className="text-[11px] uppercase tracking-wider font-bold">
          Causa
        </Typography>
        <div className={`text-xs px-3 py-2 rounded-lg border ${cfg.badgeClass} flex items-start gap-2`}>
          <Info size={12} className="shrink-0 mt-0.5" />
          <span>
            {diagnostic.type === 'NO_TUTOR' && 'Ningún tutor tiene disponibilidad en los bloques marcados por este equipo.'}
            {diagnostic.type === 'PHYSICAL_LIMIT' && 'Todos los bloques disponibles del equipo están al límite (4/4 equipos simultáneos).'}
            {diagnostic.type === 'CAPACITY_LIMIT' && 'Hay tutores disponibles en horario, pero ya alcanzaron su cupo máximo semanal.'}
            {diagnostic.type === 'COMPLEX_CONFLICT' && 'Los tutores compatibles ya están ocupados en esos bloques con otros equipos.'}
          </span>
        </div>
      </div>

      {/* Hints accionables: qué tutor + en qué bloques */}
      {diagnostic.capacityHints.length > 0 && (
        <div className="space-y-2">
          <Typography as="p" emphasis="medium" className="text-[11px] uppercase tracking-wider font-bold">
            Acción recomendada
          </Typography>
          <div className="space-y-2">
            {diagnostic.capacityHints.map(hint => (
              <div
                key={hint.tutorId}
                className="flex flex-col gap-1 px-3 py-2 bg-zinc-900/60 border border-zinc-800 rounded-lg"
              >
                <span className="text-xs font-bold text-zinc-200">
                  Aumentar cupo de <span className="text-amber-300">{hint.tutorName}</span>
                </span>
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {hint.availableBlocks.map(blockId => (
                    <span
                      key={blockId}
                      className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded"
                    >
                      {formatBlockLabel(blockId)}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Estadísticas de bloques */}
      <div className="flex items-center gap-4 px-3 py-2 bg-zinc-950/50 rounded-lg border border-zinc-900">
        <div className="text-center">
          <p className="text-lg font-bold text-zinc-200">{team.availability.length}</p>
          <p className="text-[10px] text-zinc-500">Bloques totales</p>
        </div>
        <div className="w-px h-8 bg-zinc-800" />
        <div className="text-center">
          <p className="text-lg font-bold text-green-400">{diagnostic.openBlocks}</p>
          <p className="text-[10px] text-zinc-500">Con opción</p>
        </div>
        <div className="w-px h-8 bg-zinc-800" />
        <div className="text-center">
          <p className="text-lg font-bold text-red-400">{diagnostic.fullBlocks}</p>
          <p className="text-[10px] text-zinc-500">Llenos (4/4)</p>
        </div>
      </div>

      {/* Grid visual con colores */}
      <div className="space-y-1.5">
        <Typography as="p" emphasis="medium" className="text-[11px] uppercase tracking-wider font-bold">
          Disponibilidad del equipo
        </Typography>
        <MiniAvailabilityGrid
          selectedBlocks={team.availability}
          blockStatuses={diagnostic.blockStatuses}
        />
      </div>
    </Card>
  );
}

