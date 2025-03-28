import React from 'react';
import { ArrowLeft, Camera, Edit, Save, Trash2, X } from 'lucide-react';
import { Timer } from '../types';
import { getTimeRemaining } from '../utils/timeUtils';
import DigitalTimer from './timer-themes/DigitalTimer';
import AnalogTimer from './timer-themes/AnalogTimer';
import ChronometerTimer from './timer-themes/ChronometerTimer';
import ChronometerAnalogTimer from './timer-themes/ChronometerAnalogTimer';
import CalendarTimer from './timer-themes/CalendarTimer';
import DeleteConfirmModal from './DeleteConfirmModal';

interface TimerViewProps {
  timerId: string;
  timers: Timer[];
  onBack: () => void;
  onUpdate: (timer: Timer) => void;
  onDelete: (id: string) => void;
}

function TimerView({ timerId, timers, onBack, onUpdate, onDelete }: TimerViewProps) {
  const timer = timers.find((t) => t.id === timerId);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedTimer, setEditedTimer] = React.useState(timer);
  const [deleteModal, setDeleteModal] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  if (!timer) return null;

  const handleSave = () => {
    if (editedTimer) {
      onUpdate(editedTimer);
      setIsEditing(false);
    }
  };

  const handleScreenshot = async () => {
    if (!containerRef.current) return;
    
    try {
      const { toPng } = await import('html-to-image');

      // Load the font first
      const font = await new FontFace(
        'Varela Round',
        'url(https://fonts.gstatic.com/s/varelaround/v20/w8gdH283Tvk__Lua32TysjIfp8uP.woff2)'
      ).load();
      
      document.fonts.add(font);
      await document.fonts.ready;

      const dataUrl = await toPng(containerRef.current, {
        quality: 1.0,
        pixelRatio: 3,
        backgroundColor: document.documentElement.classList.contains('dark') ? 'rgb(3, 7, 18)' : '#ffffff',
        fontEmbedCSS: `
          @font-face {
            font-family: 'Varela Round';
            font-style: normal;
            font-weight: 400;
            src: url(https://fonts.gstatic.com/s/varelaround/v20/w8gdH283Tvk__Lua32TysjIfp8uP.woff2) format('woff2');
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
          }
        `,
        canvasWidth: containerRef.current.offsetWidth * 2,
        canvasHeight: containerRef.current.offsetHeight * 2,
        style: {
          fontFamily: "'Varela Round', sans-serif",
        }
      });
      
      const link = document.createElement('a');
      link.download = `${timer.name}-timer.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to capture screenshot:', error);
    }
  };

  const renderTimer = () => {
    switch (timer.theme) {
      case 'digital':
        return <DigitalTimer targetDate={timer.targetDate} />;
      case 'analog':
        return <AnalogTimer targetDate={timer.targetDate} />;
      case 'chronometer':
        return <ChronometerTimer targetDate={timer.targetDate} />;
      case 'chronometer-analog':
        return <ChronometerAnalogTimer targetDate={timer.targetDate} />;
      case 'calendar':
        return <CalendarTimer targetDate={timer.targetDate} />;
      default:
        return <DigitalTimer targetDate={timer.targetDate} />;
    }
  };

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-gray-700 hover:shadow-glow transition-all duration-300"
        >
          <ArrowLeft className="w-6 h-6 text-gray-300" />
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => setDeleteModal(true)}
            className="p-2 rounded-full hover:bg-gray-700 hover:shadow-glow transition-all duration-300"
          >
            <Trash2 className="w-6 h-6 text-red-500" />
          </button>
          <button
            onClick={handleScreenshot}
            className="p-2 rounded-full hover:bg-gray-700 hover:shadow-glow transition-all duration-300"
          >
            <Camera className="w-6 h-6 text-gray-300" />
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 rounded-full hover:bg-gray-700 hover:shadow-glow transition-all duration-300"
          >
            {isEditing ? (
              <X className="w-6 h-6 text-gray-300" />
            ) : (
              <Edit className="w-6 h-6 text-gray-300" />
            )}
          </button>
        </div>
      </div>

      {/* Timer Content */}
      <div ref={containerRef} className="p-8 bg-gray-800 rounded-lg shadow-lg">
        {isEditing ? (
          <div className="space-y-4">
            <input
              type="text"
              value={editedTimer?.name}
              onChange={(e) => setEditedTimer({ ...editedTimer!, name: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal text-white hover:shadow-glow transition-all duration-300"
            />
            <textarea
              value={editedTimer?.description}
              onChange={(e) => setEditedTimer({ ...editedTimer!, description: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal text-white hover:shadow-glow transition-all duration-300"
              rows={3}
            />
            <input
              type="datetime-local"
              value={editedTimer?.targetDate}
              onChange={(e) => setEditedTimer({ ...editedTimer!, targetDate: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal text-white hover:shadow-glow transition-all duration-300"
            />
            <select
              value={editedTimer?.theme}
              onChange={(e) => setEditedTimer({ ...editedTimer!, theme: e.target.value as Timer['theme'] })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal text-white hover:shadow-glow transition-all duration-300"
            >
              <option value="digital">Digital</option>
              <option value="analog">Analog</option>
              <option value="chronometer">Chronometer</option>
              <option value="chronometer-analog">Chronometer Analog</option>
              <option value="calendar">Calendar</option>
            </select>
            <button
              onClick={handleSave}
              className="w-full px-4 py-2 bg-teal text-white rounded-md hover:bg-teal-dark hover:shadow-glow-hover transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </button>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {timer.name}
            </h1>
            <p className="text-gray-300 mb-8">
              {timer.description}
            </p>
            {renderTimer()}
          </div>
        )}
      </div>

      <DeleteConfirmModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={() => onDelete(timer.id)}
        itemName={timer.name}
      />
    </div>
  );
}

export default TimerView