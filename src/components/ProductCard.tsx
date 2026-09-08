import React from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addToCart } = useApp();

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-amber-100 hover:border-amber-300 hover:-translate-y-1"
    >
      {/* Image Area */}
      <div className="relative h-44 bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
          {product.image}
        </span>
        {product.badge && (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
            {product.badge}
          </span>
        )}
        <span className="absolute top-3 right-3 bg-amber-900/80 text-amber-100 text-xs px-2 py-1 rounded-full">
          {product.roast}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-bold text-amber-900 text-sm md:text-base leading-tight">
            {product.name}
          </h3>
        </div>
        <p className="text-xs text-amber-600 mb-2">{product.origin} • {product.category}</p>

        {/* Flavor Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.flavor.map(f => (
            <span key={f} className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">
              {f}
            </span>
          ))}
        </div>

        {/* Intensity */}
        <div className="flex items-center gap-1 mb-3">
          <span className="text-xs text-amber-600 mr-1">Интенсивность:</span>
          {[1, 2, 3, 4, 5].map(i => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${i <= product.intensity ? 'bg-amber-600' : 'bg-amber-100'}`}
            />
          ))}
        </div>

        {/* Price & Add */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-amber-900">
            {product.price} ₽
          </span>
          <button
            onClick={handleAdd}
            className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-3 py-1.5 rounded-full text-sm font-medium transition-all shadow-sm hover:shadow-md active:scale-95"
          >
            В корзину
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
