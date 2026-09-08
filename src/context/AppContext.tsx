import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem, Product, UserProgress } from '../types';
import { achievements, getLevelName, getPointsForLevel } from '../data/products';
import { getCurrentUser, removeToken, JWTPayload } from '../services/auth';
import { productsAPI } from '../services/api';

interface AuthUser {
  userId: string;
  email: string;
  role: 'user' | 'admin';
  name: string;
}

interface AppContextType {
  // Auth
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (userData: Omit<JWTPayload, 'iat' | 'exp'>) => void;
  logout: () => void;
  // Products
  products: Product[];
  refreshProducts: () => Promise<void>;
  // Cart
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  // Gamification
  progress: UserProgress;
  newAchievement: string | null;
  dismissAchievement: () => void;
  completeOrder: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultProgress: UserProgress = {
  points: 0,
  level: 0,
  totalPurchases: 0,
  totalOrders: 0,
  categoriesExplored: [],
  achievements: []
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const [newAchievement, setNewAchievement] = useState<string | null>(null);

  // Check for existing auth on mount
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser({
        userId: currentUser.userId,
        email: currentUser.email,
        role: currentUser.role,
        name: currentUser.name
      });
    }
    // Load progress from localStorage
    const savedProgress = localStorage.getItem('bb_progress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
    // Load products
    productsAPI.getAll().then(setProducts);
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('bb_progress', JSON.stringify(progress));
  }, [progress]);

  // Check achievements
  const checkAchievements = useCallback((updatedProgress: UserProgress) => {
    const unlocked: string[] = [];
    
    achievements.forEach(achievement => {
      if (updatedProgress.achievements.includes(achievement.id)) return;
      
      let earned = false;
      switch (achievement.type) {
        case 'purchases':
          earned = updatedProgress.totalPurchases >= achievement.requirement;
          break;
        case 'points':
          earned = updatedProgress.points >= achievement.requirement;
          break;
        case 'categories':
          earned = updatedProgress.categoriesExplored.length >= achievement.requirement;
          break;
        case 'orders':
          earned = updatedProgress.totalOrders >= achievement.requirement;
          break;
      }
      
      if (earned) {
        unlocked.push(achievement.id);
      }
    });

    if (unlocked.length > 0) {
      const newProgress = {
        ...updatedProgress,
        achievements: [...updatedProgress.achievements, ...unlocked]
      };
      setProgress(newProgress);
      setNewAchievement(unlocked[0]);
    }
  }, []);

  const login = (userData: Omit<JWTPayload, 'iat' | 'exp'>) => {
    setUser({
      userId: userData.userId,
      email: userData.email,
      role: userData.role,
      name: userData.name
    });
  };

  const logout = () => {
    removeToken();
    setUser(null);
    setCart([]);
  };

  const refreshProducts = async () => {
    const updated = await productsAPI.getAll();
    setProducts(updated);
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      let newCart: CartItem[];
      
      if (existing) {
        newCart = prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newCart = [...prev, { product, quantity: 1 }];
      }

      // Update progress
      setProgress(prevProgress => {
        const newCategories = prevProgress.categoriesExplored.includes(product.category)
          ? prevProgress.categoriesExplored
          : [...prevProgress.categoriesExplored, product.category];
        
        const updated = {
          ...prevProgress,
          totalPurchases: prevProgress.totalPurchases + 1,
          categoriesExplored: newCategories
        };

        // Calculate level
        const newLevel = Math.floor(updated.points / 300);
        updated.level = newLevel;

        setTimeout(() => checkAchievements(updated), 100);
        return updated;
      });

      return newCart;
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const completeOrder = () => {
    const earnedPoints = Math.floor(cartTotal / 10);
    
    setProgress(prev => {
      const updated = {
        ...prev,
        points: prev.points + earnedPoints,
        totalOrders: prev.totalOrders + 1,
        level: Math.floor((prev.points + earnedPoints) / 300)
      };
      setTimeout(() => checkAchievements(updated), 100);
      return updated;
    });

    clearCart();
  };

  const dismissAchievement = () => setNewAchievement(null);

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        logout,
        products,
        refreshProducts,
        cart,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        progress,
        newAchievement,
        dismissAchievement,
        completeOrder
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
