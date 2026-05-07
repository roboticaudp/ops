'use client';

import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface CounterProps {
  value: number;
  onChange: (newValue: number) => void;
  label?: string;
  min?: number;
  max?: number;
}

export function Counter({ value, onChange, label, min = 1, max }: CounterProps) {
  return (
    <div className="flex items-center justify-between">
      <button 
        onClick={() => onChange(Math.max(min, value - 1))}
        className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-600 text-zinc-400 transition-all active:scale-90"
      >
        <Minus size={14} />
      </button>
      <div className="text-center">
        <p className="text-2xl font-mono font-black text-blue-400 leading-none">{value}</p>
        {label && <p className="text-[8px] text-zinc-500 font-bold uppercase mt-1 tracking-widest">{label}</p>}
      </div>
      <button 
        onClick={() => onChange(max ? Math.min(max, value + 1) : value + 1)}
        className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-600 text-zinc-400 transition-all active:scale-90"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
