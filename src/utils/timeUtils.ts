interface TimeRemaining {
  expired: boolean;
  display: string;
  raw: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
  };
}

export function getTimeRemaining(targetDate: string, showMilliseconds: boolean = false): TimeRemaining {
  const total = Date.parse(targetDate) - Date.now();
  const expired = total <= 0;

  if (expired) {
    return {
      expired: true,
      display: 'Completed',
      raw: { days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 },
    };
  }

  const milliseconds = Math.floor(total % 1000);
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  let display = '';
  if (days > 0) display += `${days}d `;
  if (hours > 0 || days > 0) display += `${hours}h `;
  if (minutes > 0 || hours > 0 || days > 0) display += `${minutes}m `;
  display += showMilliseconds ? 
    `${seconds}.${String(milliseconds).padStart(3, '0')}s` :
    `${seconds}s`;

  return {
    expired: false,
    display: display.trim(),
    raw: { days, hours, minutes, seconds, milliseconds },
  };
}