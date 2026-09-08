import React from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const { addToCart } = useApp();

  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-amber-100 hover:border-amber-300 flex flex-col">
      {/* Image Area */}
      <div
        className="relative h-48 bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center cursor-pointer"
        onClick={onClick}
      >
        <span className="text-7xl group-hover:scale-110 transition-transform duration-300">
          {product.image}
        </span>
        {product.badge && (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
            {product.badge}
          </span>
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs font-medium text-amber-700">
          {product.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h3
          className="text-lg font-bold text-amber-900 mb-1 cursor-pointer hover:text-amber-700 transition-colors"
          onClick={onClick}
        >
          {product.name}
        </h3>
        <p className="text-sm text-amber-600 mb-3 line-clamp-2 flex-1">
          {product.description}
        </p>

        {/* Flavor Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.flavor.slice(0, 3).map(f => (
            <span key={f} className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-100">
              {f}
            </span>
          ))}
        </div>

        {/* Intensity */}
        <div className="flex items-center gap-1 mb-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div
              key={i}
              className={`w-4 h-1.5 rounded-full ${
                i <= product.intensity ? 'bg-amber-600' : 'bg-amber-100'
              }`}
            />
          ))}
          <span className="text-xs text-amber-500 ml-1">{product.roast}</span>
        </div>

        {/* Price and Add */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-bold text-amber-900">{product.price} ₽</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm hover:shadow-md active:scale-95"
          >
            В корзину
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
