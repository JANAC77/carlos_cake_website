// src/components/ProductCard.jsx
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, onClick, onAddToCart, onAddToWishlist, wishlist = [], cart = [], isLoggedIn = false }) => {
  const isInWishlist = wishlist?.some(item => item.id === product.id);
  const isInCart = cart?.some(item => item.id === product.id);
  const navigate = useNavigate();

  // Check login before actions
  const requireLogin = (action, data) => {
    if (!isLoggedIn) {
      // Store the action and product data to localStorage
      localStorage.setItem('pendingAction', JSON.stringify({
        action: action,
        product: product,
        quantity: 1
      }));
      navigate('/login');
      return false;
    }
    return true;
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    if (requireLogin('buyNow')) {
      navigate('/checkout', { state: { product, quantity: 1 } });
    }
  };

  const handleCartAction = (e) => {
    e.stopPropagation();
    if (isInCart) {
      if (requireLogin('goToCart')) {
        navigate('/cart');
      }
    } else {
      if (requireLogin('addToCart')) {
        onAddToCart && onAddToCart(product);
      }
    }
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    if (requireLogin('addToWishlist')) {
      onAddToWishlist && onAddToWishlist(product);
    }
  };

  return (
    <div className="group relative bg-white rounded-[2.5rem] p-4 transition-all duration-300 hover:shadow-2xl border border-gray-100 hover:border-pink-200">
      <div onClick={() => onClick && onClick(product)} className="cursor-pointer">
        <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-pink-50">
          <img
            src={product.image || '/placeholder.png'}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute top-4 left-4">
            {product.category && (
              <span className="bg-white/90 backdrop-blur-sm text-pink-600 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shadow-sm">
                {product.category}
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistClick}
            className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
          >
            <svg className={`w-4 h-4 ${isInWishlist ? 'fill-pink-600 text-pink-600' : 'text-gray-500'}`} fill={isInWishlist ? "#EC4899" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        <div className="mt-4 px-2">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-bold text-gray-900 group-hover:text-pink-600 transition-colors">
              {product.name}
            </h3>
            <span className="font-bold text-gray-900">₹{product.price}</span>
          </div>
          <p className="text-gray-500 text-xs line-clamp-2">{product.description}</p>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={handleCartAction}
          className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all duration-300 ${
            isInCart 
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
              : 'bg-gray-900 hover:bg-pink-600 text-white'
          }`}
        >
          {isInCart ? 'Go to Cart' : 'Add to Cart'}
        </button>
        <button
          onClick={handleBuyNow}
          className="flex-1 bg-pink-600 text-white py-2 rounded-xl font-bold text-sm transition-all duration-300 hover:bg-gray-900"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductCard;