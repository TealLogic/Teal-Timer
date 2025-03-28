import React from 'react';
import { getTimeRemaining } from '../../utils/timeUtils';
import { PartyPopper } from 'lucide-react';

interface CalendarTimerProps {
  targetDate: string;
}

function CalendarTimer({ targetDate }: CalendarTimerProps) {
  const [timeLeft, setTimeLeft] = React.useState(getTimeRemaining(targetDate, false));

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeRemaining(targetDate, false));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (timeLeft.expired) {
    return (
      <div className="text-6xl font-bold text-teal flex items-center justify-center gap-4">
        <PartyPopper className="w-12 h-12" />
        Completed
      </div>
    );
  }

  const targetDateTime = new Date(targetDate);
  const month = targetDateTime.toLocaleString('default', { month: 'short' });
  const day = targetDateTime.getDate();

  return (
    <div className="flex justify-center">
      <div className="w-64 bg-gray-800 rounded-lg overflow-hidden shadow-lg border-2 border-teal hover:shadow-glow transition-all duration-300">
        <div className="bg-teal text-white text-center py-2">
          {month}
        </div>
        <div className="text-7xl font-bold text-center py-8 text-white">
          {day}
        </div>
        <div className="bg-gray-700 p-4 text-center text-xl text-white">
          {timeLeft.display}
        </div>
      </div>
    </div>
  );
}

export default CalendarTimer