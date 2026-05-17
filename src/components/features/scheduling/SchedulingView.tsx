'use client';

import dynamic from 'next/dynamic';
import { Typography, Badge, Button, DropMenu, DropMenuItem } from '@/components/ui';
import { Lock, Unlock, Download, AlertCircle, CheckCircle, FileSpreadsheet, FileText, Loader2 } from 'lucide-react';
import { buildExportRows, downloadCSV, exportToGridExcel } from '@/lib/export';
import { useScheduling } from '@/lib/hooks/useScheduling';
import { Virtuoso } from 'react-virtuoso';

// Carga dinámica de componentes pesados
const TutorWorkloadCard = dynamic(() => import('@/components/features/tutors/TutorWorkloadCard').then(m => m.TutorWorkloadCard), {
  loading: () => <div className="h-48 animate-pulse bg-zinc-900/50 rounded-2xl" />
});
const MainAssignmentGrid = dynamic(() => import('@/components/features/solver').then(m => m.MainAssignmentGrid), {
  loading: () => <div className="h-96 animate-pulse bg-zinc-900/50 rounded-2xl" />
});
const SpareCapacityGrid = dynamic(() => import('@/components/features/solver').then(m => m.SpareCapacityGrid));
const UnassignedTeamsSection = dynamic(() => import('@/components/features/solver').then(m => m.UnassignedTeamsSection));

export function SchedulingView() {
  const {
    activeCompetition,
    data: { teams, tutors, solverResult, assignmentsByTutor },
    status: { isLoading, isSolving, isSaving },
    actions: { fixAll, unfixAll, toggleFixed, moveAssignment, swapAssignments },
    utils: { getTeamName, getTutorName }
  } = useScheduling();

  if (!activeCompetition) {
    return (
      <div className="text-zinc-600 bg-zinc-900/20 border border-zinc-800/50 p-12 rounded-2xl text-center italic">
        Selecciona un año del historial para comenzar.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="animate-spin text-blue-500" size={40} />
        <Typography as="p" emphasis="medium">Cargando datos de la competencia...</Typography>
      </div>
    );
  }

  return (
    <div className="space-y-8 md:space-y-12">
      <header className="mb-6 md:mb-10">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-3">
          <Typography as="h1" className="text-3xl md:text-5xl lg:text-6xl font-bold">
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
                  className="flex items-center gap-2 border-green-900/20 hover:bg-green-900/10 text-green-400 hover:text-green-500"
                >
                  <Download size={14} />
                  Exportar
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
                onClick={unfixAll}
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                <Unlock size={14} />
                Desfijar todo
              </Button>
              <Button
                onClick={fixAll}
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                {isSaving ? <Loader2 className="animate-spin" size={14} /> : <Lock size={14} />}
                Fijar todas las asignaciones
              </Button>
            </>
          )}
        </div>

        <MainAssignmentGrid
          assignments={solverResult?.assignments || []}
          getTeamName={getTeamName}
          getTutorName={getTutorName}
          onToggleFixed={toggleFixed}
          onMoveAssignment={moveAssignment}
          onSwapAssignments={swapAssignments}
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
          <Virtuoso
            useWindowScroll
            data={tutors}
            itemContent={(index, t) => (
              <div className="pb-8">
                <TutorWorkloadCard
                  key={t.id}
                  tutor={t}
                  assignments={assignmentsByTutor.get(t.id) || []}
                  getTeamName={getTeamName}
                />
              </div>
            )}
          />
        </div>
      </section>
    </div>
  );
}
