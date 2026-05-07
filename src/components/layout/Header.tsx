'use client';

import { UserMenu } from './UserMenu';

export function Header() {
  return (
    <header className="w-full flex items-center justify-between px-8 py-4 bg-zinc-950 border-b border-zinc-800 fixed top-0 left-0 z-50">
      <span className="text-xl font-bold uppercase tracking-tighter text-zinc-100">
        OPS
      </span>

      <UserMenu />
    </header>
  );
}
