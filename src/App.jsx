// src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import CategorySection from './components/CategorySection';
import FeaturedProducts from './components/FeaturedProducts';
import PersonasSection from './components/PersonasSection';
import ReviewsSection from './components/ReviewsSection';
import CelebrationSection from './components/CelebrationSection';
import BranchesSection from './components/BranchesSection';
import Menu from './components/Menu';
import CustomCakes from './components/CustomCakes';
import OurStory from './components/OurStory';
import Gallery from './components/Gallery';
import Auth from './components/Auth';
import ProductDetails from './components/ProductDetails';
import CartPage from './components/CartPage';
import WishlistPage from './components/WishlistPage';
import { auth, onAuthStateChanged, getProducts } from './firebase';
import ProductCard from './components/ProductCard';

const logo = '/carlos.png';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  // State
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(null);

  // Cart Message State
  const [cartMessage, setCartMessage] = useState('');
  const [showCartMessage, setShowCartMessage] = useState(false);

  // Calculate counts
  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const wishlistCount = wishlist.length;

  // Show cart message function
  const showCartNotification = (message) => {
    setCartMessage(message);
    setShowCartMessage(true);
    setTimeout(() => {
      setShowCartMessage(false);
      setCartMessage('');
    }, 2000);
  };

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setIsLoggedIn(true);
        setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          email: firebaseUser.email
        });
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Load from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Add to Cart Function - Shows message
  const handleAddToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        showCartNotification(`✨ ${product.name} quantity increased!`);
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        );
      }
      showCartNotification(`🎂 ${product.name} added to cart!`);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // Add to Wishlist Function - Shows message
  const handleAddToWishlist = (product) => {
    setWishlist(prev => {
      if (prev.find(item => item.id === product.id)) {
        showCartNotification(`❤️ ${product.name} already in wishlist!`);
        return prev;
      }
      showCartNotification(`❤️ ${product.name} added to wishlist!`);
      return [...prev, product];
    });
  };

  // Remove from Wishlist
  const handleRemoveFromWishlist = (id) => {
    setWishlist(prev => prev.filter(item => item.id !== id));
  };

  // Move to Cart
  const handleMoveToCart = (product) => {
    handleAddToCart(product);
    setWishlist(prev => prev.filter(item => item.id !== product.id));
  };

  // Product Click
  const handleProductClick = (product) => {
    setSelectedProductId(product.id);
    navigate(`/product/${product.id}`);
  };

  // Search
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults([]);
      if (location.pathname === '/search') {
        navigate('/');
      }
    } else {
      const allProducts = await getProducts();
      const results = allProducts.filter(product =>
        product.name?.toLowerCase().includes(query.toLowerCase()) ||
        product.category?.toLowerCase().includes(query.toLowerCase()) ||
        product.description?.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
      navigate('/search', { state: { results, query } });
    }
  };

  // Login Success
  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    navigate('/');
  };

  // Logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    navigate('/');
  };

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        logo={logo}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        isLoggedIn={isLoggedIn}
        user={user}
        onLogout={handleLogout}
        onSearch={handleSearch}
        cartMessage={cartMessage}
        showCartMessage={showCartMessage}
      />

      <Routes>
        {/* Home Route */}
        <Route path="/" element={
          <>
            <Hero />
            <CategorySection />
            <FeaturedProducts
              onProductClick={handleProductClick}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
              wishlist={wishlist}
            />
            <PersonasSection />
            <CelebrationSection />
            <BranchesSection />
            <ReviewsSection />
          </>
        } />

        <Route path="/menu" element={<Menu />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/custom-cakes" element={<CustomCakes />} />
        <Route path="/our-story" element={<OurStory />} />
        <Route path="/login" element={<Auth onBack={() => navigate('/')} onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/product/:id" element={
          <ProductDetails
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
            wishlist={wishlist}
          />
        } />
        <Route path="/cart" element={
          <CartPage
            cart={cart}
            setCart={setCart}
            user={user}
          />
        } />
        <Route path="/wishlist" element={
          <WishlistPage
            wishlist={wishlist}
            onRemove={handleRemoveFromWishlist}
            onMoveToCart={handleMoveToCart}
          />
        } />
        <Route path="/search" element={
          <div className="min-h-screen bg-white pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-gray-500 hover:text-pink-600 transition-colors mb-8 group"
              >
                <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-black uppercase tracking-widest text-xs">Back to Home</span>
              </button>
              <h1 className="text-3xl md:text-4xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tighter mb-4">Search Results</h1>
              <p className="text-gray-500 mb-8">Found {searchResults.length} results</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {searchResults.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={() => handleProductClick(product)}
                    onAddToCart={handleAddToCart}
                    onAddToWishlist={handleAddToWishlist}
                    wishlist={wishlist}
                  />
                ))}
              </div>
            </div>
          </div>
        } />
      </Routes>

      <Footer logo={logo} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;