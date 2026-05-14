import { supabase as defaultClient } from '@/lib/supabase';
import { SupabaseClient } from '@supabase/supabase-js';
import { Team } from '@/types';
import { teamSchema } from '@/lib/validations';
import { handleServiceError } from '@/lib/errors';
import { TABLES, COLUMNS, SELECTS } from '@/lib/database.constants';

export const TeamService = {
  async getByCompetition(competitionId: string, supabase: SupabaseClient = defaultClient) {
    const { data, error } = await supabase
      .from(TABLES.TEAMS)
      .select(SELECTS.TEAM_LIST)
      .eq(COLUMNS.TEAMS.COMPETITION_ID, competitionId);

    if (error) handleServiceError(error);
    return data;
  },

  async create(payload: unknown, supabase: SupabaseClient = defaultClient) {
    try {
      const validated = teamSchema.parse(payload);
      const { data, error } = await supabase
        .from(TABLES.TEAMS)
        .insert(validated)
        .select()
        .single();

      if (error) handleServiceError(error);
      return data;
    } catch (error) {
      handleServiceError(error);
    }
  },

  async update(id: string, updates: Partial<Team>, supabase: SupabaseClient = defaultClient) {
    try {
      const validated = teamSchema.partial().parse(updates);
      const { error } = await supabase
        .from(TABLES.TEAMS)
        .update(validated)
        .eq(COLUMNS.TEAMS.ID, id);

      if (error) handleServiceError(error);
      return true;
    } catch (error) {
      handleServiceError(error);
    }
  },

  async delete(id: string, supabase: SupabaseClient = defaultClient) {
    try {
      // Eliminar el equipo. Las asignaciones en el JSON state se limpiarán
      // la próxima vez que se guarde el estado desde el dashboard.
      const { data, error } = await supabase
        .from(TABLES.TEAMS)
        .delete()
        .eq(COLUMNS.TEAMS.ID, id)
        .select();

      if (error) handleServiceError(error);

      if (!data || data.length === 0) {
        throw new Error("No se pudo eliminar el equipo. Esto suele deberse a que las políticas de seguridad (RLS) de la base de datos no permiten el borrado para tu usuario actual o el registro ya no existe.");
      }

      return true;
    } catch (error: any) {
      if (error instanceof Error && error.message.includes('RLS')) {
        throw error;
      }
      handleServiceError(error);
    }
  }
};
