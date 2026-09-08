import React from 'react';
import { useApp } from '../context/AppContext';

interface CartPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

const CartPanel: React.FC<CartPanelProps> = ({ isOpen, onClose, onCheckout }) => {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md bg-gradient-to-b from-amber-50 to-white shadow-2xl overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-amber-200 p-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-amber-900 flex items-center gap-2">
            <span>🛒</span> Корзина
          </h2>
          <button
            onClick={onClose}
            className="bg-amber-100 hover:bg-amber-200 rounded-full w-8 h-8 flex items-center justify-center transition-all"
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-5xl mb-4 block">☕</span>
              <p className="text-amber-700 font-medium">Корзина пуста</p>
              <p className="text-sm text-amber-500 mt-1">Добавьте свой первый спешелти-кофе!</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.product.id} className="bg-white rounded-xl p-3 shadow-sm border border-amber-100">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center text-2xl shrink-0">
                    {item.product.image}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-amber-900 text-sm truncate">{item.product.name}</h4>
                    <p className="text-amber-600 text-sm">{item.product.price} ₽</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-red-400 hover:text-red-600 text-xs p-1"
                  >
                    🗑️
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-7 h-7 bg-amber-100 hover:bg-amber-200 rounded-full flex items-center justify-center text-amber-800 font-bold transition-all"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-semibold text-amber-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-7 h-7 bg-amber-100 hover:bg-amber-200 rounded-full flex items-center justify-center text-amber-800 font-bold transition-all"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-bold text-amber-900">{item.product.price * item.quantity} ₽</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-amber-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-amber-700 font-medium">Итого:</span>
              <span className="text-2xl font-bold text-amber-900">{cartTotal} ₽</span>
            </div>
            <div className="bg-amber-50 rounded-lg p-2 text-center">
              <span className="text-xs text-amber-600">✨ Вы получите +{Math.floor(cartTotal / 10)} очков лояльности</span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-3 rounded-xl font-bold text-lg transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              Оформить заказ
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPanel;
