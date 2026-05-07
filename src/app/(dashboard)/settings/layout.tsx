'use client';

import { Typography } from '@/components/ui';
import { Settings as SettingsIcon } from 'lucide-react';
import { APP_ROUTES } from '@/lib/constants';


export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-10">
      <header className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-blue-400">
          <SettingsIcon size={28} />
        </div>
        <div>
          <Typography as="h1" className="text-3xl font-bold tracking-tight">Configuración</Typography>
          <Typography as="p" emphasis="medium">
            Gestión de accesos y parámetros globales del sistema.
          </Typography>
        </div>
      </header>

      <main className="min-w-0">
        {children}
      </main>
    </div>
  );
}
