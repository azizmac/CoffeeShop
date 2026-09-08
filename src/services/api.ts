// Simulated API service with JWT authentication
import { Product } from '../types';
import { generateToken, verifyToken, JWTPayload } from './auth';

// Simulated database
interface User {
  id: string;
  email: string;
  password: string; // In real app, this would be hashed
  name: string;
  role: 'user' | 'admin';
  createdAt: number;
}

interface StoredProduct extends Product {
  createdAt: number;
  createdBy: string;
}

// Initialize default data
function initDB() {
  if (!localStorage.getItem('bb_users')) {
    const defaultUsers: User[] = [
      {
        id: 'admin-1',
        email: 'admin@brewbean.ru',
        password: 'admin123',
        name: 'Администратор',
        role: 'admin',
        createdAt: Date.now()
      },
      {
        id: 'user-1',
        email: 'user@brewbean.ru',
        password: 'user123',
        name: 'Иван Кофеев',
        role: 'user',
        createdAt: Date.now()
      }
    ];
    localStorage.setItem('bb_users', JSON.stringify(defaultUsers));
  }

  if (!localStorage.getItem('bb_products')) {
    const defaultProducts: StoredProduct[] = [
      {
        id: 1,
        name: 'Эфиопия Иргачеффе',
        description: 'Яркий и цветочный кофе с нотами жасмина, бергамота и спелого персика. Выращен на высоте 1900-2200м в регионе Иргачеффе.',
        price: 890,
        category: 'Моно-сорт',
        origin: 'Эфиопия',
        roast: 'Светлая',
        flavor: ['Жасмин', 'Бергамот', 'Персик'],
        intensity: 3,
        image: '🫘',
        badge: 'Хит',
        createdAt: Date.now(),
        createdBy: 'admin-1'
      },
      {
        id: 2,
        name: 'Колумбия Уила Супремо',
        description: 'Сбалансированный кофе с бархатистым телом и нотами карамели, красного яблока и молочного шоколада.',
        price: 750,
        category: 'Моно-сорт',
        origin: 'Колумбия',
        roast: 'Средняя',
        flavor: ['Карамель', 'Яблоко', 'Шоколад'],
        intensity: 4,
        image: '☕',
        badge: 'Популярный',
        createdAt: Date.now(),
        createdBy: 'admin-1'
      },
      {
        id: 3,
        name: 'Кения АА Ньери',
        description: 'Насыщенный и сложный кофе с яркой кислотностью. Ноты чёрной смородины, грейпфрута и тёмного мёда.',
        price: 1120,
        category: 'Моно-сорт',
        origin: 'Кения',
        roast: 'Светлая',
        flavor: ['Смородина', 'Грейпфрут', 'Мёд'],
        intensity: 5,
        image: '🌍',
        badge: 'Премиум',
        createdAt: Date.now(),
        createdBy: 'admin-1'
      },
      {
        id: 4,
        name: 'Бразилия Сантос',
        description: 'Мягкий и сладкий кофе с низким уровнем кислотности. Ноты орехов, какао и карамели.',
        price: 620,
        category: 'Бленд',
        origin: 'Бразилия',
        roast: 'Тёмная',
        flavor: ['Орех', 'Какао', 'Карамель'],
        intensity: 4,
        image: '🥜',
        createdAt: Date.now(),
        createdBy: 'admin-1'
      },
      {
        id: 5,
        name: 'Эспрессо Бленд "Рассвет"',
        description: 'Авторский бленд из трёх сортов для идеального эспрессо. Плотное тело, шоколадный финиш.',
        price: 680,
        category: 'Бленд',
        origin: 'Микс',
        roast: 'Средняя',
        flavor: ['Шоколад', 'Фрукты', 'Специи'],
        intensity: 5,
        image: '🌅',
        badge: 'Новинка',
        createdAt: Date.now(),
        createdBy: 'admin-1'
      },
      {
        id: 6,
        name: 'Декаф Коста-Рика',
        description: 'Кофе без кофеина методом Swiss Water Process. Ноты молочного шоколада, ванили и спелого банана.',
        price: 950,
        category: 'Декаф',
        origin: 'Коста-Рика',
        roast: 'Средняя',
        flavor: ['Ваниль', 'Банан', 'Шоколад'],
        intensity: 2,
        image: '🌙',
        createdAt: Date.now(),
        createdBy: 'admin-1'
      }
    ];
    localStorage.setItem('bb_products', JSON.stringify(defaultProducts));
  }
}

