import { supabase as defaultClient } from '@/lib/supabase';
import { SupabaseClient } from '@supabase/supabase-js';
import { Tutor } from '@/types';
import { tutorSchema } from '@/lib/validations';
import { handleServiceError } from '@/lib/errors';
import { TABLES, COLUMNS, SELECTS } from '@/lib/database.constants';

export const TutorService = {
  async getByCompetition(competitionId: string, supabase: SupabaseClient = defaultClient) {
    const { data, error } = await supabase
      .from(TABLES.TUTORS)
      .select(SELECTS.TUTOR_LIST)
      .eq(COLUMNS.TUTORS.COMPETITION_ID, competitionId)
      .order(COLUMNS.TUTORS.MAX_SESSIONS, { ascending: false });
    
    if (error) handleServiceError(error);
    return data;
  },

  async create(payload: unknown, supabase: SupabaseClient = defaultClient) {
    try {
      const validated = tutorSchema.parse(payload);
      const { data, error } = await supabase
        .from(TABLES.TUTORS)
        .insert(validated)
        .select()
        .single();
      
      if (error) handleServiceError(error);
      return data;
    } catch (error) {
      handleServiceError(error);
    }
  },

  async update(id: string, updates: Partial<Tutor>, supabase: SupabaseClient = defaultClient) {
    try {
      const validated = tutorSchema.partial().parse(updates);
      const { error } = await supabase
        .from(TABLES.TUTORS)
        .update(validated)
        .eq(COLUMNS.TUTORS.ID, id);
      
      if (error) handleServiceError(error);
      return true;
    } catch (error) {
      handleServiceError(error);
    }
  }
};
