'use client';

import { useState } from 'react';
import { useCompetition } from '@/lib/context/CompetitionContext';
import { CompetitionService } from '@/services/competition.service';
import { Card, Typography, Button, Alert, AlertTitle, AlertDescription, Badge, Skeleton } from '@/components/ui';
import { Plus, Trash2, Calendar, CheckCircle2, XCircle, Settings2, Trophy } from 'lucide-react';
import { Competition } from '@/types';

import { competitionSchema } from '@/lib/validations';

export default function SettingsCompetitionsPage() {
  const { competitions, loading: contextLoading, refreshCompetitions } = useCompetition();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newYear, setNewYear] = useState(new Date().getFullYear());
  const [newName, setNewName] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // 1. Validar con Zod
      const payload = {
        year: newYear,
        name: newName,
        was_held: false,
        status: 'archived'
      };

      const validated = competitionSchema.parse(payload);

      setLoading(true);
      // 2. Enviar al servicio
      await CompetitionService.create(validated);
      setIsAdding(false);
      setNewName('');
      await refreshCompetitions();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleHeld = async (comp: Competition) => {
    setLoading(true);
    try {
      await CompetitionService.update(comp.id, { was_held: !comp.was_held });
      await refreshCompetitions();
    } catch (err) {
      setError('Error al actualizar el estado.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetActive = async (id: string) => {
    setLoading(true);
    try {
      await CompetitionService.setActive(id);
      await refreshCompetitions();
    } catch (err) {
      setError('Error al cambiar la competencia activa.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro? Se eliminarán todos los datos asociados a este año.')) return;
    setLoading(true);
    try {
      await CompetitionService.delete(id);
      await refreshCompetitions();
    } catch (err) {
      setError('Error al eliminar.');
    } finally {
      setLoading(false);
    }
  };

  if (contextLoading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="header" />
        <Skeleton variant="list" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">

      {error && (
        <Alert variant="error">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end">
        <Button
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 hover:bg-blue-500 font-bold uppercase tracking-tighter"
        >
          <Plus size={18} /> Nueva Edición
        </Button>
      </div>
      {isAdding && (
        <Card className="p-6 border-blue-500/30 bg-blue-500/5">
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div className="space-y-2">
              <Typography as="p" emphasis="medium" className="text-xs font-bold uppercase text-blue-400">Año</Typography>
              <input
                type="number"
                value={newYear}
                onChange={(e) => setNewYear(parseInt(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Typography as="p" emphasis="medium" className="text-xs font-bold uppercase text-blue-400">Nombre de la Competencia</Typography>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ej: OMR 2024"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-white"
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={loading} className="flex-1 bg-blue-600">Crear</Button>
              <Button type="button" onClick={() => setIsAdding(false)} className="flex-1">Cancelar</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid gap-4">
        {[...competitions].sort((a, b) => b.year - a.year).map((comp) => (
          <Card key={comp.id} className={`p-6 hover:border-zinc-700 transition-all ${comp.status === 'active' ? 'border-blue-500/30 bg-blue-500/5' : ''}`}>
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="flex gap-5">
                <div className="h-14 w-14 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-blue-500">
                  <Trophy size={28} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <Typography as="h3" className="text-xl font-bold">{comp.name}</Typography>
                    <Badge color={comp.status === 'active' ? 'green' : 'zinc'}>
                      {comp.status === 'active' ? 'Activa (Principal)' : 'Archivada'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-zinc-500 text-sm">
                    <span className="flex items-center gap-1.5"><Calendar size={14} /> {comp.year}</span>
                    <span className="flex items-center gap-1.5">
                      {comp.was_held ? (
                        <span className="text-green-500 flex items-center gap-1"><CheckCircle2 size={14} /> Realizada</span>
                      ) : (
                        <span className="text-zinc-600 flex items-center gap-1"><XCircle size={14} /> No realizada</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => handleToggleHeld(comp)}
                  className="text-[10px]"
                >
                  {comp.was_held ? 'Ocultar Año' : 'Activar Año'}
                </Button>

                {comp.status !== 'active' && (
                  <Button
                    size="sm"
                    onClick={() => handleSetActive(comp.id)}
                    className="text-[10px]"
                  >
                    Set Active
                  </Button>
                )}

                <button
                  onClick={() => handleDelete(comp.id)}
                  className="p-3 text-zinc-600 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
