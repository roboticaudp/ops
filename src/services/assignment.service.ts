import { supabase as defaultClient } from '@/lib/supabase';
import { SupabaseClient } from '@supabase/supabase-js';
import { assignmentSchema } from '@/lib/validations';
import { z } from 'zod';

export const AssignmentService = {
  async getByCompetition(competitionId: string, supabase: SupabaseClient = defaultClient) {
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .eq('competition_id', competitionId);
    return error ? [] : data;
  },

  async saveBatch(assignments: unknown[], supabase: SupabaseClient = defaultClient) {
    const validated = z.array(assignmentSchema).parse(assignments);
    const { error } = await supabase
      .from('assignments')
      .upsert(validated, { onConflict: 'competition_id, team_id' });
    return !error;
  },

  async clear(competitionId: string, supabase: SupabaseClient = defaultClient) {
    const { error } = await supabase
      .from('assignments')
      .delete()
      .eq('competition_id', competitionId);
    return !error;
  }
};
