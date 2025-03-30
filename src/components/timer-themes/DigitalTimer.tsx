import React from 'react';
import { getTimeRemaining } from '../../utils/timeUtils';
import { PartyPopper } from 'lucide-react';

interface DigitalTimerProps {
  targetDate: string;
  themeColor: string;
  glowIntensity: number;
}

function DigitalTimer({ targetDate, themeColor, glowIntensity }: DigitalTimerProps) {
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

  const glowStyle = {
    filter: `drop-shadow(0 0 ${glowIntensity * 10}px ${themeColor})`,
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Object.entries(timeLeft.raw).map(([unit, value]) => {
        if (unit === 'milliseconds') return null;
        return (
          <div
            key={unit}
            className="bg-gray-700 p-6 rounded-lg text-center transition-all duration-300"
            style={{
              boxShadow: `0 0 ${glowIntensity * 20}px ${themeColor}33`,
            }}
          >
            <div 
              className="text-5xl font-bold mb-2"
              style={{ color: themeColor, ...glowStyle }}
            >
              {value}
            </div>
            <div className="text-gray-300 text-lg capitalize">
              {unit}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default DigitalTimer