import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { AuthService } from '@/services/auth.service';
import { AUTH_CONFIG } from '@/lib/constants';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete({ name, ...options });
          },
        },
      }
    );

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
