import { Assignment, Team, Tutor, TIME_BLOCKS } from '@/types';
import * as XLSX from 'xlsx';

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

  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

/**
 * Exporta las asignaciones siguiendo el formato de cuadrícula de la plantilla del usuario
 */
export function exportToGridExcel(
  assignments: Assignment[],
  teams: Team[],
  tutors: Tutor[],
  filename: string
) {
  const wb = XLSX.utils.book_new();
  
  // Matriz para representar la hoja (filas y columnas)
  // Usaremos un array de arrays para XLSX.utils.aoa_to_sheet
  const data: any[][] = [];

  // 1. Configurar Tabla Lunes-Viernes (Columnas A-F)
  const weekdays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  const weekTimeBlocks = ['08:30 - 10:30', '10:30 - 12:30', '12:30 - 14:30', '14:30 - 16:30', '16:30 - 18:30'];

  // Cabecera semana
  const weekHeader = ['HORARIO', ...weekdays.map(d => d.toUpperCase())];
  data[1] = weekHeader; // Fila 2 (index 1)

  // Filas de datos semana
  weekTimeBlocks.forEach((timeRange, rowIndex) => {
    const rowData = [timeRange];
    weekdays.forEach((day, colIndex) => {
      // Encontrar asignaciones para este día y este rango horario
      const blockAssignments = assignments.filter(a => {
        const block = TIME_BLOCKS.find(b => b.id === a.block_id);
        return block?.day === day && `${block.startTime} - ${block.endTime}` === timeRange;
      });

      // Formatear contenido de la celda: "Equipo (Tutor)"
      const cellContent = blockAssignments.map(a => {
        const team = teams.find(t => t.id === a.team_id);
        const tutor = tutors.find(t => t.id === a.tutor_id);
        return `${team?.name || '?'}\n(${tutor?.name || '?'})`;
      }).join('\n\n');

      rowData.push(cellContent);
    });
    data[rowIndex + 2] = rowData;
  });

  // 2. Configurar Tabla Sábado (Columnas H-I)
  const satTimeBlocks = ['09:00-11:00', '11:00-13:00', '13:00 - 15:00'];
  
  // Cabecera Sábado
  if (!data[1]) data[1] = [];
  data[1][7] = 'HORARIO'; // Columna H (index 7)
  data[1][8] = 'SABADO';  // Columna I (index 8)

  satTimeBlocks.forEach((timeRange, rowIndex) => {
    if (!data[rowIndex + 3]) data[rowIndex + 3] = []; // El sábado empieza una fila más abajo en la imagen
    
    const blockAssignments = assignments.filter(a => {
      const block = TIME_BLOCKS.find(b => b.id === a.block_id);
      // Normalizamos espacios para comparar rangos horarios
      const bRange = block ? `${block.startTime}-${block.endTime}` : '';
      const targetRange = timeRange.replace(/\s+/g, '');
      return block?.day === 'Sábado' && bRange === targetRange;
    });

    const cellContent = blockAssignments.map(a => {
      const team = teams.find(t => t.id === a.team_id);
      const tutor = tutors.find(t => t.id === a.tutor_id);
      return `${team?.name || '?'}\n(${tutor?.name || '?'})`;
    }).join('\n\n');

    data[rowIndex + 3][7] = timeRange;
    data[rowIndex + 3][8] = cellContent;
  });

  const ws = XLSX.utils.aoa_to_sheet(data);

  // Ajustes de ancho de columna
  ws['!cols'] = [
    { wch: 15 }, // A: Horario
    { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, // B-F: L-V
    { wch: 5 },  // G: Espacio
    { wch: 15 }, // H: Horario Sab
    { wch: 35 }  // I: Sabado
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Horario');
  XLSX.writeFile(wb, filename);
}
