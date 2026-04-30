import { useState } from 'react';
import { loginWithEmail, registerWithEmail } from '../firebase';

const Auth = ({ onBack, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    let result;

    if (isLogin) {
      result = await loginWithEmail(formData.email, formData.password);
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
      };

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isLoggedIn', 'true');

      if (onLoginSuccess) {
        onLoginSuccess(userData);
      }
      onBack();
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-32 pb-24">
      <div className="max-w-md w-full mx-auto px-6">
        <div className="bg-white rounded-[3rem] p-10 lg:p-16 shadow-2xl shadow-pink-100/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

          <div className="relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-pink-600 font-['Outfit'] font-black uppercase tracking-[0.3em] text-[10px] mb-4">
                {isLogin ? 'Welcome Back' : 'Join The Family'}
              </h2>
              <h3 className="text-4xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tighter">
                {isLogin ? 'Login' : 'Sign Up'}
              </h3>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                <p className="text-red-600 text-sm font-medium text-center">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-4">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required={!isLogin}
                    placeholder="John Doe"
                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-pink-600 transition-all font-medium placeholder:text-gray-300"
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-4">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="hello@example.com"
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-pink-600 transition-all font-medium placeholder:text-gray-300"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-4">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-pink-600 transition-all font-medium placeholder:text-gray-300"
                />
                {!isLogin && (
                  <p className="text-xs text-gray-400 mt-2 ml-4">Password must be at least 6 characters</p>
                )}
              </div>

              {isLogin && (
                <div className="flex justify-end">
                  <a href="#" className="text-[10px] font-black uppercase tracking-widest text-pink-600 hover:text-gray-900 transition-colors">Forgot Password?</a>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-xl active:scale-95 mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-pink-600'
                  }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Please wait...</span>
                  </div>
                ) : (
                  isLogin ? 'Enter The Bakery' : 'Create Account'
                )}
              </button>
            </form>

            <div className="mt-12 text-center">
              <p className="text-gray-400 font-medium text-sm mb-4">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </p>
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setFormData({ name: '', email: '', password: '' });
                }}
                className="text-gray-900 font-black uppercase tracking-widest text-[10px] border-b-2 border-gray-900 pb-0.5 hover:text-pink-600 hover:border-pink-600 transition-all"
              >
                {isLogin ? 'Create One Now' : 'Login To Account'}
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={onBack}
          className="mt-12 flex items-center justify-center space-x-2 text-gray-400 hover:text-pink-600 transition-colors mx-auto group"
        >
          <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-black uppercase tracking-widest text-[10px]">Back to Home</span>
        </button>
      </div>
    </div>
  );
};

export default Auth;