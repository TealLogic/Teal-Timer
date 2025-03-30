export interface Timer {
  id: string;
  name: string;
  description: string;
  targetDate: string;
  theme: TimerTheme;
  themeColor?: string;
  glowIntensity?: number;
}

export type TimerTheme = 'analog' | 'digital' | 'chronometer' | 'chronometer-analog' | 'calendar';

export interface TimeRemaining {
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