'use client';

import { useState } from 'react';
import { UI } from '@/styles/ui';
import { ExpandableForm, Typography, Counter } from '@/components/ui';
import { BlockSelectionGrid } from '@/components/features/solver/grids';
import { UserPlus, User, Mail, ShieldAlert } from 'lucide-react';
import { TutorService } from '@/services/tutor.service';

interface AddTutorFormProps {
  competitionId: string;
  onSuccess: () => void;
}

export function AddTutorForm({ competitionId, onSuccess }: AddTutorFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [capacity, setCapacity] = useState(3);
  const [availability, setAvailability] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    try {
      const success = await TutorService.create({
        competition_id: competitionId,
        name,
        email: email || null,
        max_sessions: capacity,
        availability
      });

      if (success) {
        setName('');
        setEmail('');
        setCapacity(3);
        setAvailability([]);
        onSuccess();
        return true;
      }
    } catch (e: any) {
      setError(e.message || 'Error al crear tutor');
    }
    return false;
  };

  return (
    <ExpandableForm
      triggerIcon={<UserPlus size={18} />}
      triggerText="Agregar Nuevo Tutor"
      formTitle="Configurar Perfil de Tutor"
      onSubmit={handleSubmit}
      submitText="Crear Perfil"
    >
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Typography as="p" emphasis="medium" className="text-xs uppercase font-bold tracking-wider flex items-center gap-2">
              <User size={14} className="text-blue-400" />
              Identificación
            </Typography>
            <input
              placeholder="Ej: Juan Pérez"
              className={UI.input + " w-full bg-zinc-900/50 border-zinc-800 focus:border-blue-500/50"}
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-3">
            <Typography as="p" emphasis="medium" className="text-xs uppercase font-bold tracking-wider flex items-center gap-2">
              <Mail size={14} className="text-blue-400" />
              Contacto
            </Typography>
            <input
              type="email"
              placeholder="juan@ejemplo.com"
              className={UI.input + " w-full bg-zinc-900/50 border-zinc-800 focus:border-blue-500/50"}
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="p-4 bg-zinc-900/30 rounded-2xl border border-zinc-800/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Typography as="h4" className="text-sm font-bold">Capacidad de Carga</Typography>
              <Typography as="p" emphasis="medium" className="text-xs">Número máximo de sesiones por semana</Typography>
            </div>
            <Counter
              value={capacity}
              onChange={setCapacity}
              min={1}
              max={15}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Typography as="p" emphasis="medium" className="text-xs uppercase font-bold tracking-wider">
              Disponibilidad Horaria
            </Typography>
            <span className="text-[10px] font-bold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full border border-blue-400/20">
              {availability.length} bloques seleccionados
            </span>
          </div>
          <div className="p-1 bg-zinc-950/50 rounded-2xl border border-zinc-900">
            <BlockSelectionGrid selected={availability} onChange={setAvailability} />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs animate-in slide-in-from-top-2">
            <ShieldAlert size={14} />
            <span>{error}</span>
          </div>
        )}
      </div>
    </ExpandableForm>
  );
}
