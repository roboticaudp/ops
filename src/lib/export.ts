import { Assignment, Team, Tutor, TIME_BLOCKS } from '@/types';

interface ExportRow {
  equipo: string;
  colegio: string;
  profesor: string;
  tutor: string;
  dia: string;
  horario: string;
  bloque: string;
}

/**
 * Genera las filas de exportación a partir de las asignaciones del solver
 */
export function buildExportRows(
  assignments: Assignment[],
  teams: Team[],
  tutors: Tutor[]
): ExportRow[] {
  return assignments
    .map(a => {
      const team = teams.find(t => t.id === a.team_id);
      const tutor = tutors.find(t => t.id === a.tutor_id);
      const block = TIME_BLOCKS.find(b => b.id === a.block_id);

      return {
        equipo: team?.name || a.team_id,
        colegio: team?.school || '',
        profesor: team?.professor || '',
        tutor: tutor?.name || a.tutor_id,
        dia: block?.day || '',
        horario: block ? `${block.startTime} - ${block.endTime}` : '',
        bloque: a.block_id,
      };
    })
    .sort((a, b) => {
      const dayOrder = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      const dayDiff = dayOrder.indexOf(a.dia) - dayOrder.indexOf(b.dia);
      if (dayDiff !== 0) return dayDiff;
      return a.horario.localeCompare(b.horario);
    });
}

/**
 * Convierte filas a CSV y dispara la descarga en el navegador
 */
export function downloadCSV(rows: ExportRow[], filename: string) {
  const headers = ['Equipo', 'Colegio', 'Profesor', 'Tutor', 'Día', 'Horario', 'Bloque'];

  const escapeCSV = (value: string) => {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  const csvContent = [
    headers.join(','),
    ...rows.map(row =>
      [row.equipo, row.colegio, row.profesor, row.tutor, row.dia, row.horario, row.bloque]
        .map(escapeCSV)
        .join(',')
    ),
  ].join('\n');

  // BOM para compatibilidad con Excel y caracteres especiales (tildes, ñ)
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}