// Helper functions
function getUsers(): User[] {
  return JSON.parse(localStorage.getItem('bb_users') || '[]');
}

function saveUsers(users: User[]): void {
  localStorage.setItem('bb_users', JSON.stringify(users));
}

function getProducts(): StoredProduct[] {
  return JSON.parse(localStorage.getItem('bb_products') || '[]');
}

function saveProducts(products: StoredProduct[]): void {
  localStorage.setItem('bb_products', JSON.stringify(products));
}

// Simulate network delay
function delay(ms: number = 300): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Auth API
export const authAPI = {
  async login(email: string, password: string): Promise<{ token: string; user: Omit<JWTPayload, 'iat' | 'exp'> }> {
    await delay(500);
    initDB();
    
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Неверный email или пароль');
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    });

    return {
      token,
      user: {
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      }
    };
  },

  async register(email: string, password: string, name: string): Promise<{ token: string; user: Omit<JWTPayload, 'iat' | 'exp'> }> {
    await delay(500);
    initDB();
    
    const users = getUsers();
    
    if (users.find(u => u.email === email)) {
      throw new Error('Пользователь с таким email уже существует');
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      password,
      name,
      role: 'user',
      createdAt: Date.now()
    };

    users.push(newUser);
    saveUsers(users);

    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name
    });

    return {
      token,
      user: {
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name
      }
    };
  },

  async getMe(token: string): Promise<Omit<JWTPayload, 'iat' | 'exp'> | null> {
    await delay(100);
    const payload = verifyToken(token);
    if (!payload) return null;
    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      name: payload.name
    };
  }
};

// Products API (protected)
export const productsAPI = {
  async getAll(): Promise<Product[]> {
    await delay(200);
    initDB();
    return getProducts();
  },

  async create(product: Omit<Product, 'id'>, token: string): Promise<Product> {
    await delay(300);
    const payload = verifyToken(token);
    if (!payload || payload.role !== 'admin') {
      throw new Error('Доступ запрещён. Требуются права администратора.');
    }

    const products = getProducts();
    const newProduct: StoredProduct = {
      ...product,
      id: Date.now(),
      createdAt: Date.now(),
      createdBy: payload.userId
    };

    products.push(newProduct);
    saveProducts(products);
    return newProduct;
  },

  async update(id: number, product: Partial<Product>, token: string): Promise<Product> {
    await delay(300);
    const payload = verifyToken(token);
    if (!payload || payload.role !== 'admin') {
      throw new Error('Доступ запрещён. Требуются права администратора.');
    }

    const products = getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Товар не найден');
    }

    products[index] = { ...products[index], ...product };
    saveProducts(products);
    return products[index];
  },

  async delete(id: number, token: string): Promise<void> {
    await delay(300);
    const payload = verifyToken(token);
    if (!payload || payload.role !== 'admin') {
      throw new Error('Доступ запрещён. Требуются права администратора.');
    }

    const products = getProducts();
    const filtered = products.filter(p => p.id !== id);
    saveProducts(filtered);
  },

  async updatePrice(id: number, price: number, token: string): Promise<Product> {
    await delay(200);
    const payload = verifyToken(token);
    if (!payload || payload.role !== 'admin') {
      throw new Error('Доступ запрещён. Требуются права администратора.');
    }

    const products = getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Товар не найден');
    }

    products[index].price = price;
    saveProducts(products);
    return products[index];
  }
};

// Initialize DB on module load
initDB();
