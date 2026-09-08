import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CartItem, Product, UserProgress } from '../types';
import { achievements, getLevelName, getPointsForLevel } from '../data/products';

interface AppContextType {
  cart: CartItem[];
  progress: UserProgress;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  completeOrder: () => void;
  cartTotal: number;
  cartCount: number;
  newAchievement: string | null;
  dismissAchievement: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialProgress: UserProgress = {
  points: 0,
  level: 0,
  totalPurchases: 0,
  totalOrders: 0,
  categoriesExplored: [],
  achievements: []
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [progress, setProgress] = useState<UserProgress>(initialProgress);
  const [newAchievement, setNewAchievement] = useState<string | null>(null);

  const checkAchievements = useCallback((updatedProgress: UserProgress) => {
    const unlocked: string[] = [];
    achievements.forEach(ach => {
      if (updatedProgress.achievements.includes(ach.id)) return;
      let met = false;
      switch (ach.type) {
        case 'purchases':
          met = updatedProgress.totalPurchases >= ach.requirement;
          break;
        case 'points':
          met = updatedProgress.points >= ach.requirement;
          break;
        case 'categories':
          met = updatedProgress.categoriesExplored.length >= ach.requirement;
          break;
        case 'orders':
          met = updatedProgress.totalOrders >= ach.requirement;
          break;
      }
      if (met) unlocked.push(ach.id);
    });
    if (unlocked.length > 0) {
      setNewAchievement(unlocked[0]);
      return [...updatedProgress.achievements, ...unlocked];
    }
    return updatedProgress.achievements;
  }, []);

  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });

    setProgress(prev => {
      const newPurchases = prev.totalPurchases + 1;
      const newCategories = prev.categoriesExplored.includes(product.category)
        ? prev.categoriesExplored
        : [...prev.categoriesExplored, product.category];
      const updated = {
        ...prev,
        totalPurchases: newPurchases,
        categoriesExplored: newCategories
      };
      const newAch = checkAchievements(updated);
      return { ...updated, achievements: newAch };
    });
  }, [checkAchievements]);

  const removeFromCart = useCallback((productId: number) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(item => item.product.id !== productId));
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const completeOrder = useCallback(() => {
    const orderTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const earnedPoints = Math.floor(orderTotal / 10);

    setProgress(prev => {
      const newPoints = prev.points + earnedPoints;
      const newOrders = prev.totalOrders + 1;
      let newLevel = 0;
      while (getPointsForLevel(newLevel + 1) <= newPoints) {
        newLevel++;
      }
      const updated = {
        ...prev,
        points: newPoints,
        level: newLevel,
        totalOrders: newOrders
      };
      const newAch = checkAchievements(updated);
      return { ...updated, achievements: newAch };
    });

    setCart([]);
  }, [cart, checkAchievements]);

  const dismissAchievement = useCallback(() => {
    setNewAchievement(null);
  }, []);

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AppContext.Provider
      value={{
        cart,
        progress,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        completeOrder,
        cartTotal,
        cartCount,
        newAchievement,
        dismissAchievement
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
