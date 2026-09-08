import React from 'react';
import { useApp } from '../context/AppContext';
import { getLevelName, getPointsForLevel } from '../data/products';

const Header: React.FC<{ onCartClick: () => void; onProgressClick: () => void }> = ({ onCartClick, onProgressClick }) => {
  const { cartCount, progress, user, logout } = useApp();
  const nextLevelPoints = getPointsForLevel(progress.level + 1);
  const currentLevelPoints = getPointsForLevel(progress.level);
  const progressPercent = nextLevelPoints > currentLevelPoints
    ? ((progress.points - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100
    : 100;

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">☕</span>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-amber-50 tracking-wide">
              Brew & Bean
            </h1>
            <p className="text-xs text-amber-200 hidden sm:block">Specialty Coffee Roasters</p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* User Info */}
          <div className="hidden md:flex items-center gap-2">
            <div className="text-right">
              <p className="text-sm font-medium text-amber-100">{user?.name}</p>
              <p className="text-xs text-amber-300">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg px-2 py-1 text-xs transition-all border border-red-400/30"
              title="Выйти"
            >
              🚪
            </button>
          </div>

          {/* Level Badge */}
          <button
            onClick={onProgressClick}
            className="hidden md:flex items-center gap-2 bg-amber-700/50 rounded-full px-3 py-1.5 border border-amber-600/50 hover:bg-amber-700/70 transition-all"
          >
            <span className="text-sm">{getLevelName(progress.level)}</span>
            <div className="w-16 h-1.5 bg-amber-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-amber-300 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs text-amber-300">{progress.points} pts</span>
          </button>

          {/* Cart Button */}
          <button
            onClick={onCartClick}
            className="relative bg-amber-700/50 hover:bg-amber-700/70 rounded-full p-2.5 border border-amber-600/50 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-bounce">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
