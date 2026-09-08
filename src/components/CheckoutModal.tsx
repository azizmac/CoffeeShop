import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { cart, cartTotal, completeOrder } = useApp();
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    delivery: 'courier'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    setTimeout(() => {
      completeOrder();
      setStep('success');
    }, 2000);
  };

  const handleClose = () => {
    setStep('form');
    setFormData({ name: '', phone: '', address: '', delivery: 'courier' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={handleClose}>
      <div
        className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {step === 'form' && (
          <>
            <div className="p-6 border-b border-amber-100">
              <h2 className="text-xl font-bold text-amber-900 flex items-center gap-2">
                <span>📋</span> Оформление заказа
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Order Summary */}
              <div className="bg-amber-50 rounded-xl p-3 space-y-2">
                <h4 className="font-semibold text-amber-900 text-sm">Ваш заказ:</h4>
                {cart.map(item => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-amber-700">{item.product.name} × {item.quantity}</span>
                    <span className="font-medium text-amber-900">{item.product.price * item.quantity} ₽</span>
                  </div>
                ))}
                <div className="border-t border-amber-200 pt-2 flex justify-between">
                  <span className="font-bold text-amber-900">Итого:</span>
                  <span className="font-bold text-amber-900">{cartTotal} ₽</span>
                </div>
              </div>

              {/* Form Fields */}
              <div>
                <label className="block text-sm font-medium text-amber-800 mb-1">Имя</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-amber-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all bg-white"
                  placeholder="Ваше имя"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-800 mb-1">Телефон</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-amber-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all bg-white"
                  placeholder="+7 (999) 123-45-67"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-800 mb-1">Адрес доставки</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-amber-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all bg-white"
                  placeholder="Улица, дом, квартира"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-800 mb-1">Способ доставки</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'courier', label: '🚗 Курьер', sub: 'Бесплатно' },
                    { value: 'pickup', label: '🏪 Самовывоз', sub: 'Бесплатно' }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, delivery: opt.value })}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        formData.delivery === opt.value
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-amber-100 hover:border-amber-300'
                      }`}
                    >
                      <div className="font-medium text-sm text-amber-900">{opt.label}</div>
                      <div className="text-xs text-amber-600">{opt.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-3 rounded-xl font-bold text-lg transition-all shadow-md hover:shadow-lg active:scale-[0.98] mt-4"
              >
                Подтвердить заказ — {cartTotal} ₽
              </button>
            </form>
          </>
        )}

        {step === 'processing' && (
          <div className="p-12 text-center">
            <div className="animate-spin text-5xl mb-4">☕</div>
            <h3 className="text-xl font-bold text-amber-900 mb-2">Обрабатываем заказ...</h3>
            <p className="text-amber-600">Готовим ваш кофе с любовью</p>
          </div>
        )}

        {step === 'success' && (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <h3 className="text-2xl font-bold text-amber-900 mb-2">Заказ оформлен!</h3>
            <p className="text-amber-700 mb-4">Спасибо за покупку! Мы уже готовим ваш кофе.</p>
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4 mb-6">
              <p className="text-sm font-medium text-amber-900">
                ✨ +{Math.floor(cartTotal / 10)} очков лояльности начислено!
              </p>
            </div>
            <button
              onClick={handleClose}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-3 rounded-xl font-bold transition-all shadow-md"
            >
              Продолжить покупки
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
