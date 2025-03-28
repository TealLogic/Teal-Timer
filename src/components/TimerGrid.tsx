import React from 'react';
import { Plus } from 'lucide-react';
import { Timer } from '../types';
import TimerCard from './TimerCard';
import NewTimerModal from './NewTimerModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';

interface TimerGridProps {
  timers: Timer[];
  onSelect: (id: string) => void;
  onAdd: (timer: Timer) => void;
  onDelete: (id: string) => void;
  onReorder: (timers: Timer[]) => void;
}

function TimerGrid({ timers, onSelect, onAdd, onDelete, onReorder }: TimerGridProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [deleteModal, setDeleteModal] = React.useState<{ isOpen: boolean; timer: Timer | null }>({
    isOpen: false,
    timer: null,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = timers.findIndex((timer) => timer.id === active.id);
      const newIndex = timers.findIndex((timer) => timer.id === over.id);
      onReorder(arrayMove(timers, oldIndex, newIndex));
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={timers.map(t => t.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {timers.map((timer) => (
              <TimerCard
                key={timer.id}
                timer={timer}
                onClick={() => onSelect(timer.id)}
                onDelete={() => setDeleteModal({ isOpen: true, timer })}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 p-4 rounded-full bg-teal text-gray-900 hover:bg-teal-dark hover:shadow-glow-hover transition-all duration-300"
      >
        <Plus className="w-6 h-6" />
      </button>

      <NewTimerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={onAdd}
      />

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, timer: null })}
        onConfirm={() => deleteModal.timer && onDelete(deleteModal.timer.id)}
        itemName={deleteModal.timer?.name || ''}
      />
    </div>
  );
}

export default TimerGrid