'use client';

import { useSearchParams } from 'next/navigation';
import { loginWithGoogle } from '@/app/(auth)/auth/actions';
import { Button, Card, Typography, Alert, Google } from '@/components/ui';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages: Record<string, string> = {
    invalid_domain: 'Solo se permiten correos @mail.udp.cl',
    not_allowed: 'Tu correo no está en la lista de acceso autorizado',
    no_session: 'Error al iniciar sesión. Intenta nuevamente.',
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-950 px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(39,39,42,0.15),transparent)] pointer-events-none" />

      <Card className="w-full max-w-xs p-6 space-y-6 bg-zinc-900/40 border-zinc-800 backdrop-blur-xl relative">
        <div className="text-center space-y-1">
          <Typography as="h4" className="text-xl">
            Robótica UDP
          </Typography>
          <Typography as="p" emphasis="medium" className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">
            Operations Manager
          </Typography>
        </div>

        {error && (
          <Alert className="bg-red-500/10 border-red-500/20 text-red-400 p-2 text-[10px]">
            {errorMessages[error] || 'Error al iniciar sesión.'}
          </Alert>
        )}

        <div className="space-y-4">
          <Button
            onClick={() => loginWithGoogle()}
            className="w-full h-10 bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg"
          >
            <Google className="w-4 h-4" />
            Entrar con Google
          </Button>

          <Typography as="p" emphasis="medium" className="text-[9px] text-zinc-600 text-center leading-relaxed px-2">
            Solo personal autorizado de Robótica UDP tiene acceso.
          </Typography>
        </div>
      </Card>
    </div>
  );
}
