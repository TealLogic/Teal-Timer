import React from 'react';
import { getTimeRemaining } from '../../utils/timeUtils';
import { PartyPopper } from 'lucide-react';

interface AnalogTimerProps {
  targetDate: string;
  themeColor: string;
  glowIntensity: number;
}

function AnalogTimer({ targetDate, themeColor, glowIntensity }: AnalogTimerProps) {
  const [timeLeft, setTimeLeft] = React.useState(getTimeRemaining(targetDate, false));
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const displaySize = 300;
  const canvasSize = displaySize * 2; // Double size for better quality

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeRemaining(targetDate, false));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true, antialias: true });
    if (!ctx) return;

    // Enable high-quality rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Clear canvas
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // Set dimensions
    const centerX = canvasSize / 2;
    const centerY = canvasSize / 2;
    const radius = Math.min(centerX, centerY) - 20;

    // Draw clock face
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = themeColor;
    ctx.lineWidth = 6;
    ctx.stroke();

    if (glowIntensity > 0) {
      ctx.shadowColor = themeColor;
      ctx.shadowBlur = glowIntensity * 20;
    }

    // Draw hour markers
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * 2 * Math.PI;
      const markerLength = i % 3 === 0 ? 30 : 20;
      
      ctx.beginPath();
      ctx.moveTo(
        centerX + (radius - markerLength) * Math.cos(angle - Math.PI / 2),
        centerY + (radius - markerLength) * Math.sin(angle - Math.PI / 2)
      );
      ctx.lineTo(
        centerX + radius * Math.cos(angle - Math.PI / 2),
        centerY + radius * Math.sin(angle - Math.PI / 2)
      );
      ctx.strokeStyle = themeColor;
      ctx.lineWidth = 4;
      ctx.stroke();
    }

    // Calculate angles for each hand
    const hoursAngle = ((timeLeft.raw.hours % 12) / 12) * 2 * Math.PI;
    const minutesAngle = (timeLeft.raw.minutes / 60) * 2 * Math.PI;
    const secondsAngle = (timeLeft.raw.seconds / 60) * 2 * Math.PI;

    // Draw hour hand
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + radius * 0.5 * Math.cos(hoursAngle - Math.PI / 2),
      centerY + radius * 0.5 * Math.sin(hoursAngle - Math.PI / 2)
    );
    ctx.strokeStyle = themeColor;
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Draw minute hand
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + radius * 0.7 * Math.cos(minutesAngle - Math.PI / 2),
      centerY + radius * 0.7 * Math.sin(minutesAngle - Math.PI / 2)
    );
    ctx.strokeStyle = themeColor;
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Draw second hand
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + radius * 0.9 * Math.cos(secondsAngle - Math.PI / 2),
      centerY + radius * 0.9 * Math.sin(secondsAngle - Math.PI / 2)
    );
    ctx.strokeStyle = themeColor;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Draw center dot
    ctx.beginPath();
    ctx.arc(centerX, centerY, 10, 0, 2 * Math.PI);
    ctx.fillStyle = themeColor;
    ctx.fill();
  }, [timeLeft, themeColor, glowIntensity]);

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
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={canvasSize}
        height={canvasSize}
        style={{ width: displaySize, height: displaySize }}
        className="mb-4"
      />
      <div 
        className="text-2xl font-bold"
        style={{ color: themeColor, ...glowStyle }}
      >
        {timeLeft.display}
      </div>
    </div>
  );
}

export default AnalogTimer