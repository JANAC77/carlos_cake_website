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
import ProfilePage from './components/ProfilePage';
import UserOrdersPage from './components/UserOrdersPage';
import { auth, onAuthStateChanged, getProducts, syncUserDocument, getUserById } from './firebase';
import ProductCard from './components/ProductCard';
import CheckoutPage from './components/CheckoutPage'; // Add this import


const logo = '/carlos.png';

// Helper functions for localStorage
const loadFromLocalStorage = (key, defaultValue) => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
  }
  return defaultValue;
};

const saveToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  // ALL HOOKS MUST BE DECLARED AT THE TOP LEVEL
  const [cart, setCart] = useState(() => loadFromLocalStorage('cart', []));
  const [wishlist, setWishlist] = useState(() => loadFromLocalStorage('wishlist', []));
  const [isLoggedIn, setIsLoggedIn] = useState(() => loadFromLocalStorage('isLoggedIn', false));
  const [user, setUser] = useState(() => loadFromLocalStorage('user', null));
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        let userData = await getUserById(firebaseUser.uid);

        if (!userData) {
          await syncUserDocument(firebaseUser);
          userData = await getUserById(firebaseUser.uid);
        }

        const userInfo = {
          id: firebaseUser.uid,
          name: userData?.name || firebaseUser.displayName || firebaseUser.email.split('@')[0],
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL || null,
          phoneNumber: userData?.phoneNumber || firebaseUser.phoneNumber || '',
          address: userData?.address || '',
          city: userData?.city || '',
          pincode: userData?.pincode || '',
          createdAt: userData?.createdAt || firebaseUser.metadata?.creationTime || new Date().toISOString()
        };
        
        setIsLoggedIn(true);
        setUser(userInfo);
        
        // Save to localStorage
        saveToLocalStorage('user', userInfo);
        saveToLocalStorage('isLoggedIn', true);
      } else {
        setIsLoggedIn(false);
        setUser(null);
        // Don't clear localStorage on logout here - let logout function handle it
      }
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    saveToLocalStorage('cart', cart);
  }, [cart]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    saveToLocalStorage('wishlist', wishlist);
  }, [wishlist]);

  // Save login state to localStorage
  useEffect(() => {
    saveToLocalStorage('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  // src/App.jsx - Add these event listeners in AppContent component

useEffect(() => {
  // Handle pending add to cart after login
  const handlePendingAddToCart = (event) => {
    const { product } = event.detail;
    handleAddToCart(product);
  };
  
  const handlePendingAddToWishlist = (event) => {
    const { product } = event.detail;
    handleAddToWishlist(product);
  };
  
  window.addEventListener('pendingAddToCart', handlePendingAddToCart);
  window.addEventListener('pendingAddToWishlist', handlePendingAddToWishlist);
  
  return () => {
    window.removeEventListener('pendingAddToCart', handlePendingAddToCart);
    window.removeEventListener('pendingAddToWishlist', handlePendingAddToWishlist);
  };
}, []);

// Add to Cart Function - Prevent adding same product again
const handleAddToCart = (product) => {
  setCart(prevCart => {
    // Check if product already exists in cart
    const existingProduct = prevCart.find(item => item.id === product.id);
    
    if (existingProduct) {
      // Product already exists - show warning, don't add again
      showCartNotification(`⚠️ ${product.name} is already in your cart!`);
      return prevCart; // Return same cart without changes
    }
    
    // New product - add to cart
    showCartNotification(`🎂 ${product.name} added to cart!`);
    return [...prevCart, { ...product, quantity: 1 }];
  });
};
  // Update handleSearch function
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query || query.trim() === '') {
      setSearchResults([]);
      if (location.pathname === '/search') {
        navigate('/');
      }
      return;
    }
    
    try {
      const allProducts = await getProducts();
      const results = allProducts.filter(product =>
        product.name?.toLowerCase().includes(query.toLowerCase()) ||
        product.category?.toLowerCase().includes(query.toLowerCase()) ||
        product.categoryName?.toLowerCase().includes(query.toLowerCase()) ||
        product.description?.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
      navigate('/search', { state: { results, query } });
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    }
  };
  
  // Add to Wishlist Function
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

  // Login Success
  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    saveToLocalStorage('user', userData);
    saveToLocalStorage('isLoggedIn', true);
    navigate('/');
  };

  // Logout
  const handleLogout = async () => {
    try {
      await auth.signOut();
      setIsLoggedIn(false);
      setUser(null);
      // Clear localStorage on logout
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
      // Don't clear cart and wishlist - keep them
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Update User Profile
  const handleUpdateProfile = (updatedUser) => {
    setUser(updatedUser);
    saveToLocalStorage('user', updatedUser);
  };

  // Show loading while checking auth state
  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
      </div>
    );
  }

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
        <Route path="/" element={
          <>
            <Hero />
            <CategorySection />
            <FeaturedProducts
              onProductClick={handleProductClick}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
              wishlist={wishlist}
              cart={cart}  
             isLoggedIn={isLoggedIn} 
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
    cart={cart}
    user={user}  
     isLoggedIn={isLoggedIn}// Add this line
  />
} />
        <Route path="/cart" element={
          <CartPage
            cart={cart}
            setCart={setCart}
            user={user}
            onNavigate={navigate}
            showToast={showCartNotification}
          />
        } />
       <Route path="/checkout" element={
  <CheckoutPage
    cart={cart}
    setCart={setCart}
    user={user}
    onNavigate={navigate}
    showToast={showCartNotification}
  />
} />
        <Route path="/wishlist" element={
          <WishlistPage
            wishlist={wishlist}
            onRemove={handleRemoveFromWishlist}
            onMoveToCart={handleMoveToCart}
            onNavigate={navigate}
            onProductClick={handleProductClick}
          />
        } />

        <Route path="/profile" element={
          <ProfilePage
            user={user}
            onUpdateProfile={handleUpdateProfile}
            onNavigate={navigate}
          />
        } />

        <Route path="/my-orders" element={
          <UserOrdersPage
            user={user}
            onNavigate={navigate}
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
              <p className="text-gray-500 mb-8">
                Found {searchResults.length} results for "{location.state?.query || searchQuery || ''}"
              </p>
              {searchResults.length > 0 ? (
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
              ) : (
                <div className="text-center py-20">
                  <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-['Outfit'] font-black text-gray-900 mb-2">No Results Found</h3>
                  <p className="text-gray-500 mb-8">
                    We couldn't find any products matching "{location.state?.query || searchQuery || ''}"
                  </p>
                  <button
                    onClick={() => navigate('/')}
                    className="bg-pink-600 text-white px-8 py-3 rounded-full font-black uppercase tracking-widest text-xs hover:bg-gray-900 transition-all"
                  >
                    Browse All Cakes
                  </button>
                </div>
              )}
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