'use client';

import { useMemo } from 'react';
import { useCompetition } from '@/lib/context/CompetitionContext';
import { Skeleton } from '@/components/ui';

export function YearsBar() {
  const { competitions, activeCompetition, selectCompetition, loading } = useCompetition();

  const sorted = useMemo(() =>
    [...competitions].sort((a, b) => a.year - b.year),
    [competitions]
  );

  return (
    <div className="w-full h-[65px] flex items-center bg-zinc-950/50 backdrop-blur-xl border-b border-zinc-900">
      <div className="px-4 md:px-8 w-full flex items-center justify-start md:justify-center gap-4">
        <span className="hidden md:inline-block text-xs font-bold uppercase opacity-[0.87] flex-shrink-0">Versiones</span>
        <div className="flex items-center gap-1 max-w-full md:max-w-4xl overflow-x-auto overflow-y-hidden no-scrollbar">
          {loading ? (
            <Skeleton variant="years" />
          ) : (
            sorted.map((comp) => {
              const isActive = comp.id === activeCompetition?.id;
              const wasHeld = comp.was_held;

              return (
                <button
                  key={comp.id}
                  onClick={() => wasHeld && selectCompetition(comp.id)}
                  disabled={!wasHeld}
                  className={`flex flex-col px-3 md:px-4 py-1.5 md:py-2 rounded-lg transition-all text-left relative group flex-shrink-0 ${isActive
                    ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                    : wasHeld
                      ? 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                      : 'opacity-20 cursor-not-allowed'
                    }`}
                >
                  <span className="text-[10px] md:text-xs font-bold opacity-[0.87]">{comp.year}</span>
                  <span className="text-[10px] md:text-xs font-semibold opacity-60 truncate max-w-[80px] md:max-w-none">{wasHeld ? comp.name : 'No realizado'}</span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
