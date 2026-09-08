import React from 'react';
import { useApp } from '../context/AppContext';
import { achievements, getLevelName, getPointsForLevel } from '../data/products';

interface ProgressPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProgressPanel: React.FC<ProgressPanelProps> = ({ isOpen, onClose }) => {
  const { progress } = useApp();
  const nextLevelPoints = getPointsForLevel(progress.level + 1);
  const currentLevelPoints = getPointsForLevel(progress.level);
  const progressPercent = nextLevelPoints > currentLevelPoints
    ? ((progress.points - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100
    : 100;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-800 to-amber-900 p-6 rounded-t-3xl text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full w-8 h-8 flex items-center justify-center text-white transition-all"
          >
            ✕
          </button>
          <div className="text-4xl mb-2">🏅</div>
          <h2 className="text-xl font-bold text-amber-50">{getLevelName(progress.level)}</h2>
          <p className="text-amber-200 text-sm">Уровень {progress.level}</p>
          <div className="mt-3 bg-amber-950/50 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-amber-300 rounded-full transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-amber-300 mt-1">
            {progress.points} / {nextLevelPoints} очков до следующего уровня
          </p>
        </div>

        {/* Stats */}
        <div className="p-6">
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-amber-50 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-amber-900">{progress.points}</div>
              <div className="text-xs text-amber-600">Очки</div>
            </div>
            <div className="bg-amber-50 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-amber-900">{progress.totalOrders}</div>
              <div className="text-xs text-amber-600">Заказы</div>
            </div>
            <div className="bg-amber-50 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-amber-900">{progress.categoriesExplored.length}</div>
              <div className="text-xs text-amber-600">Категории</div>
            </div>
          </div>

          {/* Achievements */}
          <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
            <span>🏆</span> Достижения
          </h3>
          <div className="space-y-2">
            {achievements.map(ach => {
              const unlocked = progress.achievements.includes(ach.id);
              let currentVal = 0;
              switch (ach.type) {
                case 'purchases': currentVal = progress.totalPurchases; break;
                case 'points': currentVal = progress.points; break;
                case 'categories': currentVal = progress.categoriesExplored.length; break;
                case 'orders': currentVal = progress.totalOrders; break;
              }
              const achProgress = Math.min((currentVal / ach.requirement) * 100, 100);

              return (
                <div
                  key={ach.id}
                  className={`rounded-xl p-3 border transition-all ${
                    unlocked
                      ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-300'
                      : 'bg-gray-50 border-gray-200 opacity-70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl ${unlocked ? '' : 'grayscale opacity-50'}`}>
                      {ach.icon}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`font-semibold text-sm ${unlocked ? 'text-amber-900' : 'text-gray-600'}`}>
                          {ach.title}
                        </span>
                        {unlocked && <span className="text-green-600 text-xs font-bold">✓</span>}
                      </div>
                      <p className="text-xs text-amber-600">{ach.description}</p>
                      {!unlocked && (
                        <div className="mt-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full transition-all duration-500"
                            style={{ width: `${achProgress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPanel;
