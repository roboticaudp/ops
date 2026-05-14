'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LucideIcon, Calendar, UserCheck, Users, Trophy } from 'lucide-react';
import { APP_ROUTES } from '@/lib/constants';

interface SidebarLabelProps {
  children: React.ReactNode;
}

function SidebarLabel({ children }: SidebarLabelProps) {
  return (
    <div className="px-3 mb-1">
      <span className="text-xs font-bold opacity-60">
        {children}
      </span>
    </div>
  );
}

interface SidebarLinkProps {
  href: string;
  label: string;
  Icon: LucideIcon;
  isActive?: boolean;
}

function SidebarLink({ href, label, Icon, isActive }: SidebarLinkProps) {
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

const MODULE_LINKS = [
  { href: APP_ROUTES.HOME, label: 'Scheduling', Icon: Calendar },
  { href: APP_ROUTES.TUTORS, label: 'Tutores', Icon: UserCheck },
  { href: APP_ROUTES.TEAMS, label: 'Equipos', Icon: Users },
];

const ADMIN_LINKS = [
  { href: APP_ROUTES.SETTINGS.USERS, label: 'Lista Blanca', Icon: Users },
  { href: APP_ROUTES.SETTINGS.COMPETITIONS, label: 'Ediciones', Icon: Trophy },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 flex-shrink-0 sticky top-36 h-fit">
      <nav aria-label="Navegación Principal">
        <div className="flex flex-col gap-8">
          <div>
            <SidebarLabel>Módulos</SidebarLabel>
            <ul className="flex flex-col">
              {MODULE_LINKS.map((link) => (
                <li key={link.href}>
                  <SidebarLink
                    href={link.href}
                    label={link.label}
                    Icon={link.Icon}
                    isActive={pathname === link.href}
                  />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <SidebarLabel>Administración</SidebarLabel>
            <ul className="flex flex-col">
              {ADMIN_LINKS.map((link) => (
                <li key={link.href}>
                  <SidebarLink
                    href={link.href}
                    label={link.label}
                    Icon={link.Icon}
                    isActive={pathname === link.href}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </aside>
  );
}
