'use client';

import React from 'react';

interface SidebarLabelProps {
  children: React.ReactNode;
}

export function SidebarLabel({ children }: SidebarLabelProps) {
  return (
    <div className="px-3 mb-1">
      <span className="text-xs font-bold opacity-60">
        {children}
      </span>
    </div>
  );
}
