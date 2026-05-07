'use client';

import React, { useState } from 'react';
import { UI } from '@/styles/ui';
import { ExpandableForm, Typography } from '@/components/ui';
import { BlockSelectionGrid } from '@/components/features/solver/grids';
import { Users, School, UserCircle, ShieldAlert } from 'lucide-react';
import { TeamService } from '@/services/team.service';

interface AddTeamFormProps {
  competitionId: string;
  onSuccess: () => void;
}

export function AddTeamForm({ competitionId, onSuccess }: AddTeamFormProps) {
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [professor, setProfessor] = useState('');
  const [availability, setAvailability] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    try {
      const success = await TeamService.create({
        competition_id: competitionId,
        name,
        school,
        professor,
        availability
      });

      if (success) {
        setName('');
        setSchool('');
        setProfessor('');
        setAvailability([]);
        onSuccess();
        return true;
      }
    } catch (e: any) {
      setError(e.message || 'Error al registrar equipo');
    }
    return false;
  };

  return (
    <ExpandableForm
      triggerIcon={<Users size={18} />}
      triggerText="Agregar Nuevo Equipo"
      formTitle="Inscribir Nuevo Equipo"
      onSubmit={handleSubmit}
      submitText="Registrar Equipo"
    >
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Typography as="p" emphasis="medium" className="text-xs uppercase font-bold tracking-wider flex items-center gap-2">
              <Users size={14} className="text-blue-400" />
              Equipo
            </Typography>
            <input 
              placeholder="Nombre del equipo"
              className={UI.input + " w-full bg-zinc-900/50 border-zinc-800 focus:border-blue-500/50"} 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
            />
          </div>
          <div className="space-y-3">
            <Typography as="p" emphasis="medium" className="text-xs uppercase font-bold tracking-wider flex items-center gap-2">
              <School size={14} className="text-blue-400" />
              Institución
            </Typography>
            <input 
              placeholder="Nombre del colegio/escuela"
              className={UI.input + " w-full bg-zinc-900/50 border-zinc-800 focus:border-blue-500/50"} 
              value={school} 
              onChange={e => setSchool(e.target.value)} 
            />
          </div>
        </div>

        <div className="space-y-3">
          <Typography as="p" emphasis="medium" className="text-xs uppercase font-bold tracking-wider flex items-center gap-2">
            <UserCircle size={14} className="text-blue-400" />
            Responsable
          </Typography>
          <input 
            placeholder="Profesor encargado"
            className={UI.input + " w-full md:w-1/2 bg-zinc-900/50 border-zinc-800 focus:border-blue-500/50"} 
            value={professor} 
            onChange={e => setProfessor(e.target.value)} 
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Typography as="p" emphasis="medium" className="text-xs uppercase font-bold tracking-wider">
              Disponibilidad para Competir
            </Typography>
            <span className="text-[10px] font-bold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full border border-blue-400/20">
              {availability.length} bloques marcados
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
