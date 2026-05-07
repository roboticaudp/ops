'use client';

import React from 'react';

interface EntitySidebarProps {
  children: React.ReactNode;
  className?: string;
}

export function EntitySidebar({ children, className = "" }: EntitySidebarProps) {
  return (
    <div className={`w-full xl:w-72 px-4 py-6 flex flex-col justify-between ${className}`}>
      {children}
    </div>
  );
}
