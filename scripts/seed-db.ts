import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { parse } from 'csv-parse/sync';
import * as dotenv from 'dotenv';
import ws from 'ws';

// Load .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase env vars (URL or Service Role Key)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  },
  global: {
    headers: { 'x-my-custom-header': 'my-app-name' },
  },
  // Provide WebSocket transport for Node environments < 22
  realtime: {
    transport: ws,
  },
});

async function seed() {
  console.log('Starting migration to Supabase...');

  // 1. Create a Competition
  const { data: comp, error: compErr } = await supabase
    .from('competitions')
    .insert({ name: 'Interescolar de Robótica UDP 2026' })
    .select()
    .single();

  if (compErr) {
    console.error('Comp Error:', compErr);
    throw compErr;
  }
  console.log('Competition created:', comp.id);

  // 2. Parse and Upload Teams
  const teamsCsv = fs.readFileSync('../Inscritos 2026 robotica.xlsx - Hoja1.csv', 'utf-8');
  const teamsLines = teamsCsv.split(/\r?\n/);
  const teamHeaderIdx = teamsLines.findIndex(l => l.split(',').filter(c => c.trim()).length > 10);
  
  const teamsRecords = parse(teamsLines.slice(teamHeaderIdx).join('\n'), {
    columns: h => h.map(i => i.trim()),
    skip_empty_lines: true,
    relax_column_count: true,
    bom: true
  });

  const teamBlockMapping: any = {
    'Días de semana: [08:30 - 10:30]': '1',
    'Días de semana: [10:30 - 12:30]': '2',
    'Días de semana: [12:30 - 14:30]': '3',
    'Días de semana: [14:30 - 16:30]': '4',
    'Días de semana: [16:30 - 18:30]': '5',
  };

  const dbTeams = teamsRecords.map((row: any) => {
    const avail: string[] = [];
    Object.keys(teamBlockMapping).forEach(col => {
      if (row[col]) {
        row[col].split(',').forEach((d: string) => {
          if (d.trim()) avail.push(`${d.trim()}-${teamBlockMapping[col]}`);
        });
      }
    });
    const sat = row['Horarios sábado'];
    if (sat) {
      if (sat.includes('09:00 - 11:00')) avail.push('Sábado-1');
      if (sat.includes('11:00 - 13:00')) avail.push('Sábado-2');
      if (sat.includes('13:00 - 15:00')) avail.push('Sábado-3');
    }
    return {
      competition_id: comp.id,
      name: row['Nombre del equipo'] || 'Sin nombre',
      school: row['Colegio'],
      professor: row['Profesor/a a cargo del equipo'],
      availability: avail
    };
  });

  const { error: tErr } = await supabase.from('teams').insert(dbTeams);
  if (tErr) throw tErr;
  console.log(`Inserted ${dbTeams.length} teams.`);

  // 3. Parse and Upload Tutors
  const tutorsCsv = fs.readFileSync('../Postulación Tutoría de Robótica 2026 (Respuestas) - Respuestas de formulario 1.csv', 'utf-8');
  const tutorsRecords = parse(tutorsCsv, {
    columns: h => h.map(i => i.trim()),
    skip_empty_lines: true,
    relax_column_count: true,
    bom: true
  });

  const tutorBlockMapping: any = {
    'Días de semana: [8:30 - 10:30]': '1',
    'Días de semana: [10:30 - 12:30]': '2',
    'Días de semana: [12:30 - 14:30]': '3',
    'Días de semana: [14:30 - 16:30]': '4',
    'Días de semana: [16:30 - 18:30]': '5',
  };

  const dbTutors = tutorsRecords.map((row: any) => {
    const avail: string[] = [];
    Object.keys(tutorBlockMapping).forEach(col => {
      if (row[col]) {
        row[col].split(',').forEach((d: string) => {
          if (d.trim()) avail.push(`${d.trim()}-${tutorBlockMapping[col]}`);
        });
      }
    });
    const sat = row['Horarios sábado'];
    if (sat) {
      if (sat.includes('9:00 - 11:00')) avail.push('Sábado-1');
      if (sat.includes('11:00 - 13:00')) avail.push('Sábado-2');
      if (sat.includes('13:00 - 15:00')) avail.push('Sábado-3');
    }
    const cap = parseInt(row['Cuantas sesiones podría hacer a la semana?']) || 2;
    return {
      competition_id: comp.id,
      name: row['Nombre y Apellidos'],
      email: row['Dirección de correo electrónico'],
      max_sessions: cap,
      availability: avail
    };
  });

  const { error: tutErr } = await supabase.from('tutors').insert(dbTutors);
  if (tutErr) throw tutErr;
  console.log(`Inserted ${dbTutors.length} tutors.`);

  console.log('Migration finished successfully!');
}

seed().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
