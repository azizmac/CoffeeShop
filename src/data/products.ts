import { Achievement } from '../types';

export const categories = ['Все', 'Моно-сорт', 'Бленд', 'Декаф'];

export const achievements: Achievement[] = [
  {
    id: 'first_purchase',
    title: 'Первая чашка',
    description: 'Добавьте первый товар в корзину',
    icon: '🎯',
    requirement: 1,
    type: 'purchases'
  },
  {
    id: 'coffee_lover',
    title: 'Кофеман',
    description: 'Совершите 3 покупки',
    icon: '❤️',
    requirement: 3,
    type: 'purchases'
  },
  {
    id: 'explorer',
    title: 'Исследователь',
    description: 'Попробуйте кофе из 3 разных категорий',
    icon: '🗺️',
    requirement: 3,
    type: 'categories'
  },
  {
    id: 'connoisseur',
    title: 'Ценитель',
    description: 'Наберите 500 очков лояльности',
    icon: '👑',
    requirement: 500,
    type: 'points'
  },
  {
    id: 'collector',
    title: 'Коллекционер',
    description: 'Оформите 5 заказов',
    icon: '🏆',
    requirement: 5,
    type: 'orders'
  },
  {
    id: 'expert',
    title: 'Эксперт',
    description: 'Наберите 1500 очков лояльности',
    icon: '⭐',
    requirement: 1500,
    type: 'points'
  }
];

export const getLevelName = (level: number): string => {
  const levels = ['Новичок', 'Любитель', 'Знаток', 'Ценитель', 'Мастер', 'Гуру'];
  return levels[Math.min(level, levels.length - 1)];
};

export const getPointsForLevel = (level: number): number => {
  return level * 300;
};
