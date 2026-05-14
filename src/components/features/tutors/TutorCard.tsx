'use client';

import { Tutor, Assignment } from '@/types';
import { Card, Typography, Badge, Avatar, Counter, Button, Profile } from '@/components/ui';
import { BlockSelectionGrid } from '@/components/features/solver/grids';
import { Mail, Calendar, Users, Save, RefreshCcw } from 'lucide-react';
import { useEntityEditor } from '@/lib/hooks';

export function TutorCard({ tutor, assignments, onUpdate }: { tutor: Tutor, assignments: Assignment[], onUpdate?: (id: string, updates: Partial<Tutor>) => Promise<boolean> }) {
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
    <Card className="flex flex-col xl:flex-row gap-0 p-0 overflow-hidden">
      <div className="w-full xl:w-80 p-6 flex flex-col justify-between">
        <div className="space-y-6">
          <Profile
            avatar={<Avatar name={tutor.name} />}
            title={tutor.name}
            description={
              <div className="flex items-center gap-1.5">
                <Mail size={10} className="text-zinc-600" />
                <span className="truncate">{tutor.email || 'Sin correo'}</span>
              </div>
            }
            titleClassName="text-base"
          />

          <div className="space-y-3">
            <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/50 space-y-4">
              <div className="flex items-center justify-between">
                <Typography as="p" emphasis="medium" className="text-[10px] text-zinc-500 uppercase tracking-wider">Carga Máxima</Typography>
                <Badge color="blue" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                  {assignments.length} / {tempTutor.max_sessions}
                </Badge>
              </div>

              <Counter
                value={tempTutor.max_sessions}
                onChange={(val) => updateField('max_sessions', val)}
              />

              <div className="pt-3 border-t border-zinc-800/50 flex justify-between items-center">
                <Typography as="p" emphasis="medium" className="text-[10px] text-zinc-400 font-bold uppercase">Estado</Typography>
                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-300">
                  <Users size={12} className="text-zinc-500" />
                  <span>Activo</span>
                </div>
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
      </div>

      <div className="flex-1 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-blue-500" />
            <Typography as="p" emphasis="medium" className="text-xs font-bold text-zinc-300">Disponibilidad Semanal</Typography>
          </div>
          <Badge color="blue">
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
