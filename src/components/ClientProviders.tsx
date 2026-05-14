'use client';

import { ReactNode, useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
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
        gcTime: 1000 * 60 * 60 * 24, // 24 horas para persistencia
        retry: 1,
      },
    },
  }));

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const localStoragePersister = createSyncStoragePersister({
        storage: window.localStorage,
      });

      persistQueryClient({
        queryClient,
        persister: localStoragePersister,
        maxAge: 1000 * 60 * 60 * 24, // 24 horas
      });
    }
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CompetitionProvider>
          {children}
        </CompetitionProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
