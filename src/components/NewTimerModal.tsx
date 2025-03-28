import React from 'react';
import { Timer } from '../types';
import { X } from 'lucide-react';

interface NewTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (timer: Timer) => void;
}

function NewTimerModal({ isOpen, onClose, onAdd }: NewTimerModalProps) {
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [targetDate, setTargetDate] = React.useState('');
  const [theme, setTheme] = React.useState<Timer['theme']>('digital');
  const dateInputRef = React.useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTimer: Timer = {
      id: crypto.randomUUID(),
      name,
      description,
      targetDate,
      theme,
    };

    onAdd(newTimer);
    onClose();
    
    // Reset form
    setName('');
    setDescription('');
    setTargetDate('');
    setTheme('digital');
  };

  const handleDateClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-white">
          New Timer
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal hover:shadow-glow transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal hover:shadow-glow transition-all duration-300"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Target Date
              </label>
              <div 
                className="relative cursor-pointer"
                onClick={handleDateClick}
              >
                <input
                  ref={dateInputRef}
                  type="datetime-local"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal hover:shadow-glow transition-all duration-300 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Theme
              </label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as Timer['theme'])}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal hover:shadow-glow transition-all duration-300"
              >
                <option value="digital">Digital</option>
                <option value="analog">Analog</option>
                <option value="chronometer">Chronometer</option>
                <option value="chronometer-analog">Chronometer Analog</option>
                <option value="calendar">Calendar</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-6 px-4 py-2 bg-teal text-white rounded-md hover:bg-teal-dark hover:shadow-glow-hover transition-all duration-300 flex items-center justify-center"
          >
            Create Timer
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewTimerModal