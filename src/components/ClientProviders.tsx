'use client';

import { ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CompetitionProvider } from '@/lib/context/CompetitionContext';
import { AuthProvider } from '@/lib/context/AuthContext';

/**
 * Wrapper de providers client-side.
 * Separado del RootLayout para que el layout pueda ser un Server Component,
 * habilitando SSR y optimizaciones de caché de Vercel.
 */
export function ClientProviders({ children }: { children: ReactNode }) {
  // Creamos el QueryClient con un estado para que no se resetee en re-renders
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutos de caché por defecto
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CompetitionProvider>
          {children}
        </CompetitionProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
