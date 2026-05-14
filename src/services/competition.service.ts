import { supabase as defaultClient } from '@/lib/supabase';
import { SupabaseClient } from '@supabase/supabase-js';
import { Competition, Assignment } from '@/types';
import { competitionSchema } from '@/lib/validations';
import { handleServiceError } from '@/lib/errors';
import { TABLES, COLUMNS, SELECTS } from '@/lib/database.constants';

export const CompetitionService = {
  async getAll(supabase: SupabaseClient = defaultClient) {
    const { data, error } = await supabase
      .from(TABLES.COMPETITIONS)
      .select(SELECTS.COMPETITION_LIST)
      .order(COLUMNS.COMPETITIONS.YEAR, { ascending: false });
    
    if (error) handleServiceError(error);
    return data;
  },

  async getActive(supabase: SupabaseClient = defaultClient) {
    const { data, error } = await supabase
      .from(TABLES.COMPETITIONS)
      .select(SELECTS.COMPETITION_LIST)
      .eq(COLUMNS.COMPETITIONS.STATUS, 'active')
      .single();
    
    if (error && error.code !== 'PGRST116') handleServiceError(error);
    return data;
  },

  async create(payload: unknown, supabase: SupabaseClient = defaultClient) {
    try {
      const validated = competitionSchema.parse(payload);
      const { data, error } = await supabase
        .from(TABLES.COMPETITIONS)
        .insert({ ...validated, [COLUMNS.COMPETITIONS.STATUS]: 'archived' })
        .select()
        .single();
      
      if (error) handleServiceError(error);
      return data;
    } catch (error) {
      handleServiceError(error);
    }
  },

  async update(id: string, payload: Partial<Competition>, supabase: SupabaseClient = defaultClient) {
    const { data, error } = await supabase
      .from(TABLES.COMPETITIONS)
      .update(payload)
      .eq(COLUMNS.COMPETITIONS.ID, id)
      .select()
      .single();
    
    if (error) handleServiceError(error);
    return data;
  },

  async delete(id: string, supabase: SupabaseClient = defaultClient) {
    const { error } = await supabase
      .from(TABLES.COMPETITIONS)
      .delete()
      .eq(COLUMNS.COMPETITIONS.ID, id);
    
    if (error) handleServiceError(error);
    return true;
  },

  async getAssignmentsState(id: string, supabase: SupabaseClient = defaultClient) {
    const { data, error } = await supabase
      .from(TABLES.COMPETITIONS)
      .select(COLUMNS.COMPETITIONS.ASSIGNMENTS_STATE)
      .eq(COLUMNS.COMPETITIONS.ID, id)
      .single();
    
    if (error && error.code !== 'PGRST116') handleServiceError(error);
    return (data?.assignments_state as Assignment[]) || [];
  },

  async saveAssignmentsState(id: string, assignments: Assignment[], supabase: SupabaseClient = defaultClient) {
    const { error } = await supabase
      .from(TABLES.COMPETITIONS)
      .update({ [COLUMNS.COMPETITIONS.ASSIGNMENTS_STATE]: assignments })
      .eq(COLUMNS.COMPETITIONS.ID, id);
    
    if (error) handleServiceError(error);
    return true;
  },

  /**
   * Cambia la competencia activa en 2 queries en vez de N+1.
   * 1. Archiva TODAS las activas en batch
   * 2. Activa la seleccionada
   */
  async setActive(id: string, supabase: SupabaseClient = defaultClient) {
    // Batch: archivar todas las activas de una vez
    const { error: archiveError } = await supabase
      .from(TABLES.COMPETITIONS)
      .update({ [COLUMNS.COMPETITIONS.STATUS]: 'archived' })
      .eq(COLUMNS.COMPETITIONS.STATUS, 'active');
    
    if (archiveError) handleServiceError(archiveError);

    // Activar la seleccionada
    const { error: activateError } = await supabase
      .from(TABLES.COMPETITIONS)
      .update({ [COLUMNS.COMPETITIONS.STATUS]: 'active' })
      .eq(COLUMNS.COMPETITIONS.ID, id);
    
    if (activateError) handleServiceError(activateError);
    return true;
  }
};
