'use client';

import { Team, Tutor, Assignment, TIME_BLOCKS } from '@/types';
import { Card, Typography, StatsPanel, StatsItem, Badge, Alert, AlertDescription } from '@/components/ui';
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
  borderClass: string;
  bgClass: string;
}> = {
  NO_TUTOR: {
    label: 'Crítico',
    icon: ShieldX,
    borderClass: 'border-red-900/40',
    bgClass: 'bg-red-950/10',
  },
  PHYSICAL_LIMIT: {
    label: 'Límite físico',
    icon: ShieldX,
    borderClass: 'border-red-900/40',
    bgClass: 'bg-red-950/10',
  },
  CAPACITY_LIMIT: {
    label: 'Sin cupo',
    icon: AlertTriangle,
    borderClass: 'border-amber-500/20',
    bgClass: 'bg-amber-500/5',
  },
  COMPLEX_CONFLICT: {
    label: 'Conflicto',
    icon: GitMerge,
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
        <Badge
          variant={diagnostic.type === 'NO_TUTOR' || diagnostic.type === 'PHYSICAL_LIMIT' ? 'red' : 'yellow'}
        >
          <Icon size={11} />
          {cfg.label}
        </Badge>
      </div>

      {/* Razón del fallo */}
      <div className="space-y-1">
        <Typography as="span" emphasis="medium" className="text-[11px] uppercase tracking-wider font-bold">
          Causa
        </Typography>
        <Alert variant={diagnostic.type === 'NO_TUTOR' || diagnostic.type === 'PHYSICAL_LIMIT' ? 'error' : 'warning'}>
          <AlertDescription className="flex items-start gap-2">
            <Info size={14} />
            <span>
              {diagnostic.type === 'NO_TUTOR' && 'Ningún tutor tiene disponibilidad en los bloques marcados por este equipo.'}
              {diagnostic.type === 'PHYSICAL_LIMIT' && 'Todos los bloques disponibles del equipo están al límite (4/4 equipos simultáneos).'}
              {diagnostic.type === 'CAPACITY_LIMIT' && 'Hay tutores disponibles en horario, pero ya alcanzaron su cupo máximo semanal.'}
              {diagnostic.type === 'COMPLEX_CONFLICT' && 'Los tutores compatibles ya están ocupados en esos bloques con otros equipos.'}
            </span>
          </AlertDescription>
        </Alert>
      </div>

      {/* Hints accionables: qué tutor + en qué bloques */}
      {diagnostic.capacityHints.length > 0 && (
        <div className="space-y-2">
          <Typography as="span" emphasis="medium" className="text-[11px] uppercase tracking-wider font-bold">
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
                    <Badge key={blockId} variant="yellow">
                      {formatBlockLabel(blockId)}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Estadísticas de bloques */}
      <StatsPanel>
        <StatsItem label="Bloques totales" value={team.availability.length} />
        <StatsItem label="Con opción" value={diagnostic.openBlocks} valueClassName="text-green-400" />
        <StatsItem label="Llenos (4/4)" value={diagnostic.fullBlocks} valueClassName="text-red-400" />
      </StatsPanel>

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

