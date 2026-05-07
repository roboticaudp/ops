import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase-server';
import { AuthService } from '@/services/auth.service';
import { AUTH_CONFIG } from '@/lib/constants';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createSupabaseServer();

    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && user) {
      const email = user.email?.toLowerCase().trim();

      if (!email) {
        await AuthService.signOut(supabase);
        return NextResponse.redirect(`${origin}/login?error=no_email`);
      }

      // 1. Validar dominios permitidos
      const hasValidDomain = AUTH_CONFIG.ALLOWED_DOMAINS.some(domain => email.endsWith(domain));

      if (!hasValidDomain) {
        await AuthService.signOut(supabase);
        return NextResponse.redirect(`${origin}/login?error=invalid_domain`);
      }

      // 2. Validar whitelist (Uso del DAL)
      const isAllowed = await AuthService.checkAccess(email, supabase);

      if (!isAllowed) {
        await AuthService.signOut(supabase);
        return NextResponse.redirect(`${origin}/login?error=not_allowed`);
      }

      // Éxito: Redirigir a la página solicitada (o al inicio)
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Error: Redirigir al login con mensaje de error genérico
  return NextResponse.redirect(`${origin}/login?error=no_session`);
}

