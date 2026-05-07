import { supabase as defaultClient } from '@/lib/supabase';
import { SupabaseClient } from '@supabase/supabase-js';
import { Competition, Assignment } from '@/types';
import { competitionSchema } from '@/lib/validations';
import { handleServiceError } from '@/lib/errors';

export const CompetitionService = {
  async getAll(supabase: SupabaseClient = defaultClient) {
    const { data, error } = await supabase
      .from('competitions')
      .select('id, name, year, was_held, status')
      .order('year', { ascending: false });
    
    if (error) handleServiceError(error);
    return data;
  },

  async getActive(supabase: SupabaseClient = defaultClient) {
    const { data, error } = await supabase
      .from('competitions')
      .select('*')
      .eq('status', 'active')
      .single();
    
    if (error && error.code !== 'PGRST116') handleServiceError(error);
    return data;
  },

  async create(payload: unknown, supabase: SupabaseClient = defaultClient) {
    try {
      const validated = competitionSchema.parse(payload);
      const { data, error } = await supabase
        .from('competitions')
        .insert({ ...validated, status: 'archived' })
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
      .from('competitions')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    
    if (error) handleServiceError(error);
    return data;
  },

  async delete(id: string, supabase: SupabaseClient = defaultClient) {
    const { error } = await supabase
      .from('competitions')
      .delete()
      .eq('id', id);
    
    if (error) handleServiceError(error);
    return true;
  },

  async getAssignmentsState(id: string, supabase: SupabaseClient = defaultClient) {
    const { data, error } = await supabase
      .from('competitions')
      .select('assignments_state')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') handleServiceError(error);
    return (data?.assignments_state as Assignment[]) || [];
  },

  async saveAssignmentsState(id: string, assignments: Assignment[], supabase: SupabaseClient = defaultClient) {
    const { error } = await supabase
      .from('competitions')
      .update({ assignments_state: assignments })
      .eq('id', id);
    
    if (error) handleServiceError(error);
    return true;
  }
};
