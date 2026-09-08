export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  origin: string;
  roast: string;
  flavor: string[];
  intensity: number;
  image: string;
  badge?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: number;
  type: 'purchases' | 'points' | 'categories' | 'orders';
}

export interface UserProgress {
  points: number;
  level: number;
  totalPurchases: number;
  totalOrders: number;
  categoriesExplored: string[];
  achievements: string[];
}
