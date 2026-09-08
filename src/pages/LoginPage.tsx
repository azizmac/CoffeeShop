import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { authAPI } from '../services/api';
import { setToken } from '../services/auth';

const LoginPage: React.FC = () => {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let result;
      if (isRegister) {
        if (!name.trim()) {
          setError('Введите имя');
          setLoading(false);
          return;
        }
        result = await authAPI.register(email, password, name);
      } else {
        result = await authAPI.login(email, password);
      }

      setToken(result.token);
      login(result.user);
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role: 'admin' | 'user') => {
    if (role === 'admin') {
      setEmail('admin@brewbean.ru');
      setPassword('admin123');
    } else {
      setEmail('user@brewbean.ru');
      setPassword('user123');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-6xl mb-4 block">☕</span>
          <h1 className="text-3xl font-bold text-amber-900">Brew & Bean</h1>
          <p className="text-amber-600 mt-1">Specialty Coffee Roasters</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-amber-100">
          <h2 className="text-2xl font-bold text-amber-900 mb-6 text-center">
            {isRegister ? 'Регистрация' : 'Вход в аккаунт'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-amber-800 mb-1">Имя</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-amber-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all bg-white"
                  placeholder="Ваше имя"
                  required={isRegister}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-amber-800 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-amber-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all bg-white"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-800 mb-1">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-amber-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all bg-white"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 disabled:opacity-50 text-white py-3 rounded-xl font-bold text-lg transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Загрузка...
                </span>
              ) : (
                isRegister ? 'Зарегистрироваться' : 'Войти'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
              className="text-amber-600 hover:text-amber-800 text-sm font-medium transition-colors"
            >
              {isRegister ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
            </button>
          </div>

          {/* Demo accounts */}
          {!isRegister && (
            <div className="mt-6 pt-6 border-t border-amber-100">
              <p className="text-xs text-amber-500 text-center mb-3">Демо-аккаунты (нажмите для заполнения):</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => fillDemo('admin')}
                  className="bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-700 transition-all"
                >
                  🔑 Администратор
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo('user')}
                  className="bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-700 transition-all"
                >
                  👤 Пользователь
                </button>
              </div>
            </div>
          )}
        </div>

        {/* JWT Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-amber-500 flex items-center justify-center gap-1">
            <span>🔒</span> Авторизация через JWT-токен
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
