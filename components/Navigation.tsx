import React from 'react';
import { AppMode } from '../types';
import { Home, BookOpen, Layers, Trophy, Sparkles, ShieldAlert } from 'lucide-react';

interface NavigationProps {
  currentMode: AppMode;
  setMode: (mode: AppMode) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentMode, setMode }) => {
  const navItems = [
    { mode: AppMode.HOME, label: 'Home', icon: Home, color: 'bg-white text-gray-800' },
    { mode: AppMode.LEARN_VOWELS, label: 'Vowels', icon: BookOpen, color: 'bg-orange-500 text-white' },
    { mode: AppMode.LEARN_CONSONANTS, label: 'Consonants', icon: Layers, color: 'bg-purple-500 text-white' },
    { mode: AppMode.SAMPLES, label: 'Samples', icon: Sparkles, color: 'bg-pink-500 text-white' },
    { mode: AppMode.QUIZ, label: 'Quiz', icon: Trophy, color: 'bg-yellow-500 text-white' },
    { mode: AppMode.DIAGNOSTICS, label: 'Tests', icon: ShieldAlert, color: 'bg-red-500 text-white' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 p-2 md:p-4 shadow-2xl z-50">
      <div className="max-w-4xl mx-auto flex justify-around items-end md:items-center">
        {navItems.map((item) => {
          const isActive = currentMode === item.mode;
          const Icon = item.icon;
          return (
            <button
              key={item.mode}
              onClick={() => setMode(item.mode)}
              className={`flex flex-col items-center gap-1 p-1 md:p-2 rounded-2xl transition-all duration-300 ${
                isActive ? 'scale-110 -translate-y-2' : 'hover:scale-105'
              }`}
            >
              <div className={`p-2 md:p-3 rounded-2xl shadow-md ${isActive ? item.color : 'bg-gray-100 text-gray-400'}`}>
                <Icon size={20} className="md:w-6 md:h-6" strokeWidth={isActive ? 3 : 2} />
              </div>
              <span className={`text-[10px] md:text-xs font-bold ${isActive ? 'text-gray-800' : 'text-gray-400'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};