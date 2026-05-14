'use client';

import { Tutor, Assignment } from '@/types';
import { Card, Typography, Badge, Avatar, Counter, Button } from '@/components/ui';
import { BlockSelectionGrid } from '@/components/features/solver/grids';
import { Mail, Calendar, Users, Save, RefreshCcw } from 'lucide-react';
import { EntitySidebar } from '@/components/layout/EntitySidebar';
import { useEntityEditor } from '@/lib/hooks';

export function TutorCard({ tutor, assignments, onUpdate }: { tutor: Tutor, assignments: Assignment[], onUpdate?: (id: string, updates: Partial<Tutor>) => Promise<boolean> }) {
  // Usamos el nuevo hook para manejar toda la lógica de edición (disponibilidad y capacidad)
  const { 
    tempData: tempTutor, 
    updateField, 
    hasChanges, 
    isSaving: loading, 
    save: handleSave, 
    reset: handleReset 
  } = useEntityEditor(tutor, async (updatedTutor) => {
    if (onUpdate) {
      return await onUpdate(tutor.id, { 
        availability: updatedTutor.availability, 
        max_sessions: updatedTutor.max_sessions 
      });
    }
  });

  return (
    <Card className="flex flex-col xl:flex-row gap-8 p-0 overflow-hidden border-zinc-800/50 bg-zinc-900/20">
      <EntitySidebar>
        <div className="space-y-6">
          <div className="space-y-2">
            <Avatar name={tutor.name} />
            <Typography as="h3">{tutor.name}</Typography>
            <div className="flex items-center gap-2 text-zinc-500 text-xs">
              <Mail size={11} />
              <span className="truncate">{tutor.email || 'Sin correo'}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-3">
              <Typography as="p" emphasis="medium" className="text-[10px]">Configuración de Carga</Typography>

              <Counter
                value={tempTutor.max_sessions}
                onChange={(val) => updateField('max_sessions', val)}
                label="Máximo"
              />

              <div className="pt-3 border-t border-zinc-900 flex justify-between items-center px-1">
                <Typography as="p" emphasis="medium" className="text-[10px]">Actual:</Typography>
                <Badge color={assignments.length > tempTutor.max_sessions ? 'green' : 'blue'}>
                  <Users size={11} />
                  {assignments.length} asignados
                </Badge>
              </div>
            </div>
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
          <Typography as="p" emphasis="medium" className="text-xs">Disponibilidad Semanal</Typography>
          <Badge color="blue">
            <Calendar size={11} />
            {tempTutor.availability.length} bloques activos
          </Badge>
        </div>
        <BlockSelectionGrid
          selected={tempTutor.availability}
          onChange={(newVal) => updateField('availability', newVal)}
        />
      </div>
    </Card>
  );
}
