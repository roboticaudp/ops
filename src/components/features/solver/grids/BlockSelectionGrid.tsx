'use client';

import type { Block } from '@/types';
import { CalendarGrid } from '@/components/ui';
import { SelectionGridCell } from '@/components/features/solver/grids/cells/SelectionGridCell';

interface BlockSelectionGridProps {
  selected: string[];
  onChange: (ids: string[]) => void;
}

export function BlockSelectionGrid({ selected, onChange }: BlockSelectionGridProps) {
  const toggleBlock = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter(b => b !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <CalendarGrid
      renderBlock={(block: Block) => (
        <SelectionGridCell
          key={block.id}
          block={block}
          isSelected={selected.includes(block.id)}
          onToggle={toggleBlock}
        />
      )}
    />
  );
}
