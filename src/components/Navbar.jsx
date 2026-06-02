// src/components/Navbar.jsx - Redesigned with premium glassmorphism & rose-gold theme
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCategories } from '../firebase';

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isBlogsOpen, setIsBlogsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const navigate = useNavigate();
  const searchTimeoutRef = useRef(null);

  // Fetch categories from Firebase
  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data);
      setLoadingCategories(false);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.user-dropdown')) {
        setIsDropdownOpen(false);
      }
      if (isCategoriesOpen && !event.target.closest('.categories-dropdown')) {
        setIsCategoriesOpen(false);
      }
      if (isBlogsOpen && !event.target.closest('.blogs-dropdown')) {
        setIsBlogsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isDropdownOpen, isCategoriesOpen, isBlogsOpen]);

  // Toggle functions
  const toggleCategoriesDropdown = () => {
    setIsCategoriesOpen(!isCategoriesOpen);
  };

  const toggleUserDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Navigation items
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const getCategoryPath = (categoryName) => {
    const slug = categoryName.toLowerCase().replace(/\s+/g, '-');
    return `/category/${slug}`;
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      if (onSearch) onSearch(value);
    }, 300);
  };

  const handleDropdownItemClick = (path) => {
    setIsDropdownOpen(false);
    navigate(path);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
          ? 'glass-panel-dark bg-[#1A1616]/85 py-2.5 shadow-2xl border-b border-rose-gold/20'
          : 'bg-[#1A1616]/95 py-4 border-b border-white/5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center group cursor-pointer flex-shrink-0">
            <img
              className="h-12 sm:h-16 md:h-18 w-auto transform transition duration-700 group-hover:scale-105 brightness-110 drop-shadow-[0_2px_10px_rgba(244,63,94,0.15)]"
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
                  className="relative text-[11px] font-serif font-bold text-white/90 hover:text-rose-gold uppercase tracking-[0.25em] transition-colors duration-300 group whitespace-nowrap"
                >
                  {item.name}
                  <span className="absolute -bottom-2 left-1/2 w-0 h-[1.5px] bg-gradient-to-r from-rose-gold to-champagne-gold transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                </Link>
              ))}

              {/* Categories Dropdown - Click-based */}
              <div className="relative categories-dropdown">
                <button
                  onClick={toggleCategoriesDropdown}
                  className="relative text-[11px] font-serif font-bold text-white/90 hover:text-rose-gold uppercase tracking-[0.25em] transition-colors duration-300 group whitespace-nowrap flex items-center space-x-1 cursor-pointer"
                >
                  <span>Categories</span>
                  <svg
                    className={`w-3 h-3 transition-transform duration-300 ${isCategoriesOpen ? 'rotate-180 text-rose-gold' : 'text-white/60'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                  <span className="absolute -bottom-2 left-1/2 w-0 h-[1.5px] bg-gradient-to-r from-rose-gold to-champagne-gold transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                </button>

                {/* Dropdown Menu */}
                {isCategoriesOpen && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 w-64 glass-panel-dark border border-white/10 rounded-2xl shadow-2xl z-50 animate-slide-down">
                    <div className="py-2 px-1">
                      {loadingCategories ? (
                        <div className="px-4 py-4 text-gray-400 text-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-rose-gold border-t-transparent mx-auto"></div>
                        </div>
                      ) : (
                        categories.map((category) => (
                          <Link
                            key={category.id}
                            to={getCategoryPath(category.name)}
                            onClick={() => setIsCategoriesOpen(false)}
                            className="flex items-center justify-between px-4 py-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200 group"
                          >
                            <span className="text-xs font-semibold uppercase tracking-wider">{category.name}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-gold/0 group-hover:bg-rose-gold transition-all duration-350"></span>
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Blogs Dropdown - Click-based */}
              <div className="relative blogs-dropdown">
                <button
                  onClick={() => setIsBlogsOpen(!isBlogsOpen)}
                  className="relative text-[11px] font-serif font-bold text-white/90 hover:text-rose-gold uppercase tracking-[0.25em] transition-colors duration-300 group whitespace-nowrap flex items-center space-x-1 cursor-pointer"
                >
                  <span>Blogs</span>
                  <svg
                    className={`w-3 h-3 transition-transform duration-300 ${isBlogsOpen ? 'rotate-180 text-rose-gold' : 'text-white/60'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                  <span className="absolute -bottom-2 left-1/2 w-0 h-[1.5px] bg-gradient-to-r from-rose-gold to-champagne-gold transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                </button>

                {/* Dropdown Menu */}
                {isBlogsOpen && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 w-64 glass-panel-dark border border-white/10 rounded-2xl shadow-2xl z-50 animate-slide-down">
                    <div className="py-2 px-1">
                      <Link
                        to="/bangalore-best-same-day-cake-delivery-online"
                        onClick={() => setIsBlogsOpen(false)}
                        className="flex items-center justify-between px-4 py-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200 group"
                      >
                        <span className="text-xs font-semibold uppercase tracking-wider">Same-Day Delivery Guide</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-gold/0 group-hover:bg-rose-gold transition-all duration-350"></span>
                      </Link>
                      <Link
                        to="/best-chocolate-cake-online-bengaluru-same-day-delivery"
                        onClick={() => setIsBlogsOpen(false)}
                        className="flex items-center justify-between px-4 py-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200 group"
                      >
                        <span className="text-xs font-semibold uppercase tracking-wider">Best Chocolate Cakes</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-gold/0 group-hover:bg-rose-gold transition-all duration-350"></span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
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
                className="w-40 lg:w-56 bg-white/5 hover:bg-white/10 text-white placeholder:text-gray-400 text-xs rounded-full px-4 py-2 pl-10 border border-white/15 focus:border-rose-gold focus:bg-[#1A1616] focus:outline-none transition-all duration-300 shadow-inner focus:shadow-[0_0_15px_rgba(244,63,94,0.2)]"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Mobile Search Button */}
            <button
              onClick={() => {
                const input = document.querySelector('.mobile-search-input');
                if (input) input.focus();
              }}
              className="md:hidden text-white/80 hover:text-rose-gold transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {isLoggedIn && user ? (
              <div className="relative user-dropdown">
                <button
                  onClick={toggleUserDropdown}
                  className="flex items-center space-x-2 text-white/80 hover:text-rose-gold transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-gold to-champagne-gold flex items-center justify-center text-white font-bold text-xs shadow-lg border border-white/20 transform hover:scale-105 transition-all">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 glass-panel-dark border border-white/10 rounded-2xl shadow-2xl z-50 animate-slide-down">
                    <div className="p-4 border-b border-white/10 bg-white/5 rounded-t-2xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-gold to-champagne-gold flex items-center justify-center text-white font-black shadow-md">
                          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-bold text-sm truncate">{user?.name}</p>
                          <p className="text-gray-400 text-[10px] truncate">{user?.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="py-2 px-1">
                      <button onClick={() => handleDropdownItemClick('/profile')} className="w-full flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-rose-gold hover:bg-white/5 rounded-xl transition-all duration-200">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        <span className="text-xs font-bold uppercase tracking-wider">My Profile</span>
                      </button>
                      <button onClick={() => handleDropdownItemClick('/my-orders')} className="w-full flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-rose-gold hover:bg-white/5 rounded-xl transition-all duration-200">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 11V7a4 4 0 00-8 0v4M5 11h14l1 12H4L5 11z" /></svg>
                        <span className="text-xs font-bold uppercase tracking-wider">My Orders</span>
                      </button>
                      <button onClick={() => handleDropdownItemClick('/wishlist')} className="w-full flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-rose-gold hover:bg-white/5 rounded-xl transition-all duration-200">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                        <span className="text-xs font-bold uppercase tracking-wider">Wishlist</span>
                      </button>
                    </div>

                    <div className="border-t border-white/10 p-2">
                      <button onClick={() => { setIsDropdownOpen(false); onLogout(); }} className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-rose-gold/10 hover:bg-rose-gold text-rose-gold hover:text-white rounded-xl transition-all duration-300">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        <span className="text-[10px] font-black uppercase tracking-widest">Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="text-white/80 hover:text-rose-gold transition-all transform hover:scale-105 duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            )}

            {/* Wishlist Button */}
            <Link to="/wishlist" className="relative text-white/80 hover:text-rose-gold transition-all transform hover:scale-105 duration-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-gold text-white text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-md animate-bounce">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <div className="relative">
              <Link to="/cart" className="relative text-white/80 hover:text-rose-gold transition-all block transform hover:scale-105 duration-300">
                <svg className="w-5 h-5 sm:w-5.5 sm:h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 11h14l1 12H4L5 11z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-rose-gold text-white text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-md animate-bounce">
                    {cartCount}
                  </span>
                )}
              </Link>
              {showMessage && currentMessage && (
                <div className="absolute -top-12 right-0 whitespace-nowrap z-[100] animate-message-popup">
                  <div className="flex items-center space-x-2 bg-rose-gold text-white px-4 py-2.5 rounded-xl shadow-lg border border-white/10">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-xs font-bold uppercase tracking-wider">{currentMessage}</span>
                  </div>
                  <div className="absolute -bottom-1.5 right-5 w-3 h-3 bg-rose-gold rotate-45"></div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-rose-gold/10 text-rose-gold border border-rose-gold/20 transform active:scale-95 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
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
              className="mobile-search-input w-full bg-white/5 text-white placeholder:text-gray-400 text-xs rounded-full px-4 py-2 pl-10 border border-white/15 focus:border-rose-gold focus:outline-none transition-all shadow-inner"
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
        <div className="absolute inset-0 bg-[#1A1616]/80 backdrop-blur-md" onClick={() => setIsMenuOpen(false)}></div>
        <div className={`absolute right-0 top-0 bottom-0 w-80 bg-[#1A1616] border-l border-white/5 shadow-2xl transition-transform duration-500 ease-in-out transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6 space-y-6 mt-20 h-full overflow-y-auto no-scrollbar pb-24">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} className="block w-full text-left text-lg font-serif font-light text-white/90 hover:text-rose-gold transition-colors tracking-wide py-1" onClick={() => setIsMenuOpen(false)}>
                {item.name}
              </Link>
            ))}

            {/* Mobile Categories */}
            <div className="pt-4 border-t border-white/5">
              <p className="text-rose-gold text-[10px] font-black uppercase tracking-[0.2em] mb-4">Categories</p>
              <div className="space-y-3">
                {loadingCategories ? (
                  <div className="text-gray-400 py-2 flex justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-rose-gold border-t-transparent"></div>
                  </div>
                ) : (
                  categories.map((category) => (
                    <Link
                      key={category.id}
                      to={getCategoryPath(category.name)}
                      className="block w-full text-white/70 hover:text-rose-gold transition-colors py-1 text-xs font-semibold uppercase tracking-wider"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* Mobile Blogs */}
            <div className="pt-4 border-t border-white/5">
              <p className="text-rose-gold text-[10px] font-black uppercase tracking-[0.2em] mb-4">Blogs</p>
              <div className="space-y-3">
                <Link
                  to="/bangalore-best-same-day-cake-delivery-online"
                  className="block w-full text-white/70 hover:text-rose-gold transition-colors py-1 text-xs font-semibold uppercase tracking-wider"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Same-Day Delivery Guide
                </Link>
                <Link
                  to="/best-chocolate-cake-online-bengaluru-same-day-delivery"
                  className="block w-full text-white/70 hover:text-rose-gold transition-colors py-1 text-xs font-semibold uppercase tracking-wider"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Best Chocolate Cakes
                </Link>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 space-y-4">
              {isLoggedIn && user ? (
                <>
                  <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-2xl border border-white/5">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-gold to-champagne-gold flex items-center justify-center text-white font-bold">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-sm truncate">{user?.name}</p>
                      <p className="text-gray-400 text-[10px] truncate">{user?.email}</p>
                    </div>
                  </div>
                  <Link to="/profile" className="block w-full text-white/80 hover:text-rose-gold text-xs font-bold uppercase tracking-wider py-1.5" onClick={() => setIsMenuOpen(false)}>My Profile</Link>
                  <Link to="/my-orders" className="block w-full text-white/80 hover:text-rose-gold text-xs font-bold uppercase tracking-wider py-1.5" onClick={() => setIsMenuOpen(false)}>My Orders</Link>
                  <Link to="/wishlist" className="block w-full text-white/80 hover:text-rose-gold text-xs font-bold uppercase tracking-wider py-1.5" onClick={() => setIsMenuOpen(false)}>Wishlist</Link>
                  <button onClick={() => { onLogout(); setIsMenuOpen(false); }} className="w-full mt-4 border border-rose-gold/30 hover:border-rose-gold text-rose-gold hover:bg-rose-gold hover:text-white py-3 rounded-xl font-bold uppercase tracking-widest text-[9px] transition-all">
                    Sign Out
                  </button>
                </>
              ) : (
                <Link to="/login" className="block w-full bg-gradient-to-r from-rose-gold to-champagne-gold text-white py-3.5 rounded-xl font-bold uppercase tracking-widest text-[9px] shadow-lg hover:shadow-rose-gold/20 hover:scale-[1.02] transition-all text-center" onClick={() => setIsMenuOpen(false)}>
                  Login / Sign Up
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes messagePopup {
          0% { opacity: 0; transform: translateY(10px) scale(0.9); }
          10% { opacity: 1; transform: translateY(0) scale(1); }
          90% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-10px) scale(0.9); }
        }
        .animate-message-popup { animation: messagePopup 2s ease-out forwards; }
      `}</style>
    </nav>
  );
};

export default Navbar;