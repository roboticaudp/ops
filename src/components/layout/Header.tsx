'use client';

import { UserMenu } from './UserMenu';

export function Header() {
  return (
    <header className="w-full h-[73px] flex items-center justify-between px-8 bg-zinc-950 border-b border-zinc-800 z-50">
      <span className="text-xl font-bold uppercase tracking-tighter text-zinc-100">
        OPS
      </span>

      <UserMenu />
    </header>
  );
}
