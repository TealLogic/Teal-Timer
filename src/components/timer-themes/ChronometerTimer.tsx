import React from 'react';
import { getTimeRemaining } from '../../utils/timeUtils';
import { PartyPopper } from 'lucide-react';

interface ChronometerTimerProps {
  targetDate: string;
}

function ChronometerTimer({ targetDate }: ChronometerTimerProps) {
  const [timeLeft, setTimeLeft] = React.useState(getTimeRemaining(targetDate));

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeRemaining(targetDate));
    }, 16); // ~60fps update rate

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

  const formatNumber = (num: number, digits: number = 2) => num.toString().padStart(digits, '0');

  return (
    <div className="flex justify-center">
      <div className="bg-gray-900 p-8 rounded-xl shadow-inner hover:shadow-glow transition-all duration-300">
        <div className="font-mono text-6xl text-teal tracking-wider">
          {`${formatNumber(timeLeft.raw.days)}:${formatNumber(timeLeft.raw.hours)}:${formatNumber(timeLeft.raw.minutes)}:${formatNumber(timeLeft.raw.seconds)}.${formatNumber(timeLeft.raw.milliseconds, 3)}`}
        </div>
      </div>
    </div>
  );
}

export default ChronometerTimer