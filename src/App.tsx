import React, { useState, useMemo } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { products, categories } from './data/products';
import { Product } from './types';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import CartPanel from './components/CartPanel';
import CheckoutModal from './components/CheckoutModal';
import ProgressPanel from './components/ProgressPanel';
import AchievementToast from './components/AchievementToast';

const AppContent: React.FC = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Все');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [progressOpen, setProgressOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'intensity'>('default');

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.origin.toLowerCase().includes(search.toLowerCase()) ||
        p.flavor.some(f => f.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = category === 'Все' || p.category === category;
      return matchesSearch && matchesCategory;
    });

    switch (sortBy) {
      case 'price-asc':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'intensity':
        result = [...result].sort((a, b) => b.intensity - a.intensity);
        break;
    }

    return result;
  }, [search, category, sortBy]);

  const handleCheckout = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50/30 to-amber-50">
      <Header
        onCartClick={() => setCartOpen(true)}
        onProgressClick={() => setProgressOpen(true)}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-6xl animate-pulse">☕</div>
          <div className="absolute top-20 right-20 text-4xl animate-pulse delay-300">🫘</div>
          <div className="absolute bottom-10 left-1/3 text-5xl animate-pulse delay-700">✨</div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 relative">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
              Откройте мир<br />
              <span className="text-amber-300">спешелти-кофе</span>
            </h2>
            <p className="text-amber-200 text-sm md:text-base mb-6 leading-relaxed">
              Отборные зёрна с лучших плантаций мира, обжаренные с заботой о каждом нюансе вкуса.
              Покупайте кофе и зарабатывайте очки лояльности!
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5 bg-amber-700/50 rounded-full px-3 py-1.5">
                <span>🏆</span>
                <span className="text-amber-100">Система уровней</span>
              </div>
              <div className="flex items-center gap-1.5 bg-amber-700/50 rounded-full px-3 py-1.5">
                <span>✨</span>
                <span className="text-amber-100">Бонусные очки</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 bg-amber-700/50 rounded-full px-3 py-1.5">
                <span>🎯</span>
                <span className="text-amber-100">Достижения</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Поиск по названию, вкусу, стране..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-amber-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all bg-white shadow-sm"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as typeof sortBy)}
            className="px-4 py-2.5 rounded-xl border border-amber-200 bg-white text-amber-800 text-sm shadow-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
          >
            <option value="default">По умолчанию</option>
            <option value="price-asc">Цена: по возрастанию</option>
            <option value="price-desc">Цена: по убыванию</option>
            <option value="intensity">По интенсивности</option>
          </select>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                category === cat
                  ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md'
                  : 'bg-white text-amber-700 border border-amber-200 hover:border-amber-400 hover:bg-amber-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <p className="text-sm text-amber-600 mb-4">
          {filteredProducts.length === 0
            ? 'Ничего не найдено 😔'
            : `Найдено: ${filteredProducts.length} ${filteredProducts.length === 1 ? 'товар' : filteredProducts.length < 5 ? 'товара' : 'товаров'}`
          }
        </p>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={setSelectedProduct}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <span className="text-5xl mb-4 block">🔍</span>
            <p className="text-amber-700 font-medium">Попробуйте изменить параметры поиска</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-amber-900 text-amber-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-bold text-amber-50 mb-2 flex items-center gap-2">
                <span>☕</span> Brew & Bean
              </h4>
              <p className="text-sm text-amber-300">
                Specialty coffee roasters. Мы обжариваем кофе с 2018 года и помогаем людям открывать новые вкусы.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-amber-50 mb-2">Программа лояльности</h4>
              <ul className="text-sm space-y-1 text-amber-300">
                <li>🎯 Зарабатывайте очки за каждую покупку</li>
                <li>🏆 Разблокируйте достижения</li>
                <li>⭐ Повышайте свой уровень</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-amber-50 mb-2">Контакты</h4>
              <ul className="text-sm space-y-1 text-amber-300">
                <li>📍 Москва, ул. Кофейная, 42</li>
                <li>📞 +7 (495) 123-45-67</li>
                <li>✉️ hello@brewandbean.ru</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-amber-800 mt-6 pt-4 text-center text-xs text-amber-400">
            © 2026 Brew & Bean. Все права защищены.
          </div>
        </div>
      </footer>

      {/* Modals & Panels */}
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      <CartPanel
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={handleCheckout}
      />

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />

      <ProgressPanel
        isOpen={progressOpen}
        onClose={() => setProgressOpen(false)}
      />

      <AchievementToast />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
