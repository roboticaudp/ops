'use client';

import { useState } from 'react';
import { Team } from '@/types';
import { Card, Typography, Avatar, Badge, Button, Profile } from '@/components/ui';
import { Trash2, Calendar, Save, RefreshCcw } from 'lucide-react';
import { BlockSelectionGrid } from '@/components/features/solver/grids';
import { useEntityEditor } from '@/lib/hooks';

interface TeamCardProps {
  team: Team;
  onUpdate?: (id: string, updates: Partial<Team>) => Promise<boolean>;
  onDelete?: (id: string) => Promise<boolean>;
}

export function TeamCard({ team, onUpdate, onDelete }: TeamCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    tempData: tempTeam,
    updateField,
    hasChanges,
    isSaving: loading,
    save: handleSave,
    reset: handleReset
  } = useEntityEditor(team, async (updatedTeam) => {
    if (onUpdate) {
      return await onUpdate(team.id, { availability: updatedTeam.availability });
    }
  });

  const handleDelete = async () => {
    if (!onDelete) return;
    if (!window.confirm(`¿Estás seguro de que deseas eliminar al equipo ${team.name}?`)) return;
    setIsDeleting(true);
    try {
      await onDelete(team.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="flex flex-col xl:flex-row gap-0 p-0 overflow-hidden">
      <div className="w-full xl:w-80 p-6 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <Profile
              avatar={<Avatar name={team.name} />}
              title={team.name}
              description={team.school}
              titleClassName="text-base"
            />
            {onDelete && (
              <Button
                variant="ghost"
                className="text-zinc-600 hover:text-red-400 p-1.5 h-auto"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 size={14} />
              </Button>
            )}
          </div>

          <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/50 space-y-1">
            <Typography as="p" emphasis="medium" className="text-[10px] text-zinc-500 uppercase tracking-wider">Responsable</Typography>
            <Typography as="p" emphasis="medium" className="text-sm text-zinc-200">{team.professor}</Typography>
          </div>
        </div>

        {hasChanges && (
          <div className="mt-8 flex flex-col gap-2 animate-in slide-in-from-bottom-2 duration-300">
            <Button
              className="w-full"
              disabled={loading}
              onClick={handleSave}
            >
              <Save size={14} className="mr-2" />
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              disabled={loading}
              onClick={handleReset}
            >
              <RefreshCcw size={14} className="mr-2" />
              Descartar
            </Button>
          </div>
        )}
      </div>

      <div className="flex-1 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-blue-500" />
            <Typography as="p" emphasis="medium" className="text-xs font-bold text-zinc-300">Disponibilidad del Equipo</Typography>
          </div>
          <Badge color="blue" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
            {tempTeam.availability.length} bloques marcados
          </Badge>
        </div>
        <BlockSelectionGrid
          selected={tempTeam.availability}
          onChange={(newVal) => updateField('availability', newVal)}
        />
      </div>
    </Card>
  );
}
