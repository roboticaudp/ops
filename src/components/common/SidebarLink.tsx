'use client';

import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface SidebarLinkProps {
  href: string;
  label: string;
  Icon: LucideIcon;
  isActive?: boolean;
}

export function SidebarLink({ href, label, Icon, isActive }: SidebarLinkProps) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-2.5 px-4 py-2 rounded-lg transition-all duration-200 ${isActive
        ? 'bg-zinc-800/40 opacity-[0.87]'
        : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30 opacity-60'
        }`}
    >
      <Icon
        size={16}
        strokeWidth={isActive ? 2.5 : 2}
      />

      <span className="text-xs font-bold">
        {label}
      </span>
    </Link>
  );
}
