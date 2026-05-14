'use client';

import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { Day, Team, Tutor, Assignment } from '@/types';
import { SolverResult } from '@/lib';
import { TutorWorkloadCard } from '@/components/features/tutors/TutorWorkloadCard';
import { SpareCapacityGrid, MainAssignmentGrid, UnassignedTeamsSection } from '@/components/features/solver';
import { useCompetition } from '@/lib/context/CompetitionContext';
import { Typography, Badge, Button, DropMenu, DropMenuItem } from '@/components/ui';
import { Lock, Unlock, Download, AlertCircle, CheckCircle, ChevronUp, FileSpreadsheet, FileText, Loader2 } from 'lucide-react';
import { buildExportRows, downloadCSV, exportToGridExcel } from '@/lib/export';
import { useCompetitionData, useSaveAssignmentsState } from '@/lib/hooks/useQueries';

const DAYS: Day[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export default function SchedulingPage() {
  const { activeCompetition } = useCompetition();
  const { teams, tutors, assignments, isLoading: isDataLoading } = useCompetitionData(activeCompetition?.id);
  const saveAssignments = useSaveAssignmentsState();

  const [solverResult, setSolverResult] = useState<SolverResult | null>(null);
  const [isSolving, setIsSolving] = useState(false);

  const workerRef = useRef<Worker | null>(null);

  const startSolverWorker = useCallback(() => {
    if (!teams.length || !tutors.length) return;

    setIsSolving(true);
    workerRef.current?.terminate();
    const worker = new Worker(new URL('../../workers/solver.worker.ts', import.meta.url));
    workerRef.current = worker;

    worker.onmessage = (e: MessageEvent<SolverResult>) => {
      setSolverResult(e.data);
      setIsSolving(false);
    };

    const fixed = assignments.filter(a => !!a.is_fixed);
    worker.postMessage({ teams, tutors, fixedAssignments: fixed });
  }, [teams, tutors, assignments]);

  useEffect(() => {
    startSolverWorker();
    return () => workerRef.current?.terminate();
  }, [startSolverWorker]);

  const toggleAssignmentFixed = async (assignment: Assignment) => {
    if (!activeCompetition || !solverResult) return;

    const isNowFixed = !assignment.is_fixed;
    const updatedAssignments = solverResult.assignments.map(a =>
      a.team_id === assignment.team_id ? { ...a, is_fixed: isNowFixed } : a
    );

    await saveAssignments.mutateAsync({
      competitionId: activeCompetition.id,
      assignments: updatedAssignments
    });
  };

  const fixAllAssignments = async () => {
    if (!solverResult || !activeCompetition) return;
    const allFixed = solverResult.assignments.map(a => ({ ...a, is_fixed: true }));
    await saveAssignments.mutateAsync({ competitionId: activeCompetition.id, assignments: allFixed });
  };

  const unfixAllAssignments = async () => {
    if (!solverResult || !activeCompetition) return;
    const allUnfixed = solverResult.assignments.map(a => ({ ...a, is_fixed: false }));
    await saveAssignments.mutateAsync({ competitionId: activeCompetition.id, assignments: allUnfixed });
  };

  const teamNamesMap = useMemo(() => new Map<string, string>(teams.map((t: Team) => [t.id, t.name])), [teams]);
  const tutorNamesMap = useMemo(() => new Map<string, string>(tutors.map((t: Tutor) => [t.id, t.name])), [tutors]);

  const assignmentsByTutor = useMemo(() => {
    const map = new Map<string, Assignment[]>();
    solverResult?.assignments.forEach(a => {
      const current = map.get(a.tutor_id) || [];
      map.set(a.tutor_id, [...current, a]);
    });
    return map;
  }, [solverResult?.assignments]);

  const getTeamName = useCallback((id: string) => teamNamesMap.get(id) || id, [teamNamesMap]);
  const getTutorName = useCallback((id: string) => tutorNamesMap.get(id) || id, [tutorNamesMap]);

  if (!activeCompetition) {
    return (
      <div className="text-zinc-600 bg-zinc-900/20 border border-zinc-800/50 p-12 rounded-2xl text-center italic">
        Selecciona un año del historial para comenzar.
      </div>
    );
  }

  if (isDataLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="animate-spin text-blue-500" size={40} />
        <Typography as="p" emphasis="medium">Cargando datos de la competencia...</Typography>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <header className="mb-10">
        <div className="flex items-center gap-4 mb-3">
          <Typography as="h1" className="text-5xl lg:text-6xl font-bold">
            {activeCompetition?.name}
          </Typography>
          {isSolving && <Badge color="blue" className="animate-pulse">Calculando óptimo...</Badge>}
        </div>
        <Typography as="p" emphasis="medium">
          Gestión de asignaciones y disponibilidad de la competencia.
        </Typography>
      </header>

      <section className="pt-12">
        <div className="flex justify-end gap-3 mb-4">
          {solverResult && (
            <>
              <div className="group relative">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-green-900/50 hover:bg-green-900/10 text-green-400"
                >
                  <Download size={14} />
                  Exportar
                  <ChevronUp size={12} className="opacity-50" />
                </Button>

                <DropMenu position="up">
                  <DropMenuItem
                    icon={FileSpreadsheet}
                    onClick={() => {
                      const name = activeCompetition?.name?.replace(/\s+/g, '_') || 'asignaciones';
                      exportToGridExcel(solverResult.assignments, teams, tutors, `${name}_plantilla.xlsx`);
                    }}
                  >
                    Plantilla (Excel)
                  </DropMenuItem>
                  <DropMenuItem
                    icon={FileText}
                    onClick={() => {
                      const rows = buildExportRows(solverResult.assignments, teams, tutors);
                      const name = activeCompetition?.name?.replace(/\s+/g, '_') || 'asignaciones';
                      downloadCSV(rows, `${name}_asignaciones.csv`);
                    }}
                  >
                    Asignaciones (CSV)
                  </DropMenuItem>
                </DropMenu>
              </div>
              <Button
                variant="outline"
                onClick={unfixAllAssignments}
                disabled={saveAssignments.isPending}
                className="flex items-center gap-2"
              >
                <Unlock size={14} />
                Desfijar todo
              </Button>
              <Button
                onClick={fixAllAssignments}
                disabled={saveAssignments.isPending}
                className="flex items-center gap-2"
              >
                {saveAssignments.isPending ? <Loader2 className="animate-spin" size={14} /> : <Lock size={14} />}
                Fijar todas las asignaciones
              </Button>
            </>
          )}
        </div>

        <MainAssignmentGrid
          assignments={solverResult?.assignments || []}
          getTeamName={getTeamName}
          getTutorName={getTutorName}
          onToggleFixed={toggleAssignmentFixed}
        />
      </section>

      <section className="pt-12">
        <header className="mb-10">
          <Typography as="h2">Equipos sin Asignación</Typography>
          <Badge color={(solverResult?.unassignedTeams?.length ?? 0) > 0 ? 'red' : 'green'}>
            {(solverResult?.unassignedTeams?.length ?? 0) > 0 ? <AlertCircle size={11} /> : <CheckCircle size={11} />}
            {solverResult?.unassignedTeams?.length ?? 0} equipos
          </Badge>
        </header>
        <UnassignedTeamsSection
          teams={teams}
          tutors={tutors}
          unassignedTeamNames={solverResult?.unassignedTeams || []}
          assignments={solverResult?.assignments || []}
        />
      </section>

      <section className="pt-12">
        <header className="mb-10">
          <Typography as="h2">Mapa de Disponibilidad Remanente</Typography>
          <Typography as="p" emphasis="medium">Bloques con tutores que tienen cupos libres y están disponibles.</Typography>
        </header>
        <SpareCapacityGrid tutors={tutors} teams={teams} assignments={solverResult?.assignments || []} />
      </section>

      <section className="pt-12">
        <header className="mb-10">
          <Typography as="h2">Resumen de Carga de Tutores</Typography>
          <Typography as="p" emphasis="medium">Visualización de la carga de trabajo de cada tutor.</Typography>
        </header>
        <div className="flex flex-col gap-8">
          {tutors.map((t: Tutor) => (
            <TutorWorkloadCard
              key={t.id}
              tutor={t}
              assignments={assignmentsByTutor.get(t.id) || []}
              getTeamName={getTeamName}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
