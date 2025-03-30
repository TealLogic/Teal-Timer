import React from 'react';
import { ArrowLeft, Camera, Edit, Save, Trash2, X, Palette, RotateCcw } from 'lucide-react';
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

const DEFAULT_THEME_COLOR = '#20B2AA';
const DEFAULT_GLOW_INTENSITY = 0;

function TimerView({ timerId, timers, onBack, onUpdate, onDelete }: TimerViewProps) {
  const timer = timers.find((t) => t.id === timerId);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedTimer, setEditedTimer] = React.useState(timer);
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [showThemeEditor, setShowThemeEditor] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  if (!timer) return null;

  const currentThemeColor = timer.themeColor || DEFAULT_THEME_COLOR;
  const currentGlowIntensity = timer.glowIntensity ?? DEFAULT_GLOW_INTENSITY;

  const handleSave = () => {
    if (editedTimer) {
      onUpdate(editedTimer);
      setIsEditing(false);
    }
  };

  const handleThemeUpdate = (color: string, glowIntensity: number) => {
    const updatedTimer = {
      ...timer,
      themeColor: color,
      glowIntensity,
    };
    onUpdate(updatedTimer);
  };

  const handleResetTheme = () => {
    const updatedTimer = {
      ...timer,
      themeColor: DEFAULT_THEME_COLOR,
      glowIntensity: DEFAULT_GLOW_INTENSITY,
    };
    onUpdate(updatedTimer);
  };

  const handleScreenshot = async () => {
    if (!containerRef.current) return;
    
    try {
      const { toPng } = await import('html-to-image');
      
      const scale = 2;
      const style = {
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        width: `${100 / scale}%`,
        height: `${100 / scale}%`,
      };

      const dataUrl = await toPng(containerRef.current, {
        quality: 1.0,
        pixelRatio: 3,
        backgroundColor: document.documentElement.classList.contains('dark') ? 'rgb(3, 7, 18)' : '#ffffff',
        width: containerRef.current.offsetWidth * scale,
        height: containerRef.current.offsetHeight * scale,
        style,
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
    const props = {
      targetDate: timer.targetDate,
      themeColor: currentThemeColor,
      glowIntensity: currentGlowIntensity,
    };

    switch (timer.theme) {
      case 'digital':
        return <DigitalTimer {...props} />;
      case 'analog':
        return <AnalogTimer {...props} />;
      case 'chronometer':
        return <ChronometerTimer {...props} />;
      case 'chronometer-analog':
        return <ChronometerAnalogTimer {...props} />;
      case 'calendar':
        return <CalendarTimer {...props} />;
      default:
        return <DigitalTimer {...props} />;
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
      <div ref={containerRef} className="p-8 bg-gray-800 rounded-lg shadow-lg relative">
        {/* Theme Editor Button */}
        <button
          onClick={() => setShowThemeEditor(!showThemeEditor)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-700 hover:shadow-glow transition-all duration-300"
          style={{ zIndex: 10 }}
        >
          <Palette className="w-5 h-5 text-gray-300" />
        </button>

        {/* Theme Editor Panel */}
        {showThemeEditor && (
          <div className="absolute top-16 right-4 bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-700 z-20">
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Color
                </label>
                <input
                  type="color"
                  value={currentThemeColor}
                  onChange={(e) => handleThemeUpdate(e.target.value, currentGlowIntensity)}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Glow Intensity
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={currentGlowIntensity}
                  onChange={(e) => handleThemeUpdate(currentThemeColor, parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <button
                onClick={handleResetTheme}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors text-sm text-gray-300"
              >
                <RotateCcw className="w-4 h-4" />
                Reset to Default
              </button>
            </div>
          </div>
        )}

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
            <div className="flex justify-center">
              <div className="aspect-square w-fit">
                {renderTimer()}
              </div>
            </div>
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