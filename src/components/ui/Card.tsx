'use client';

import React from 'react';
import { UI } from '@/styles/ui';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`${UI.card} ${className}`}>
      {children}
    </div>
  );
}
