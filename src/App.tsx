import React, { useState, useMemo } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { categories } from './data/products';
import { Product } from './types';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import CartPanel from './components/CartPanel';
import CheckoutModal from './components/CheckoutModal';
import ProgressPanel from './components/ProgressPanel';
import AchievementToast from './components/AchievementToast';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';

const MainApp: React.FC = () => {
  const { products, isAuthenticated, isAdmin, logout } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProgressOpen, setIsProgressOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'shop' | 'admin'>('shop');

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.flavor.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'Все' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Show admin page
  if (currentPage === 'admin' && isAdmin) {
    return <AdminPage onBack={() => setCurrentPage('shop')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      <Header
        onCartClick={() => setIsCartOpen(true)}
        onProgressClick={() => setIsProgressOpen(true)}
      />

      {/* Admin Navigation */}
      {isAdmin && (
        <div className="bg-amber-800/90 text-amber-100 py-2 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <span className="text-sm flex items-center gap-2">
              <span>🔑</span> Вы вошли как администратор
            </span>
            <button
              onClick={() => setCurrentPage('admin')}
              className="bg-amber-700 hover:bg-amber-600 text-white text-sm px-3 py-1 rounded-lg transition-all"
            >
              ⚙️ Админ-панель
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-amber-900 mb-4">
              Specialty Coffee
            </h2>
            <p className="text-lg md:text-xl text-amber-700 max-w-2xl mx-auto mb-8">
              Откройте мир изысканного кофе. Каждая чашка — путешествие к истокам вкуса.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-amber-600">
              <span className="flex items-center gap-1">🌍 Прямые поставки</span>
              <span className="flex items-center gap-1">🔥 Свежая обжарка</span>
              <span className="flex items-center gap-1">📦 Быстрая доставка</span>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="max-w-7xl mx-auto px-4 mb-8">
        <div className="bg-white rounded-2xl shadow-md p-4 md:p-6 border border-amber-100">
          {/* Search */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Поиск по названию, описанию или вкусу..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-amber-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all bg-amber-50/50"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md'
                    : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-5xl mb-4 block">🔍</span>
            <p className="text-xl text-amber-700">Ничего не найдено</p>
            <p className="text-amber-500 mt-2">Попробуйте изменить параметры поиска</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-amber-900 text-amber-100 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl">☕</span>
            <span className="text-xl font-bold">Brew & Bean</span>
          </div>
          <p className="text-sm text-amber-300 mb-4">Specialty Coffee Roasters</p>
          <div className="flex items-center justify-center gap-4 text-xs text-amber-400">
            <button onClick={logout} className="hover:text-amber-200 transition-colors">
              Выйти из аккаунта
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {isCartOpen && (
        <CartPanel
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          onCheckout={() => {
            setIsCartOpen(false);
            setIsCheckoutOpen(true);
          }}
        />
      )}

      {isCheckoutOpen && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
        />
      )}

      {isProgressOpen && (
        <ProgressPanel
          isOpen={isProgressOpen}
          onClose={() => setIsProgressOpen(false)}
        />
      )}

      <AchievementToast />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
};

export default App;
