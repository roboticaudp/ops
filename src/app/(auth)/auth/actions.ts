'use server';

import { redirect } from 'next/navigation';
import { createSupabaseServer } from '@/lib/supabase-server';

export async function loginWithGoogle() {
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
      queryParams: {
        prompt: 'select_account',
      },
    },
  });

  if (error) {
    console.error('Login error:', error);
    redirect('/login?error=auth_failed');
  }

  if (data.url) {
    redirect(data.url);
  }
}

