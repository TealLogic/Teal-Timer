import React from 'react';
import { Timer as TimerType } from '../types';
import { getTimeRemaining } from '../utils/timeUtils';
import { Timer, Calendar, Clock, Watch, PartyPopper, Trash2, GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TimerCardProps {
  timer: TimerType;
  onClick: () => void;
  onDelete: () => void;
}

const themeIcons = {
  analog: Watch,
  digital: Clock,
  chronometer: Timer,
  'chronometer-analog': Watch,
  calendar: Calendar,
};

function TimerCard({ timer, onClick, onDelete }: TimerCardProps) {
  const showMilliseconds = timer.theme === 'chronometer' || timer.theme === 'chronometer-analog';
  const [timeLeft, setTimeLeft] = React.useState(getTimeRemaining(timer.targetDate, showMilliseconds));
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: timer.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  };
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeRemaining(timer.targetDate, showMilliseconds));
    }, showMilliseconds ? 16 : 1000);

    return () => clearInterval(interval);
  }, [timer.targetDate, showMilliseconds]);

  const IconComponent = themeIcons[timer.theme];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group"
    >
      <div
        onClick={onClick}
        className={`bg-black/5 rounded-lg p-6 shadow-lg cursor-pointer hover:shadow-glow transition-all duration-300 border border-teal-500/20 ${isDragging ? 'shadow-glow' : ''}`}
      >
        <div className="flex items-center gap-3 mb-4">
          <IconComponent className="w-6 h-6 text-teal-500" />
          <h2 className="text-xl font-semibold text-gray-100">
            {timer.name}
          </h2>
        </div>
        
        <p className="text-gray-100 mb-4 line-clamp-2">
          {timer.description}
        </p>

        <div className="text-lg font-semibold text-teal-500 flex items-center gap-2">
          {timeLeft.expired ? (
            <>
              <PartyPopper className="w-5 h-5" />
              <span>Completed</span>
            </>
          ) : (
            <span>{timeLeft.display}</span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute top-2 right-2 p-2 rounded-full bg-gray-700 opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-all duration-300"
        >
          <Trash2 className="w-4 h-4 text-white" />
        </button>

        <div
          {...attributes}
          {...listeners}
          className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing transition-all duration-300 text-teal-500/50 hover:text-teal-500"
        >
          <GripVertical className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

export default TimerCard