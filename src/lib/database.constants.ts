/**
 * Nombres de las tablas en Supabase
 */
export const TABLES = {
  COMPETITIONS: 'competitions',
  TEAMS: 'teams',
  TUTORS: 'tutors',
  ASSIGNMENTS: 'assignments',
} as const;

/**
 * Nombres de las columnas clave por tabla
 */
export const COLUMNS = {
  COMPETITIONS: {
    ID: 'id',
    NAME: 'name',
    YEAR: 'year',
    STATUS: 'status',
    WAS_HELD: 'was_held',
    ASSIGNMENTS_STATE: 'assignments_state',
  },
  TEAMS: {
    ID: 'id',
    COMPETITION_ID: 'competition_id',
    NAME: 'name',
    SCHOOL: 'school',
    PROFESSOR: 'professor',
    AVAILABILITY: 'availability',
  },
  TUTORS: {
    ID: 'id',
    COMPETITION_ID: 'competition_id',
    NAME: 'name',
    EMAIL: 'email',
    MAX_SESSIONS: 'max_sessions',
    AVAILABILITY: 'availability',
  },
  ASSIGNMENTS: {
    ID: 'id',
    COMPETITION_ID: 'competition_id',
    TEAM_ID: 'team_id',
    TUTOR_ID: 'tutor_id',
    BLOCK_ID: 'block_id',
    IS_FIXED: 'is_fixed',
  }
} as const;

/**
 * Helpers para queries de selección (select)
 * Estos strings se usan en .select() para centralizar qué campos bajamos
 */
export const SELECTS = {
  COMPETITION_LIST: `${COLUMNS.COMPETITIONS.ID}, ${COLUMNS.COMPETITIONS.NAME}, ${COLUMNS.COMPETITIONS.YEAR}, ${COLUMNS.COMPETITIONS.WAS_HELD}, ${COLUMNS.COMPETITIONS.STATUS}`,
  TEAM_LIST: `${COLUMNS.TEAMS.ID}, ${COLUMNS.TEAMS.COMPETITION_ID}, ${COLUMNS.TEAMS.NAME}, ${COLUMNS.TEAMS.SCHOOL}, ${COLUMNS.TEAMS.PROFESSOR}, ${COLUMNS.TEAMS.AVAILABILITY}`,
  TUTOR_LIST: `${COLUMNS.TUTORS.ID}, ${COLUMNS.TUTORS.COMPETITION_ID}, ${COLUMNS.TUTORS.NAME}, ${COLUMNS.TUTORS.EMAIL}, ${COLUMNS.TUTORS.MAX_SESSIONS}, ${COLUMNS.TUTORS.AVAILABILITY}`,
} as const;
