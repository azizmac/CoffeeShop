import React from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onClose }) => {
  const { addToCart } = useApp();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative h-52 bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center rounded-t-3xl">
          <span className="text-8xl">{product.image}</span>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/80 hover:bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md transition-all"
          >
            ✕
          </button>
          {product.badge && (
            <span className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full">
              {product.badge}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-2">
            <h2 className="text-2xl font-bold text-amber-900">{product.name}</h2>
            <span className="text-2xl font-bold text-amber-700">{product.price} ₽</span>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{product.origin}</span>
            <span className="text-sm bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{product.roast} обжарка</span>
            <span className="text-sm bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{product.category}</span>
          </div>

          <p className="text-amber-800 leading-relaxed mb-5">{product.description}</p>

          {/* Flavor Profile */}
          <div className="mb-5">
            <h4 className="font-semibold text-amber-900 mb-2">Вкусовой профиль</h4>
            <div className="flex flex-wrap gap-2">
              {product.flavor.map(f => (
                <span key={f} className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-800 px-3 py-1 rounded-full text-sm">
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Intensity */}
          <div className="mb-6">
            <h4 className="font-semibold text-amber-900 mb-2">Интенсивность</h4>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex-1">
                  <div className={`h-3 rounded-full ${i <= product.intensity ? 'bg-gradient-to-r from-amber-500 to-amber-700' : 'bg-amber-100'}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Points Reward */}
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-3 mb-5 flex items-center gap-3">
            <span className="text-2xl">✨</span>
            <div>
              <p className="text-sm font-medium text-amber-900">+{Math.floor(product.price / 10)} очков лояльности</p>
              <p className="text-xs text-amber-600">За каждую покупку начисляются бонусы</p>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={() => { addToCart(product); onClose(); }}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-3 rounded-xl font-bold text-lg transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
          >
            Добавить в корзину — {product.price} ₽
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
