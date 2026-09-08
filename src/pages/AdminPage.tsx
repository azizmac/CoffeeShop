import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { productsAPI } from '../services/api';
import { getToken } from '../services/auth';

const AdminPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { products, refreshProducts, isAdmin } = useApp();
  const [activeTab, setActiveTab] = useState<'products' | 'create' | 'edit'>('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'Моно-сорт',
    origin: '',
    roast: 'Средняя',
    flavor: '',
    intensity: 3,
    image: '☕',
    badge: ''
  });

  useEffect(() => {
    if (!isAdmin) {
      onBack();
    }
  }, [isAdmin, onBack]);

  if (!isAdmin) return null;

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: 'Моно-сорт',
      origin: '',
      roast: 'Средняя',
      flavor: '',
      intensity: 3,
      image: '☕',
      badge: ''
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const token = getToken();
      if (!token) throw new Error('Не авторизован');

      const product = {
        ...formData,
        flavor: formData.flavor.split(',').map(f => f.trim()).filter(Boolean)
      };

      await productsAPI.create(product, token);
      await refreshProducts();
      setMessage({ type: 'success', text: 'Товар успешно создан!' });
      resetForm();
      setActiveTab('products');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setLoading(true);
    setMessage(null);

    try {
      const token = getToken();
      if (!token) throw new Error('Не авторизован');

      const updatedData = {
        ...formData,
        flavor: formData.flavor.split(',').map(f => f.trim()).filter(Boolean)
      };

      await productsAPI.update(editingProduct.id, updatedData, token);
      await refreshProducts();
      setMessage({ type: 'success', text: 'Товар успешно обновлён!' });
      setEditingProduct(null);
      setActiveTab('products');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить этот товар?')) return;
    setLoading(true);
    setMessage(null);

    try {
      const token = getToken();
      if (!token) throw new Error('Не авторизован');

      await productsAPI.delete(id, token);
      await refreshProducts();
      setMessage({ type: 'success', text: 'Товар удалён' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handlePriceUpdate = async (id: number, newPrice: number) => {
    try {
      const token = getToken();
      if (!token) throw new Error('Не авторизован');
      await productsAPI.updatePrice(id, newPrice, token);
      await refreshProducts();
      setMessage({ type: 'success', text: 'Цена обновлена' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      origin: product.origin,
      roast: product.roast,
      flavor: product.flavor.join(', '),
      intensity: product.intensity,
      image: product.image,
      badge: product.badge || ''
    });
    setActiveTab('edit');
  };

  const ProductForm = ({ onSubmit, submitLabel }: { onSubmit: (e: React.FormEvent) => void; submitLabel: string }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-amber-800 mb-1">Название *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-amber-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-amber-800 mb-1">Цена (₽) *</label>
          <input
            type="number"
            required
            min={1}
            value={formData.price}
            onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
            className="w-full px-4 py-2.5 rounded-xl border border-amber-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-amber-800 mb-1">Описание *</label>
        <textarea
          required
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full px-4 py-2.5 rounded-xl border border-amber-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-amber-800 mb-1">Категория</label>
          <select
            value={formData.category}
            onChange={e => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-amber-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none bg-white"
          >
            <option>Моно-сорт</option>
            <option>Бленд</option>
            <option>Декаф</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-amber-800 mb-1">Страна</label>
          <input
            type="text"
            value={formData.origin}
            onChange={e => setFormData({ ...formData, origin: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-amber-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-amber-800 mb-1">Обжарка</label>
          <select
            value={formData.roast}
            onChange={e => setFormData({ ...formData, roast: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-amber-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none bg-white"
          >
            <option>Светлая</option>
            <option>Средняя</option>
            <option>Тёмная</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-amber-800 mb-1">Эмодзи</label>
          <input
            type="text"
            value={formData.image}
            onChange={e => setFormData({ ...formData, image: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-amber-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-amber-800 mb-1">Бейдж</label>
          <input
            type="text"
            value={formData.badge}
            onChange={e => setFormData({ ...formData, badge: e.target.value })}
            placeholder="Хит, Новинка..."
            className="w-full px-4 py-2.5 rounded-xl border border-amber-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-amber-800 mb-1">Интенсивность (1-5)</label>
          <input
            type="number"
            min={1}
            max={5}
            value={formData.intensity}
            onChange={e => setFormData({ ...formData, intensity: Number(e.target.value) })}
            className="w-full px-4 py-2.5 rounded-xl border border-amber-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-amber-800 mb-1">Вкусы (через запятую)</label>
        <input
          type="text"
          value={formData.flavor}
          onChange={e => setFormData({ ...formData, flavor: e.target.value })}
          placeholder="Жасмин, Бергамот, Персик"
          className="w-full px-4 py-2.5 rounded-xl border border-amber-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 disabled:opacity-50 text-white py-3 rounded-xl font-bold transition-all"
        >
          {loading ? 'Сохранение...' : submitLabel}
        </button>
        <button
          type="button"
          onClick={() => { setActiveTab('products'); resetForm(); setEditingProduct(null); }}
          className="px-6 py-3 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-xl font-medium transition-all"
        >
          Отмена
        </button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-amber-900 to-amber-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="bg-white/10 hover:bg-white/20 rounded-lg p-2 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                <span>⚙️</span> Панель администратора
              </h1>
              <p className="text-xs text-amber-200">Управление товарами и ценами</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-red-500/20 text-red-200 text-xs px-2 py-1 rounded-full border border-red-400/30">
              🔑 JWT Auth Active
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Message */}
        {message && (
          <div className={`mb-4 p-4 rounded-xl border ${
            message.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-xl p-1.5 shadow-sm border border-amber-100">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'products'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-amber-700 hover:bg-amber-50'
            }`}
          >
            📦 Товары ({products.length})
          </button>
          <button
            onClick={() => { setActiveTab('create'); resetForm(); }}
            className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'create'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-amber-700 hover:bg-amber-50'
            }`}
          >
            ➕ Создать
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-6">
          {activeTab === 'products' && (
            <div className="space-y-3">
              {products.map(product => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-4 rounded-xl border border-amber-100 hover:border-amber-300 hover:shadow-sm transition-all"
                >
                  <span className="text-3xl">{product.image}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-amber-900 truncate">{product.name}</h3>
                    <p className="text-sm text-amber-600">{product.category} • {product.origin}</p>
                  </div>
                  {/* Inline price edit */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-amber-500">Цена:</span>
                    <input
                      type="number"
                      defaultValue={product.price}
                      onBlur={(e) => {
                        const newPrice = Number(e.target.value);
                        if (newPrice !== product.price && newPrice > 0) {
                          handlePriceUpdate(product.id, newPrice);
                        }
                      }}
                      className="w-24 px-2 py-1 text-right rounded-lg border border-amber-200 focus:border-amber-500 outline-none text-sm font-bold text-amber-900"
                    />
                    <span className="text-sm text-amber-600">₽</span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => startEdit(product)}
                      className="p-2 bg-amber-50 hover:bg-amber-100 rounded-lg text-amber-700 transition-all"
                      title="Редактировать"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 bg-red-50 hover:bg-red-100 rounded-lg text-red-600 transition-all"
                      title="Удалить"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'create' && (
            <div>
              <h3 className="text-lg font-bold text-amber-900 mb-4">Создать новый товар</h3>
              <ProductForm onSubmit={handleCreate} submitLabel="Создать товар" />
            </div>
          )}

          {activeTab === 'edit' && editingProduct && (
            <div>
              <h3 className="text-lg font-bold text-amber-900 mb-4">
                Редактирование: {editingProduct.name}
              </h3>
              <ProductForm onSubmit={handleUpdate} submitLabel="Сохранить изменения" />
            </div>
          )}
        </div>

        {/* JWT Token Info */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-amber-100 p-6">
          <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
            <span>🔐</span> Информация о токене
          </h3>
          <div className="bg-amber-50 rounded-xl p-4 font-mono text-xs text-amber-700 break-all">
            {getToken() || 'Нет токена'}
          </div>
          <p className="text-xs text-amber-500 mt-2">
            JWT-токен используется для авторизации всех API-запросов. Срок действия: 24 часа.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
