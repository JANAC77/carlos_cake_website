// App.jsx - Complete with all routes and features
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

import Auth from './components/Auth';
import ProductDetails from './components/ProductDetails';
import CartPage from './components/CartPage';
import WishlistPage from './components/WishlistPage';
import ProfilePage from './components/ProfilePage';
import UserOrdersPage from './components/UserOrdersPage';
import { auth, onAuthStateChanged, getProducts, syncUserDocument, getUserById } from './firebase';
import ProductCard from './components/ProductCard';
import CheckoutPage from './components/CheckoutPage';
import WhatsAppButton from './components/WhatsAppButton';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsConditions from './components/TermsConditions';
import RefundPolicy from './components/RefundPolicy';
import AboutUs from './components/AboutUs';
import Contact from './components/Contact';
import CategoryPage from './components/CategoryPage';
import OffersPage from './components/OffersPage';
import AllProductsPage from './components/AllProductsPage';
import ResetPassword from './components/ResetPassword';
import OccasionBasedFilter from './components/OccasionBasedFilter';
import Gallery from './components/Gallery';
import SmallBannerSlider from './components/SmallBannerSlider';
import ReelsSection from './components/ReelsSection';
import HomeSEOContent from './components/HomeSEOContent';
import BlogSameDayDelivery from './components/BlogSameDayDelivery';
import BlogChocolateCake from './components/BlogChocolateCake';
import BlogCustomizedCakes from './components/BlogCustomizedCakes';
import { useSEO } from './hooks/useSEO';

const logo = '/carlos.png';

const loadFromLocalStorage = (key, defaultValue) => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch (error) {
    console.error(`Error loading ${key}:`, error);
  }
  return defaultValue;
};

const saveToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
  }
};

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  // Central SEO Metadata for static routes
  const staticSEO = {
    '/': {
      title: 'Carlos Cake | Online Cake Delivery Bangalore Fresh Cakes',
      description: 'Order fresh cakes online from Carlos Cake Bakery in Bangalore. Get delicious designer cakes, birthday cakes with fast home delivery across Bangalore today'
    },
    '/about': {
      title: 'About Us | Carlos Cake Cafe',
      description: 'Learn more about Carlos Cake Cafe - our journey, our baking standards, and our commitment to sweetening your celebrations.'
    },
    '/contact': {
      title: 'Contact Us | Carlos Cake Cafe',
      description: 'Get in touch with Carlos Cake Cafe for support, custom cake enquiries, or locations in Bangalore.'
    },
    '/all-products': {
      title: 'Our Full Cake Menu | Carlos Cake Cafe',
      description: 'Explore our extensive range of freshly baked cakes, cupcakes, and custom desserts available for fast online delivery in Bangalore.'
    },
    '/cart': {
      title: 'Your Cart | Carlos Cake Cafe',
      description: 'Review your selected cakes and proceed to secure checkout for doorstep delivery.'
    },
    '/wishlist': {
      title: 'Your Wishlist | Carlos Cake Cafe',
      description: 'View your favorite cakes and move them to cart for ordering.'
    },
    '/menu': {
      title: 'Explore Cake Menu | Carlos Cake Cafe',
      description: 'Browse the sweet catalog at Carlos Cake Cafe.'
    },
    '/gallery': {
      title: 'Gallery | Carlos Cake Cafe',
      description: 'Beautiful snaps of our handcrafted cakes and special event creations.'
    },
    '/bangalore-best-same-day-cake-delivery-online': {
      title: 'Bangalore’s Best Same-Day Cake Delivery Online',
      description: 'Order delicious cakes online in Bangalore with fast same-day delivery. Fresh flavors, custom designs, and doorstep delivery for every celebration'
    },
    '/best-chocolate-cake-online-bengaluru-same-day-delivery': {
      title: 'Best Chocolate Cake Online in Bengaluru | Same-Day Delivery',
      description: 'Order the best chocolate cake online in Bengaluru with same-day delivery. Fresh, rich, and delicious cakes for birthdays, parties, and celebrations!'
    },
    '/order-customized-birthday-designer-cakes-online-bengaluru-express-delivery': {
      title: 'Order Customized Designer Cakes Online Bengaluru',
      description: 'Order customized birthday designer cakes online in Bengaluru with express delivery. Choose creative designs, delicious flavour , and timely service.'
    }
  };

  const activeSEO = staticSEO[location.pathname];
  useSEO({
    title: activeSEO?.title,
    description: activeSEO?.description
  });

  const [cart, setCart] = useState(() => {
    const loaded = loadFromLocalStorage('cart', []);
    return loaded.map(item => {
      if (!item.selectedWeight) {
        return {
          ...item,
          selectedWeight: {
            weight: "1",
            label: "1 kg",
            price: item.price,
            offerPrice: item.offerPrice || null,
            serves: "4-6 people"
          }
        };
      }
      return item;
    });
  });
  const [wishlist, setWishlist] = useState(() => loadFromLocalStorage('wishlist', []));
  const [isLoggedIn, setIsLoggedIn] = useState(() => loadFromLocalStorage('isLoggedIn', false));
  const [user, setUser] = useState(() => loadFromLocalStorage('user', null));
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [cartMessage, setCartMessage] = useState('');
  const [showCartMessage, setShowCartMessage] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const wishlistCount = wishlist.length;

  const showCartNotification = (message) => {
    setCartMessage(message);
    setShowCartMessage(true);
    setTimeout(() => {
      setShowCartMessage(false);
      setCartMessage('');
    }, 2000);
  };

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
        saveToLocalStorage('user', userInfo);
        saveToLocalStorage('isLoggedIn', true);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => { saveToLocalStorage('cart', cart); }, [cart]);
  useEffect(() => { saveToLocalStorage('wishlist', wishlist); }, [wishlist]);
  useEffect(() => { saveToLocalStorage('isLoggedIn', isLoggedIn); }, [isLoggedIn]);
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [location.pathname]);

  useEffect(() => {
    const handlePendingAddToCart = (event) => handleAddToCart(event.detail.product);
    const handlePendingAddToWishlist = (event) => handleAddToWishlist(event.detail.product);
    window.addEventListener('pendingAddToCart', handlePendingAddToCart);
    window.addEventListener('pendingAddToWishlist', handlePendingAddToWishlist);
    return () => {
      window.removeEventListener('pendingAddToCart', handlePendingAddToCart);
      window.removeEventListener('pendingAddToWishlist', handlePendingAddToWishlist);
    };
  }, []);

  const handleAddToCart = (product) => {
    setCart(prevCart => {
      if (prevCart.find(item => item.id === product.id)) {
        showCartNotification(`⚠️ ${product.name} is already in your cart!`);
        return prevCart;
      }
      showCartNotification(`🎂 ${product.name} added to cart!`);
      const cartProduct = { ...product };

      // Resolve the correct 1kg price from weightOptions ONLY if selectedWeight is NOT already set
      if (!cartProduct.selectedWeight && cartProduct.weightOptions && cartProduct.weightOptions.length > 0) {
        const oneKg = cartProduct.weightOptions.find(w => String(w.weight) === '1');
        const defaultOpt = oneKg || cartProduct.weightOptions[0];
        if (defaultOpt) {
          const weightPrice = defaultOpt.price !== undefined ? parseFloat(defaultOpt.price) : cartProduct.price;
          cartProduct.price = weightPrice;
          cartProduct.selectedWeight = {
            weight: defaultOpt.weight,
            label: defaultOpt.weightLabel || defaultOpt.label || `${defaultOpt.weight} kg`,
            price: weightPrice,
            offerPrice: defaultOpt.offerPrice || null,
            serves: defaultOpt.serves || `${Math.round(parseFloat(defaultOpt.weight) * 4)}-${Math.round(parseFloat(defaultOpt.weight) * 6)} people`,
            stock: defaultOpt.stock !== undefined ? defaultOpt.stock : null,
          };
        }
      } else if (!cartProduct.selectedWeight) {
        cartProduct.selectedWeight = {
          weight: "1",
          label: "1 kg",
          price: product.price,
          offerPrice: product.offerPrice || null,
          serves: "4-6 people"
        };
      }

      const finalQuantity = product.quantity !== undefined ? product.quantity : 1;
      return [...prevCart, { ...cartProduct, quantity: finalQuantity }];
    });
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query || query.trim() === '') {
      setSearchResults([]);
      if (location.pathname === '/search') navigate('/');
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

  const handleRemoveFromWishlist = (id) => {
    setWishlist(prev => prev.filter(item => item.id !== id));
  };

  const handleMoveToCart = (product) => {
    handleAddToCart(product);
    setWishlist(prev => prev.filter(item => item.id !== product.id));
  };

  const handleProductClick = (product) => {
    setSelectedProductId(product.id);
    navigate(`/product/${product.id}`);
  };

  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    saveToLocalStorage('user', userData);
    saveToLocalStorage('isLoggedIn', true);
    navigate('/');
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setIsLoggedIn(false);
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleUpdateProfile = (updatedUser) => {
    setUser(updatedUser);
    saveToLocalStorage('user', updatedUser);
  };

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
      <WhatsAppButton />
      <Routes>
        <Route path="/" element={
          <div className="pt-[80px] sm:pt-[96px] md:pt-[112px]">
            <SmallBannerSlider />
            <Hero />
            <CategorySection />
            <OffersPage />
            <FeaturedProducts
              onProductClick={handleProductClick}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
              wishlist={wishlist}
              cart={cart}
              isLoggedIn={isLoggedIn}
            />
            <ReelsSection />
            <CelebrationSection />
            <BranchesSection />
            <ReviewsSection />
            <HomeSEOContent />
          </div>
        } />

        <Route path="/menu" element={<Menu />} />

        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/category/:categoryName" element={
          <CategoryPage
            onProductClick={handleProductClick}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
            wishlist={wishlist}
            cart={cart}
            isLoggedIn={isLoggedIn}
          />
        } />
        <Route path="/fresh-cream-cakes-carlos-cake-fast-online-delivery" element={
          <CategoryPage
            categoryNameOverride="fresh-cream-cakes"
            onProductClick={handleProductClick}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
            wishlist={wishlist}
            cart={cart}
            isLoggedIn={isLoggedIn}
          />
        } />
        <Route path="/designer-cakes-selection-carlos-cake-quick-delivery" element={
          <CategoryPage
            categoryNameOverride="designer-cakes"
            onProductClick={handleProductClick}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
            wishlist={wishlist}
            cart={cart}
            isLoggedIn={isLoggedIn}
          />
        } />
        <Route path="/orderchocolate-cakes-online-bangalore-carlos-cake" element={
          <CategoryPage
            categoryNameOverride="chocolate-cakes"
            onProductClick={handleProductClick}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
            wishlist={wishlist}
            cart={cart}
            isLoggedIn={isLoggedIn}
          />
        } />
        <Route path="/all-products" element={
          <AllProductsPage
            onProductClick={handleProductClick}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
            wishlist={wishlist}
            cart={cart}
            isLoggedIn={isLoggedIn}
          />
        } />
        <Route path="/gallery" element={<Gallery />} />

        <Route path="/login" element={<Auth onBack={() => navigate('/')} onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/product/:id" element={<ProductDetails onAddToCart={handleAddToCart} onAddToWishlist={handleAddToWishlist} wishlist={wishlist} cart={cart} user={user} isLoggedIn={isLoggedIn} />} />
        <Route path="/cart" element={<CartPage cart={cart} setCart={setCart} user={user} onNavigate={navigate} showToast={showCartNotification} />} />
        <Route path="/checkout" element={<CheckoutPage cart={cart} setCart={setCart} user={user} onNavigate={navigate} showToast={showCartNotification} />} />
        <Route path="/wishlist" element={<WishlistPage wishlist={wishlist} onRemove={handleRemoveFromWishlist} onMoveToCart={handleMoveToCart} onNavigate={navigate} onProductClick={handleProductClick} />} />
        <Route path="/profile" element={<ProfilePage user={user} onUpdateProfile={handleUpdateProfile} onNavigate={navigate} />} />
        <Route path="/my-orders" element={<UserOrdersPage user={user} onNavigate={navigate} />} />

        <Route path="/search" element={<div className="min-h-screen bg-white pt-32 pb-24"><div className="max-w-7xl mx-auto px-6 lg:px-12"><button onClick={() => navigate('/')} className="flex items-center space-x-2 text-gray-500 hover:text-pink-600 transition-colors mb-8 group"><svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg><span className="font-black uppercase tracking-widest text-xs">Back to Home</span></button><h1 className="text-3xl md:text-4xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tighter mb-4">Search Results</h1><p className="text-gray-500 mb-8">Found {searchResults.length} results for "{location.state?.query || searchQuery || ''}"</p>{searchResults.length > 0 ? (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{searchResults.map((product) => (<ProductCard key={product.id} product={product} onClick={() => handleProductClick(product)} onAddToCart={handleAddToCart} onAddToWishlist={handleAddToWishlist} wishlist={wishlist} />))}</div>) : (<div className="text-center py-20"><div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6"><svg className="w-12 h-12 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></div><h3 className="text-2xl font-['Outfit'] font-black text-gray-900 mb-2">No Results Found</h3><p className="text-gray-500 mb-8">We couldn't find any products matching "{location.state?.query || searchQuery || ''}"</p><button onClick={() => navigate('/')} className="bg-pink-600 text-white px-8 py-3 rounded-full font-black uppercase tracking-widest text-xs hover:bg-gray-900 transition-all">Browse All Cakes</button></div>)}</div></div>} />

        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/bangalore-best-same-day-cake-delivery-online" element={<BlogSameDayDelivery />} />
        <Route path="/best-chocolate-cake-online-bengaluru-same-day-delivery" element={<BlogChocolateCake />} />
        <Route path="/order-customized-birthday-designer-cakes-online-bengaluru-express-delivery" element={<BlogCustomizedCakes />} />
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