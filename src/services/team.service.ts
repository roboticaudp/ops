import { supabase as defaultClient } from '@/lib/supabase';
import { SupabaseClient } from '@supabase/supabase-js';
import { Team } from '@/types';
import { teamSchema } from '@/lib/validations';
import { handleServiceError } from '@/lib/errors';

export const TeamService = {
  async getByCompetition(competitionId: string, supabase: SupabaseClient = defaultClient) {
    const { data, error } = await supabase
      .from('teams')
      .select('id, competition_id, name, school, professor, availability')
      .eq('competition_id', competitionId);
    
    if (error) handleServiceError(error);
    return data;
  },

  async create(payload: unknown, supabase: SupabaseClient = defaultClient) {
    try {
      const validated = teamSchema.parse(payload);
      const { data, error } = await supabase
        .from('teams')
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
        .from('teams')
        .update(validated)
        .eq('id', id);
      
      if (error) handleServiceError(error);
      return true;
    } catch (error) {
      handleServiceError(error);
    }
  },

  async delete(id: string, supabase: SupabaseClient = defaultClient) {
    try {
      // 1. Eliminar asignaciones relacionadas primero (para no violar FK constraint)
      const { error: assignError } = await supabase
        .from('assignments')
        .delete()
        .eq('team_id', id);
      
      if (assignError) handleServiceError(assignError);

      // 2. Eliminar el equipo
      const { data, error } = await supabase
        .from('teams')
        .delete()
        .eq('id', id)
        .select();
      
      if (error) handleServiceError(error);
      
      if (!data || data.length === 0) {
        throw new Error("No se pudo eliminar el equipo. Verifica los permisos o si existe.");
      }

      return true;
    } catch (error) {
      handleServiceError(error);
    }
  }
};
