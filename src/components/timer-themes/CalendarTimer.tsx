import React from 'react';
import { getTimeRemaining } from '../../utils/timeUtils';
import { PartyPopper } from 'lucide-react';

interface CalendarTimerProps {
  targetDate: string;
  themeColor: string;
  glowIntensity: number;
}

function CalendarTimer({ targetDate, themeColor, glowIntensity }: CalendarTimerProps) {
  const [timeLeft, setTimeLeft] = React.useState(getTimeRemaining(targetDate, false));

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeRemaining(targetDate, false));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (timeLeft.expired) {
    return (
      <div className="text-6xl font-bold flex items-center justify-center gap-4" style={{ color: themeColor }}>
        <PartyPopper className="w-12 h-12" />
        Completed
      </div>
    );
  }

  const targetDateTime = new Date(targetDate);
  const month = targetDateTime.toLocaleString('default', { month: 'short' });
  const day = targetDateTime.getDate();

  const glowStyle = {
    filter: `drop-shadow(0 0 ${glowIntensity * 10}px ${themeColor})`,
  };

  return (
    <div className="flex justify-center">
      <div 
        className="w-64 bg-gray-800 rounded-lg overflow-hidden shadow-lg border-2 transition-all duration-300"
        style={{ 
          borderColor: themeColor,
          boxShadow: `0 0 ${glowIntensity * 20}px ${themeColor}33`
        }}
      >
        <div 
          className="text-white text-center py-2"
          style={{ backgroundColor: themeColor }}
        >
          {month}
        </div>
        <div 
          className="text-7xl font-bold text-center py-8 text-white"
          style={{ color: themeColor, ...glowStyle }}
        >
          {day}
        </div>
        <div 
          className="bg-gray-700 p-4 text-center text-xl"
          style={{ color: themeColor }}
        >
          {timeLeft.display}
        </div>
      </div>
    </div>
  );
}

export default CalendarTimer