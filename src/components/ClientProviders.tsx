'use client';

import { ReactNode, useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { CompetitionProvider } from '@/lib/context/CompetitionContext';
import { AuthProvider } from '@/lib/context/AuthContext';

/**
 * Wrapper de providers client-side.
 */
export function ClientProviders({ children }: { children: ReactNode }) {
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
      const asyncStoragePersister = createAsyncStoragePersister({
        storage: window.localStorage,
      });

      persistQueryClient({
        queryClient,
        persister: asyncStoragePersister,
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
    </QueryClientProvider>
  );
}
