// src/components/Auth.jsx
import { useState } from 'react';
import { loginWithEmail, registerWithEmail, syncUserDocument } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Auth = ({ onBack, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const executePendingAction = (userData) => {
    const pendingAction = localStorage.getItem('pendingAction');
    if (pendingAction) {
      const action = JSON.parse(pendingAction);
      localStorage.removeItem('pendingAction');

      setTimeout(() => {
        switch (action.action) {
          case 'addToCart':
            if (window.dispatchEvent) {
              window.dispatchEvent(new CustomEvent('pendingAddToCart', { detail: action }));
            }
            navigate('/');
            break;
          case 'buyNow':
            navigate('/checkout', { state: { product: action.product, quantity: action.quantity } });
            break;
          case 'addToWishlist':
            if (window.dispatchEvent) {
              window.dispatchEvent(new CustomEvent('pendingAddToWishlist', { detail: action }));
            }
            navigate('/');
            break;
          case 'goToCart':
            navigate('/cart');
            break;
          case 'viewCart':
            navigate('/cart');
            break;
          case 'viewWishlist':
            navigate('/wishlist');
            break;
          case 'proceedToCheckout':
            navigate('/checkout');
            break;
          default:
            navigate('/');
        }
      }, 500);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    let result;

    if (isLogin) {
      result = await loginWithEmail(formData.email, formData.password);
      if (result.success) {
        await syncUserDocument(result.user);
      }
    } else {
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }
      result = await registerWithEmail(formData.name, formData.email, formData.password);
    }

    if (result.success) {
      const userData = {
        id: result.user.uid,
        name: result.user.displayName || formData.name || formData.email.split('@')[0],
        email: result.user.email,
        createdAt: new Date().toISOString()
      };

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isLoggedIn', 'true');

      if (onLoginSuccess) {
        onLoginSuccess(userData);
      }

      executePendingAction(userData);
      onBack();
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError('Please enter your email address first.');
      return;
    }

    setLoading(true);
    setError('');
    setForgotMessage('');

    try {
      const resetLink = `${window.location.origin}/reset-password`;

      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          resetLink: resetLink
        })
      });

      const data = await response.json();
      if (data.success) {
        setForgotMessage('Password reset link sent to your email!');
      } else {
        setError(data.message || 'Failed to send reset email.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-28 pb-20">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-pink-50 rounded-2xl mb-3">
              <svg className="w-7 h-7 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-pink-600 font-bold uppercase tracking-wider text-[11px] mb-1">
              {isLogin ? 'WELCOME BACK' : 'JOIN THE FAMILY'}
            </h2>
            <h3 className="text-3xl font-bold text-gray-900">
              {isLogin ? 'LOGIN' : 'SIGN UP'}
            </h3>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          {forgotMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-green-600 text-sm text-center">{forgotMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">FULL NAME</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                  placeholder="John Doe"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">EMAIL ADDRESS</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="hello@example.com"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">PASSWORD</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-500 transition"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {!isLogin && (
                <p className="text-xs text-gray-400 mt-1">Password must be at least 6 characters</p>
              )}
            </div>

            {isLogin && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs font-bold uppercase tracking-wider text-pink-500 hover:text-gray-800 transition"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gray-900 text-white py-3 rounded-xl font-bold uppercase tracking-wider text-sm transition active:scale-[0.98] mt-2 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-pink-500'}`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Please wait...</span>
                </div>
              ) : (
                isLogin ? 'LOGIN' : 'CREATE ACCOUNT'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm mb-2">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setForgotMessage('');
                setFormData({ name: '', email: '', password: '' });
              }}
              className="text-gray-900 font-bold uppercase tracking-wider text-xs border-b border-gray-900 pb-0.5 hover:text-pink-500 hover:border-pink-500 transition"
            >
              {isLogin ? 'CREATE ONE NOW' : 'LOGIN TO ACCOUNT'}
            </button>
          </div>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1 text-gray-400 hover:text-pink-500 transition text-sm group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">Back to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;