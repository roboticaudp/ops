export type Day = 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado';

export interface Competition {
  id: string;
  name: string;
  year: number;
  was_held: boolean;
  status: 'active' | 'archived';
  assignments_state?: Assignment[];
}

export interface Block {
  id: string;
  day: Day;
  startTime: string;
  endTime: string;
}

export interface Team {
  id: string;
  competition_id: string;
  name: string;
  school: string;
  professor: string;
  availability: string[]; // Array of Block IDs
}

export interface Tutor {
  id: string;
  competition_id: string;
  name: string;
  email?: string;
  max_sessions: number;
  availability: string[]; // Array of Block IDs
}

export interface Assignment {
  id?: string;
  competition_id: string;
  team_id: string;
  tutor_id: string;
  block_id: string;
  is_fixed?: boolean;
}

export const TIME_BLOCKS: Block[] = [
  // Lunes a Viernes
  ...['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].flatMap((day) => [
    { id: `${day}-1`, day: day as Day, startTime: '08:30', endTime: '10:30' },
    { id: `${day}-2`, day: day as Day, startTime: '10:30', endTime: '12:30' },
    { id: `${day}-3`, day: day as Day, startTime: '12:30', endTime: '14:30' },
    { id: `${day}-4`, day: day as Day, startTime: '14:30', endTime: '16:30' },
    { id: `${day}-5`, day: day as Day, startTime: '16:30', endTime: '18:30' },
  ]),
  // Sábado
  { id: 'Sábado-1', day: 'Sábado', startTime: '09:00', endTime: '11:00' },
  { id: 'Sábado-2', day: 'Sábado', startTime: '11:00', endTime: '13:00' },
  { id: 'Sábado-3', day: 'Sábado', startTime: '13:00', endTime: '15:00' },
];
