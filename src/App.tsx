import React from 'react';
import { Moon, Sun, Timer } from 'lucide-react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Timer as TimerType } from './types';
import TimerGrid from './components/TimerGrid';
import TimerView from './components/TimerView';

function App() {
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', true);
  const [timers, setTimers] = useLocalStorage<TimerType[]>('timers', []);
  const [selectedTimer, setSelectedTimer] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleAddTimer = (timer: TimerType) => {
    setTimers([...timers, timer]);
  };

  const handleDeleteTimer = (id: string) => {
    setTimers(timers.filter(timer => timer.id !== id));
    setSelectedTimer(null);
  };

  const handleReorderTimers = (reorderedTimers: TimerType[]) => {
    setTimers(reorderedTimers);
  };

  return (
    <div className="min-h-screen min-w-screen bg-light-bg dark:bg-gray-950 transition-colors duration-200 flex flex-col">
      <header className="fixed top-0 right-0 p-4 z-50">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full bg-black/5 hover:bg-black/10 transition-all duration-300"
        >
          {darkMode ? (
            <Sun className="w-6 h-6 text-teal-500 hover:text-teal-400" />
          ) : (
            <Moon className="w-6 h-6 text-teal-500 hover:text-teal-400" />
          )}
        </button>
      </header>

      <main className="container mx-auto px-4 pt-16 flex-grow pb-24">
        <div className="flex flex-col items-center justify-center mb-8">
          <Timer className="w-14 h-14 text-teal-500 mb-4" />
          <h1 className="text-5xl font-bold text-teal-500 text-shadow-glow">
            Teal Timer
          </h1>
        </div>

        {selectedTimer ? (
          <TimerView
            timerId={selectedTimer}
            timers={timers}
            onBack={() => setSelectedTimer(null)}
            onUpdate={(updatedTimer) => {
              setTimers(timers.map(t => 
                t.id === updatedTimer.id ? updatedTimer : t
              ));
            }}
            onDelete={handleDeleteTimer}
          />
        ) : (
          <TimerGrid
            timers={timers}
            onSelect={setSelectedTimer}
            onAdd={handleAddTimer}
            onDelete={handleDeleteTimer}
            onReorder={handleReorderTimers}
          />
        )}
      </main>
    </div>
  );
}

export default App