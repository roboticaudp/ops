'use client';

import React, { useState } from 'react';
import { UI } from '@/styles/ui';
import { Card, Typography, Button } from '@/components/ui';
import { X } from 'lucide-react';

interface ExpandableFormProps {
  triggerIcon: React.ReactNode;
  triggerText: string;
  formTitle: string;
  onSubmit: () => Promise<boolean>;
  submitText: string;
  children: React.ReactNode;
}

export function ExpandableForm({ 
  triggerIcon, 
  triggerText, 
  formTitle, 
  onSubmit, 
  submitText, 
  children 
}: ExpandableFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await onSubmit();
    if (success) {
      setIsOpen(false);
    }
    setLoading(false);
  };

  if (!isOpen) {
    return (
      <Button 
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="w-full py-4"
      >
        {triggerIcon}
        <span>{triggerText}</span>
      </Button>
    );
  }

  return (
    <Card className="border-blue-500/30 shadow-xl shadow-blue-950/20">
      <div className="flex justify-between items-center mb-6">
        <Typography as="h3">{formTitle}</Typography>
        <button 
          onClick={() => setIsOpen(false)} 
          className="text-zinc-500 hover:text-white transition-colors"
          type="button"
        >
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {children}

        <div className="pt-4 flex gap-3">
          <Button 
            type="submit" 
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Guardando...' : submitText}
          </Button>
          <Button 
            type="button" 
            variant="secondary"
            onClick={() => setIsOpen(false)}
            className="px-6"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  );
}
