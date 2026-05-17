import { UserMenu } from './UserMenu';
import { Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="w-full h-[73px] flex items-center justify-between px-8 bg-zinc-950 border-b border-zinc-900 z-50">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded-lg transition-colors"
          aria-label="Abrir menú"
        >
          <Menu size={20} />
        </button>
        <span className="text-xl font-bold uppercase tracking-tighter text-zinc-100">
          OPS
        </span>
      </div>

      <UserMenu />
    </header>
  );
}
