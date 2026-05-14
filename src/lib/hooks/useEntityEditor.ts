'use client';

import { useState, useEffect } from 'react';

/**
 * Hook genérico para gestionar la edición de entidades (equipos, tutores, etc.)
 * con soporte para cambios temporales, detección de suciedad (dirty state) y guardado.
 */
export function useEntityEditor<T>(
  initialData: T,
  onSave: (data: T) => Promise<any>
) {
  const [tempData, setTempData] = useState<T>(initialData);
  const [isSaving, setIsSaving] = useState(false);

  // Sincronizar con cambios externos en la data inicial
  useEffect(() => {
    setTempData(initialData);
  }, [initialData]);

  const hasChanges = JSON.stringify(tempData) !== JSON.stringify(initialData);

  const reset = () => {
    setTempData(initialData);
  };

  const save = async () => {
    if (!hasChanges || isSaving) return;
    
    setIsSaving(true);
    try {
      await onSave(tempData);
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = <K extends keyof T>(field: K, value: T[K]) => {
    setTempData(prev => ({ ...prev, [field]: value }));
  };

  return {
    tempData,
    updateField,
    hasChanges,
    isSaving,
    save,
    reset,
    setTempData
  };
}
