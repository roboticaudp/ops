import { supabase as defaultClient } from '@/lib/supabase';
import { SupabaseClient } from '@supabase/supabase-js';
import { Tutor } from '@/types';
import { tutorSchema } from '@/lib/validations';
import { handleServiceError } from '@/lib/errors';

export const TutorService = {
  async getByCompetition(competitionId: string, supabase: SupabaseClient = defaultClient) {
    const { data, error } = await supabase
      .from('tutors')
      .select('id, competition_id, name, email, max_sessions, availability')
      .eq('competition_id', competitionId)
      .order('max_sessions', { ascending: false });
    
    if (error) handleServiceError(error);
    return data;
  },

  async create(payload: unknown, supabase: SupabaseClient = defaultClient) {
    try {
      const validated = tutorSchema.parse(payload);
      const { data, error } = await supabase
        .from('tutors')
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
        .from('tutors')
        .update(validated)
        .eq('id', id);
      
      if (error) handleServiceError(error);
      return true;
    } catch (error) {
      handleServiceError(error);
    }
  }
};
