'use client';

import { Competition } from '@/types';
import { UI } from '@/styles/ui';
import { Typography } from '@/components/ui';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings, Calendar, UserCheck, Users, ChevronRight } from 'lucide-react';

interface TimelineProps {
  competitions: Competition[];
  activeId?: string;
  onSelect: (id: string) => void;
}

const CONTEXT_LINKS = [
  { href: '/', label: 'Scheduling', Icon: Calendar },
  { href: '/tutors', label: 'Tutores', Icon: UserCheck },
  { href: '/teams', label: 'Equipos', Icon: Users },
];

export function Timeline({ competitions, activeId, onSelect }: TimelineProps) {
  const pathname = usePathname();
  const sorted = [...competitions].sort((a, b) => b.year - a.year);

  return (
    <div className="flex flex-col gap-6 sticky top-24">
      <div className={`${UI.card} p-2 flex flex-col gap-1`}>
        <Typography as="p" emphasis="medium" className="px-3 py-2">Módulos</Typography>
        {CONTEXT_LINKS.map((link) => {
          const isActive = pathname === link.href;
          const { Icon } = link;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all ${isActive
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'
                }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={16} className={isActive ? 'text-blue-400' : ''} />
                <span className="text-sm font-bold">{link.label}</span>
              </div>
              {isActive && <ChevronRight size={12} className="text-zinc-600" />}
            </Link>
          );
        })}
      </div>

      <div className={`${UI.card} flex flex-col gap-4`}>
        <Typography as="p" emphasis="medium" className="px-2">Historial</Typography>

        <div className={`space-y-1 max-h-[30vh] ${UI.scrollbar}`}>
          {sorted.map((comp) => (
            <TimelineItem
              key={comp.id}
              competition={comp}
              isActive={comp.id === activeId}
              onSelect={onSelect}
            />
          ))}
        </div>

        <Link href="/competitions" className={UI.buttonPrimary + " text-xs py-2 text-center flex items-center justify-center gap-2"}>
          <Settings size={14} />
          <span>Configurar Años</span>
        </Link>
      </div>
    </div>
  );
}

interface TimelineItemProps {
  competition: Competition;
  isActive: boolean;
  onSelect: (id: string) => void;
}

function TimelineItem({ competition, isActive, onSelect }: TimelineItemProps) {
  const wasHeld = competition.was_held;
  return (
    <button
      onClick={() => wasHeld && onSelect(competition.id)}
      disabled={!wasHeld}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all text-left ${isActive ? 'bg-blue-600 text-white shadow-lg' : wasHeld ? 'hover:bg-zinc-800 text-zinc-300' : 'opacity-30'
        }`}
    >
      <div className="flex flex-col">
        <span className="text-[10px] font-mono font-bold opacity-70">{competition.year}</span>
        <span className="text-sm font-bold truncate max-w-[120px]">{wasHeld ? competition.name : 'No realizada'}</span>
      </div>
      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
    </button>
  );
}
