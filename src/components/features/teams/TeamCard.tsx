'use client';

import { useState } from 'react';
import { Team } from '@/types';
import { Card, Typography, Avatar, ActionButtons, Badge, Button } from '@/components/ui';
import { Trash2, Calendar } from 'lucide-react';
import { EntitySidebar } from '@/components/layout/EntitySidebar';
import { BlockSelectionGrid } from '@/components/features/solver/grids';

interface TeamCardProps {
  team: Team;
  onUpdate?: (id: string, updates: Partial<Team>) => Promise<boolean>;
  onDelete?: (id: string) => Promise<boolean>;
}

export function TeamCard({ team, onUpdate, onDelete }: TeamCardProps) {
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [tempAvailability, setTempAvailability] = useState(team.availability);

  const hasChanges = JSON.stringify(tempAvailability) !== JSON.stringify(team.availability);

  const handleSave = async () => {
    if (!onUpdate) return;
    setLoading(true);
    try {
      await onUpdate(team.id, { availability: tempAvailability });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTempAvailability(team.availability);
  };

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
          <ActionButtons
            onSave={handleSave}
            onReset={handleReset}
            loading={loading}
          />
        )}
      </EntitySidebar>

      <div className="flex-1 p-6 bg-zinc-950/20">
        <div className="mb-4 flex items-center justify-between">
          <Typography as="p" emphasis="medium" className="text-xs">Disponibilidad del Equipo:</Typography>
          <Badge color="blue">
            <Calendar size={11} />
            {tempAvailability.length} bloques marcados
          </Badge>
        </div>
        <BlockSelectionGrid
          selected={tempAvailability}
          onChange={setTempAvailability}
        />
      </div>
    </Card>
  );
}
