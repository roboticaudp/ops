'use client';

import React from 'react';
import { useCompetition } from '@/lib/context/CompetitionContext';
import { Skeleton } from '@/components/ui';

export function PageLoader({ children }: { children: React.ReactNode }) {
  const { loading } = useCompetition();

  if (loading) {
    return (
      <div className="space-y-12 animate-in fade-in duration-500">
        <Skeleton variant="header" />
        <Skeleton variant="calendar" />
      </div>
    );
  }

  return <>{children}</>;
}
