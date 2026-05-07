import { supabase as defaultClient } from '@/lib/supabase';
import { SupabaseClient } from '@supabase/supabase-js';
import { handleServiceError } from '@/lib/errors';

export const AuthService = {
  async checkAccess(email: string, supabase: SupabaseClient = defaultClient): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('allowed_users')
        .select('email')
        .eq('email', email)
        .single();
      
      if (error && error.code !== 'PGRST116') handleServiceError(error);
      return !!data;
    } catch (error) {
      return false;
    }
  },

  async getAllAllowedUsers(supabase: SupabaseClient = defaultClient) {
    const { data, error } = await supabase
      .from('allowed_users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) handleServiceError(error);
    return data;
  },

  async addAllowedUser(email: string, supabase: SupabaseClient = defaultClient) {
    const { data, error } = await supabase
      .from('allowed_users')
      .insert([{ email }])
      .select()
      .single();
    
    if (error) handleServiceError(error);
    return data;
  },

  async removeAllowedUser(email: string, supabase: SupabaseClient = defaultClient) {
    const { error } = await supabase
      .from('allowed_users')
      .delete()
      .eq('email', email);
    
    if (error) handleServiceError(error);
  },

  async signOut(supabase: SupabaseClient = defaultClient) {
    const { error } = await supabase.auth.signOut();
    if (error) handleServiceError(error);
  }
};
