'use client';

import { Save, RefreshCcw } from 'lucide-react';

interface ActionButtonsProps {
  onSave: () => void;
  onReset: () => void;
  loading?: boolean;
  saveLabel?: string;
  resetLabel?: string;
}

export function ActionButtons({
  onSave,
  onReset,
  loading,
  saveLabel = "Guardar Cambios",
  resetLabel = "Descartar"
}: ActionButtonsProps) {
  return (
    <div className="mt-8 flex flex-col gap-2 animate-in slide-in-from-bottom-2 duration-300">
      <button
        disabled={loading}
        onClick={onSave}
        className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98] disabled:opacity-50"
      >
        <Save size={14} />
        <span>{loading ? 'Guardando...' : saveLabel}</span>
      </button>
      <button
        disabled={loading}
        onClick={onReset}
        className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
      >
        <RefreshCcw size={14} />
        <span>{resetLabel}</span>
      </button>
    </div>
  );
}
