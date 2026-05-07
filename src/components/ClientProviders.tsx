'use client';

import { ReactNode } from 'react';
import { CompetitionProvider } from '@/lib/context/CompetitionContext';
import { AuthProvider } from '@/lib/context/AuthContext';

/**
 * Wrapper de providers client-side.
 * Separado del RootLayout para que el layout pueda ser un Server Component,
 * habilitando SSR y optimizaciones de caché de Vercel.
 */
export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CompetitionProvider>
        {children}
      </CompetitionProvider>
    </AuthProvider>
  );
}
