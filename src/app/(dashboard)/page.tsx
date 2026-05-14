'use client';

import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { Day, Team, Tutor, Assignment } from '@/types';
import { SolverResult } from '@/lib';
import { TutorWorkloadCard } from '@/components/features/tutors/TutorWorkloadCard';
import { SpareCapacityGrid, MainAssignmentGrid, UnassignedTeamsSection } from '@/components/features/solver';
import { useCompetition } from '@/lib/context/CompetitionContext';
import { Typography, Badge, Button, DropMenu, DropMenuItem } from '@/components/ui';
import { Lock, Unlock, Download, AlertCircle, CheckCircle, ChevronUp, FileSpreadsheet, FileText } from 'lucide-react';
import { buildExportRows, downloadCSV, exportToGridExcel } from '@/lib/export';
import { TeamService } from '@/services/team.service';
import { TutorService } from '@/services/tutor.service';
import { CompetitionService } from '@/services/competition.service';

const DAYS: Day[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export default function SchedulingPage() {
  const { activeCompetition } = useCompetition();
  const [state, setState] = useState({
    result: null as SolverResult | null,
    loading: false,
    teams: [] as Team[],
    tutors: [] as Tutor[],
    fixedAssignments: [] as Assignment[]
  });

  const workerRef = useRef<Worker | null>(null);

  const startSolverWorker = useCallback((teamsData: Team[], tutorsData: Tutor[], fixed: Assignment[]) => {
    workerRef.current?.terminate();
    const worker = new Worker(new URL('../../workers/solver.worker.ts', import.meta.url));
    workerRef.current = worker;
    worker.onmessage = (e: MessageEvent<SolverResult>) => {
      setState(prev => ({ ...prev, result: e.data, loading: false }));
    };
    worker.postMessage({ teams: teamsData, tutors: tutorsData, fixedAssignments: fixed });
  }, []);

  useEffect(() => {
    let mounted = true;
    if (activeCompetition) {
      setState(prev => ({ ...prev, loading: true }));
      Promise.all([
        TeamService.getByCompetition(activeCompetition.id),
        TutorService.getByCompetition(activeCompetition.id),
        CompetitionService.getAssignmentsState(activeCompetition.id)
      ]).then(([fetchedTeams, fetchedTutors, fetchedAssignments]) => {
        if (!mounted) return;

        const fixed = fetchedAssignments.filter(a => !!a.is_fixed);

        setState(prev => ({
          ...prev,
          teams: fetchedTeams,
          tutors: fetchedTutors,
          fixedAssignments: fixed
        }));

        if (fetchedTeams.length > 0 && fetchedTutors.length > 0) {
          startSolverWorker(fetchedTeams, fetchedTutors, fixed);
        } else {
          setState(prev => ({ ...prev, result: null, loading: false }));
        }
      });
    }
    return () => { mounted = false; };
  }, [activeCompetition, startSolverWorker]);

  const toggleAssignmentFixed = async (assignment: Assignment) => {
    if (!activeCompetition || !state.result) return;

    const isNowFixed = !assignment.is_fixed;

    const updatedAssignments = state.result.assignments.map(a =>
      a.team_id === assignment.team_id ? { ...a, is_fixed: isNowFixed } : a
    );

    const newFixed = updatedAssignments.filter(a => !!a.is_fixed);
    setState(prev => ({ ...prev, fixedAssignments: newFixed }));

    await CompetitionService.saveAssignmentsState(activeCompetition.id, updatedAssignments);
    startSolverWorker(state.teams, state.tutors, newFixed);
  };

  const fixAllAssignments = async () => {
    if (!state.result || !activeCompetition) return;

    const allFixed = state.result.assignments.map(a => ({ ...a, is_fixed: true }));
    setState(prev => ({ ...prev, fixedAssignments: allFixed, loading: true }));

    await CompetitionService.saveAssignmentsState(activeCompetition.id, allFixed);
    setState(prev => ({ ...prev, loading: false }));

    startSolverWorker(state.teams, state.tutors, allFixed);
  };

  const unfixAllAssignments = async () => {
    if (!state.result || !activeCompetition) return;

    const allUnfixed = state.result.assignments.map(a => ({ ...a, is_fixed: false }));
    setState(prev => ({ ...prev, fixedAssignments: [], loading: true }));

    await CompetitionService.saveAssignmentsState(activeCompetition.id, allUnfixed);
    setState(prev => ({ ...prev, loading: false }));

    startSolverWorker(state.teams, state.tutors, []);
  };

  const teamNamesMap = useMemo(() => {
    const map = new Map<string, string>();
    state.teams.forEach(t => map.set(t.id, t.name));
    return map;
  }, [state.teams]);

  const tutorNamesMap = useMemo(() => {
    const map = new Map<string, string>();
    state.tutors.forEach(t => map.set(t.id, t.name));
    return map;
  }, [state.tutors]);

  const assignmentsByTutor = useMemo(() => {
    const map = new Map<string, Assignment[]>();
    state.result?.assignments.forEach(a => {
      const current = map.get(a.tutor_id) || [];
      map.set(a.tutor_id, [...current, a]);
    });
    return map;
  }, [state.result?.assignments]);

  const getTeamName = useCallback((id: string) => teamNamesMap.get(id) || id, [teamNamesMap]);
  const getTutorName = useCallback((id: string) => tutorNamesMap.get(id) || id, [tutorNamesMap]);

  if (!activeCompetition) {
    return (
      <div className="text-zinc-600 bg-zinc-900/20 border border-zinc-800/50 p-12 rounded-2xl text-center italic">
        Selecciona un año del historial para comenzar.
      </div>
    );
  }

  const { result, loading, teams, tutors } = state;

  return (
    <div className="space-y-12">
      <header className="mb-10">
        <Typography as="h1" className="text-5xl lg:text-6xl font-bold mb-3">
          {activeCompetition?.name}
        </Typography>
        <Typography as="p" emphasis="medium">
          Gestión de asignaciones y disponibilidad de la competencia.
        </Typography>
      </header>

      <section className="pt-12">
        <div className="flex justify-end gap-3 mb-4">
          {result && (
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
                      exportToGridExcel(result.assignments, teams, tutors, `${name}_plantilla.xlsx`);
                    }}
                  >
                    Plantilla (Excel)
                  </DropMenuItem>
                  <DropMenuItem
                    icon={FileText}
                    onClick={() => {
                      const rows = buildExportRows(result.assignments, teams, tutors);
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
                className="flex items-center gap-2"
              >
                <Unlock size={14} />
                Desfijar todo
              </Button>
              <Button
                onClick={fixAllAssignments}
                className="flex items-center gap-2"
              >
                <Lock size={14} />
                Fijar todas las asignaciones
              </Button>
            </>
          )}
        </div>

        <MainAssignmentGrid
          assignments={result?.assignments || []}
          getTeamName={getTeamName}
          getTutorName={getTutorName}
          onToggleFixed={toggleAssignmentFixed}
        />
      </section>

      <section className="pt-12">
        <header className="mb-10">
          <Typography as="h2">Equipos sin Asignación</Typography>
          <Badge color={(result?.unassignedTeams?.length ?? 0) > 0 ? 'red' : 'green'}>
            {(result?.unassignedTeams?.length ?? 0) > 0 ? (
              <AlertCircle size={11} />
            ) : (
              <CheckCircle size={11} />
            )}
            {result?.unassignedTeams?.length ?? 0} equipos
          </Badge>
        </header>
        <UnassignedTeamsSection
          teams={teams}
          tutors={tutors}
          unassignedTeamNames={result?.unassignedTeams || []}
          assignments={result?.assignments || []}
        />
      </section>

      <section className="pt-12">
        <header className="mb-10">
          <Typography as="h2">Mapa de Disponibilidad Remanente</Typography>
          <Typography as="p" emphasis="medium">Bloques con tutores que tienen cupos libres y están disponibles.</Typography>
        </header>

        <SpareCapacityGrid tutors={tutors} teams={teams} assignments={result?.assignments || []} />
      </section>

      <section className="pt-12">
        <header className="mb-10">
          <Typography as="h2">Resumen de Carga de Tutores</Typography>
          <Typography as="p" emphasis="medium">
            Visualización de la carga de trabajo de cada tutor en la competencia.
          </Typography>
        </header>
        <div className="flex flex-col gap-8">
          {tutors.map(t => (
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
