import { Product, Achievement } from '../types';

export const products: Product[] = [
  {
    id: 1,
    name: 'Эфиопия Иргачеффе',
    description: 'Яркий и цветочный кофе с нотами жасмина, бергамота и спелого персика. Выращен на высоте 1900-2200м в регионе Иргачеффе. Мытая обработка раскрывает чистоту вкуса.',
    price: 890,
    category: 'Моно-сорт',
    origin: 'Эфиопия',
    roast: 'Светлая',
    flavor: ['Жасмин', 'Бергамот', 'Персик'],
    intensity: 3,
    image: '🫘',
    badge: 'Хит'
  },
  {
    id: 2,
    name: 'Колумбия Уила Супремо',
    description: 'Сбалансированный кофе с бархатистым телом и нотами карамели, красного яблока и молочного шоколада. Выращен в регионе Уила на вулканических почвах.',
    price: 750,
    category: 'Моно-сорт',
    origin: 'Колумбия',
    roast: 'Средняя',
    flavor: ['Карамель', 'Яблоко', 'Шоколад'],
    intensity: 4,
    image: '☕',
    badge: 'Популярный'
  },
  {
    id: 3,
    name: 'Кения АА Ньери',
    description: 'Насыщенный и сложный кофе с яркой кислотностью. Ноты чёрной смородины, грейпфрута и тёмного мёда. Один из самых ярких африканских лотов сезона.',
    price: 1120,
    category: 'Моно-сорт',
    origin: 'Кения',
    roast: 'Светлая',
    flavor: ['Смородина', 'Грейпфрут', 'Мёд'],
    intensity: 5,
    image: '🌍',
    badge: 'Премиум'
  },
  {
    id: 4,
    name: 'Бразилия Сантос',
    description: 'Мягкий и сладкий кофе с низким уровнем кислотности. Ноты орехов, какао и карамели. Идеален для эспрессо и молочных напитков. Натуральная обработка.',
    price: 620,
    category: 'Бленд',
    origin: 'Бразилия',
    roast: 'Тёмная',
    flavor: ['Орех', 'Какао', 'Карамель'],
    intensity: 4,
    image: '🥜'
  },
  {
    id: 5,
    name: 'Эспрессо Бленд "Рассвет"',
    description: 'Авторский бленд из трёх сортов для идеального эспрессо. Плотное тело, шоколадный финиш и лёгкая фруктовая кислинка. Создан нашим обжарщиком специально для турок.',
    price: 680,
    category: 'Бленд',
    origin: 'Микс',
    roast: 'Средняя',
    flavor: ['Шоколад', 'Фрукты', 'Специи'],
    intensity: 5,
    image: '🌅',
    badge: 'Новинка'
  },
  {
    id: 6,
    name: 'Декаф Коста-Рика',
    description: 'Кофе без кофеина методом Swiss Water Process. Сохраняет все вкусовые качества: ноты молочного шоколада, ванили и спелого банана. Идеален для вечернего наслаждения.',
    price: 950,
    category: 'Декаф',
    origin: 'Коста-Рика',
    roast: 'Средняя',
    flavor: ['Ваниль', 'Банан', 'Шоколад'],
    intensity: 2,
    image: '🌙'
  }
];

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
