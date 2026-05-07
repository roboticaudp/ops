'use client';

import { usePathname } from 'next/navigation';
import { Calendar, UserCheck, Users, Trophy } from 'lucide-react';
import { SidebarLabel, SidebarLink } from '@/components/common';
import { APP_ROUTES } from '@/lib/constants';

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
    <aside className="w-56 flex-shrink-0 sticky top-40 h-fit">
      <nav className="flex flex-col gap-8">
        <section className="space-y-1">
          <SidebarLabel>Módulos</SidebarLabel>
          <div className="flex flex-col">
            {MODULE_LINKS.map((link) => (
              <SidebarLink
                key={link.href}
                href={link.href}
                label={link.label}
                Icon={link.Icon}
                isActive={pathname === link.href}
              />
            ))}
          </div>
        </section>

        <section className="space-y-1">
          <SidebarLabel>Administración</SidebarLabel>
          <div className="flex flex-col">
            {ADMIN_LINKS.map((link) => (
              <SidebarLink
                key={link.href}
                href={link.href}
                label={link.label}
                Icon={link.Icon}
                isActive={pathname === link.href}
              />
            ))}
          </div>
        </section>
      </nav>
    </aside>
  );
}
