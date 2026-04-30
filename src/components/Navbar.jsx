// src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({
  logo,
  cartCount,
  wishlistCount,
  isLoggedIn,
  user,
  onLogout,
  onSearch,
  cartMessage,
  showCartMessage
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle cart message
  useEffect(() => {
    if (cartMessage && showCartMessage) {
      setCurrentMessage(cartMessage);
      setShowMessage(true);
      const timer = setTimeout(() => {
        setShowMessage(false);
        setCurrentMessage('');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [cartMessage, showCartMessage]);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Custom Cakes', path: '/custom-cakes' },
    { name: 'Our Story', path: '/our-story' }
  ];

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    if (onSearch) onSearch(value);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
          ? 'bg-[#1A1616] py-3 shadow-2xl border-b border-pink-500/20'
          : 'bg-[#1A1616] py-4 border-b border-white/5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center group cursor-pointer flex-shrink-0">
            <img
              className="h-12 sm:h-16 md:h-20 w-auto transform transition duration-700 group-hover:scale-105 brightness-110"
              src={logo}
              alt="Carlos Cakes"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center flex-1 px-4">
            <div className="flex items-center space-x-6 xl:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative text-[11px] font-serif font-bold text-white/90 hover:text-pink-500 uppercase tracking-[0.25em] transition-colors duration-300 group whitespace-nowrap"
                >
                  {item.name}
                  <span className="absolute -bottom-2 left-1/2 w-0 h-[1px] bg-pink-500 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                </Link>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3 sm:space-x-4 lg:space-x-5">
            {/* Search */}
            <div className="hidden md:block relative">
              <input
                type="text"
                value={searchInput}
                onChange={handleSearchChange}
                placeholder="Search cakes..."
                className="w-40 lg:w-56 bg-white/10 text-white placeholder:text-gray-400 text-sm rounded-full px-4 py-2 pl-10 border border-white/20 focus:border-pink-500 focus:outline-none transition-all"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Mobile Search Button */}
            <button
              onClick={() => {
                const input = document.querySelector('.mobile-search-input');
                if (input) input.focus();
              }}
              className="md:hidden text-white/80 hover:text-pink-500 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* User Menu */}
            {isLoggedIn && user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-white/80 hover:text-pink-500 transition-all">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-[#1A1616] border border-white/10 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="p-4 border-b border-white/10">
                    <p className="text-white font-medium text-sm truncate">{user?.name}</p>
                    <p className="text-gray-400 text-xs truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-4 py-3 text-gray-400 hover:text-pink-500 hover:bg-white/5 transition-colors text-sm rounded-b-2xl"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-white/80 hover:text-pink-500 transition-all transform hover:scale-110 duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            )}

            {/* Wishlist Button */}
            <Link
              to="/wishlist"
              className="relative text-white/80 hover:text-pink-500 transition-all transform hover:scale-110 duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Button with Message Near Icon */}
            <div className="relative">
              <Link
                to="/cart"
                className="relative text-white/80 hover:text-pink-500 transition-all transform hover:scale-110 duration-300 block"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 11h14l1 12H4L5 11z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Pink Message - Only One, Near Cart Icon */}
              {showMessage && currentMessage && (
                <div className="absolute -top-12 right-0 whitespace-nowrap z-[100] animate-message-popup">
                  <div className="flex items-center space-x-2 bg-pink-500 text-white px-4 py-2.5 rounded-xl shadow-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm font-medium">{currentMessage}</span>
                  </div>
                  <div className="absolute -bottom-1.5 right-5 w-3 h-3 bg-pink-500 rotate-45"></div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-pink-500/10 text-pink-500 border border-pink-500/20 transform active:scale-95 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className={`md:hidden mt-3 transition-all duration-300 ${searchInput ? 'opacity-100 visible' : 'opacity-0 invisible h-0'}`}>
          <div className="relative">
            <input
              type="text"
              value={searchInput}
              onChange={handleSearchChange}
              placeholder="Search cakes..."
              className="mobile-search-input w-full bg-white/10 text-white placeholder:text-gray-400 text-sm rounded-full px-4 py-2 pl-10 border border-white/20 focus:border-pink-500 focus:outline-none transition-all"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
        <div className="absolute inset-0 bg-[#1A1616]/95 backdrop-blur-2xl" onClick={() => setIsMenuOpen(false)}></div>
        <div className={`absolute right-0 top-0 bottom-0 w-80 bg-[#1A1616] shadow-2xl transition-transform duration-500 ease-in-out transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6 space-y-6 mt-20">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="block w-full text-left text-xl font-serif font-light text-white hover:text-pink-500 transition-colors tracking-tight py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-6 border-t border-white/10 space-y-4">
              {isLoggedIn && user ? (
                <>
                  <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">{user?.name}</p>
                      <p className="text-gray-400 text-xs truncate">{user?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={onLogout}
                    className="w-full border border-white/10 text-white py-3 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-pink-500 hover:border-pink-500 transition-all"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block w-full bg-pink-600 text-white py-3 rounded-full font-bold uppercase tracking-widest text-[10px] shadow-xl hover:bg-pink-500 transition-all text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login / Sign Up
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes messagePopup {
          0% {
            opacity: 0;
            transform: translateY(10px) scale(0.9);
          }
          10% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          90% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-10px) scale(0.9);
          }
        }
        
        .animate-message-popup {
          animation: messagePopup 2s ease-out forwards;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;