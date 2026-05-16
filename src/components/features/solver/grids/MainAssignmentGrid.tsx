'use client';

import { useState } from 'react';
import type { Assignment, Block } from '@/types';
import { Calendar, Badge, CalendarBlock } from '@/components/ui';
import { AssignmentItem } from '@/components/features/scheduling/AssignmentItem';

interface MainAssignmentGridProps {
  assignments: Assignment[];
  getTeamName: (id: string) => string;
  getTutorName: (id: string) => string;
  onToggleFixed: (assignment: Assignment) => void;
  onMoveAssignment?: (assignment: Assignment, newBlockId: string) => void;
}

export function MainAssignmentGrid({
  assignments,
  getTeamName,
  getTutorName,
  onToggleFixed,
  onMoveAssignment
}: MainAssignmentGridProps) {
  const [draggedAssignment, setDraggedAssignment] = useState<Assignment | null>(null);
  const [dragOverBlockId, setDragOverBlockId] = useState<string | null>(null);

  return (
    <Calendar
      renderBlock={(block: Block) => {
        const blockAssignments = assignments.filter(a => a.block_id === block.id);
        const isFull = blockAssignments.length >= 4;
        const hasAssignments = blockAssignments.length > 0;
        const isDragging = !!draggedAssignment;
        const isOver = dragOverBlockId === block.id;

        let variant: 'active' | 'inactive' | 'highlight' = hasAssignments ? 'active' : 'inactive';
        if (isDragging && !hasAssignments) {
          variant = 'highlight';
        }

        return (
          <CalendarBlock
            key={block.id}
            time={block.startTime}
            variant={variant}
            className={isOver ? 'border-blue-500 bg-blue-500/15 ring-2 ring-blue-500/40 shadow-lg shadow-blue-500/10 scale-[1.01] transition-all duration-200' : ''}
            badge={<Badge color={isFull ? (blockAssignments.length > 4 ? 'red' : 'green') : 'blue'}>{blockAssignments.length}/4</Badge>}
            onDragOver={(e) => {
              e.preventDefault();
              if (dragOverBlockId !== block.id) {
                setDragOverBlockId(block.id);
              }
            }}
            onDragLeave={(e) => {
              // Evitar falsos disparos de onDragLeave al pasar sobre elementos hijos (AssignmentItem)
              const relatedNode = e.relatedTarget as Node | null;
              if (relatedNode && e.currentTarget.contains(relatedNode)) {
                return;
              }
              if (dragOverBlockId === block.id) {
                setDragOverBlockId(null);
              }
            }}
            onDrop={(e) => {
              e.preventDefault();
              setDragOverBlockId(null);
              if (draggedAssignment && draggedAssignment.block_id !== block.id) {
                onMoveAssignment?.(draggedAssignment, block.id);
              }
              setDraggedAssignment(null);
            }}
          >
            <div className="space-y-0.5">
              {blockAssignments.map((a, i) => (
                <AssignmentItem
                  key={i}
                  teamName={getTeamName(a.team_id)}
                  tutorName={getTutorName(a.tutor_id)}
                  isFixed={a.is_fixed}
                  onToggle={() => onToggleFixed(a)}
                  draggable={true}
                  onDragStart={(e) => {
                    e.stopPropagation();
                    setDraggedAssignment(a);
                  }}
                  onDragEnd={() => {
                    setDraggedAssignment(null);
                    setDragOverBlockId(null);
                  }}
                />
              ))}
              {!hasAssignments && (
                <div className="py-4 text-center border border-dashed border-zinc-800/50 rounded-lg">
                  <p className="text-xs font-bold text-zinc-700">
                    {isDragging ? 'Soltar aquí' : 'Libre'}
                  </p>
                </div>
              )}
            </div>
          </CalendarBlock>
        );
      }}
    />
  );
}

