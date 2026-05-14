'use client';

import { useState } from 'react';
import { Team } from '@/types';
import { Card, Typography, Avatar, Badge, Button } from '@/components/ui';
import { Trash2, Calendar, Save, RefreshCcw } from 'lucide-react';
import { EntitySidebar } from '@/components/layout/EntitySidebar';
import { BlockSelectionGrid } from '@/components/features/solver/grids';
import { useEntityEditor } from '@/lib/hooks';

interface TeamCardProps {
  team: Team;
  onUpdate?: (id: string, updates: Partial<Team>) => Promise<boolean>;
  onDelete?: (id: string) => Promise<boolean>;
}

export function TeamCard({ team, onUpdate, onDelete }: TeamCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  // Usamos el nuevo hook para manejar toda la lógica de edición
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
    <Card className="flex flex-col xl:flex-row gap-8 p-0 overflow-hidden border-zinc-800/50 bg-zinc-900/20">
      <EntitySidebar>
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <Avatar name={team.name} />
              <Typography as="h3">{team.name}</Typography>
              <Typography as="p" emphasis="medium" className="text-xs">{team.school}</Typography>
            </div>
            {onDelete && (
              <Button
                variant="ghost"
                className="text-red-500 hover:text-red-400 p-2"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 size={16} />
              </Button>
            )}
          </div>

          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
            <Typography as="p" emphasis="medium" className="text-xs">Responsable:</Typography>
            <Typography as="p" emphasis="medium" className="text-sm">{team.professor}</Typography>
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
      </EntitySidebar>

      <div className="flex-1 p-6 bg-zinc-950/20">
        <div className="mb-4 flex items-center justify-between">
          <Typography as="p" emphasis="medium" className="text-xs">Disponibilidad del Equipo:</Typography>
          <Badge color="blue">
            <Calendar size={11} />
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
