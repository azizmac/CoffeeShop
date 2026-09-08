import React from 'react';
import { useApp } from '../context/AppContext';
import { achievements } from '../data/products';

const AchievementToast: React.FC = () => {
  const { newAchievement, dismissAchievement } = useApp();

  if (!newAchievement) return null;

  const achievement = achievements.find(a => a.id === newAchievement);
  if (!achievement) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] animate-slide-up">
      <div className="bg-gradient-to-r from-amber-800 to-amber-900 text-white rounded-2xl px-6 py-4 shadow-2xl flex items-center gap-4 border border-amber-600">
        <span className="text-3xl animate-bounce">{achievement.icon}</span>
        <div>
          <p className="text-xs text-amber-300 font-medium">🏆 Достижение разблокировано!</p>
          <p className="font-bold">{achievement.title}</p>
          <p className="text-xs text-amber-200">{achievement.description}</p>
        </div>
        <button
          onClick={dismissAchievement}
          className="ml-2 bg-white/20 hover:bg-white/30 rounded-full w-6 h-6 flex items-center justify-center text-sm transition-all"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default AchievementToast;
