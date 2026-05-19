// src/components/ProductCard.jsx
import { useNavigate } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';
import { quickOrderViaWhatsApp } from '../services/whatsappService';

const ProductCard = ({ product, onClick, onAddToCart, onAddToWishlist, wishlist = [], cart = [], isLoggedIn = false }) => {
  const isInWishlist = wishlist?.some(item => item.id === product.id);
  const isInCart = cart?.some(item => item.id === product.id);
  const navigate = useNavigate();

  // Get display weight label for card (just for info, not dropdown)
  const getDisplayWeight = () => {
    if (product.weight) return product.weight;
    if (product.weightLabel) return product.weightLabel;
    return '1 kg'; // Default weight for display
  };

  // Get serves info for card
  const getDisplayServes = () => {
    if (product.serves) return product.serves;
    if (product.selectedWeight?.serves) return product.selectedWeight.serves;
    return '4-6 people'; // Default serves
  };

  // Check if product has active offer
  const hasActiveOffer = () => {
    if (!product?.hasOffer) return false;
    if (product?.offerValidTill) {
      const today = new Date().toISOString().split('T')[0];
      if (product.offerValidTill < today) return false;
    }
    return true;
  };

  const offerActive = hasActiveOffer();
  
  // Show starting price (base price for 1kg) - NOT the dropdown prices
  const displayPrice = offerActive && product.offerPrice ? product.offerPrice : product.price;
  const originalPrice = product.price;
  const displayWeight = getDisplayWeight();
  const displayServes = getDisplayServes();

  const getOccasionBadge = (occasions) => {
    if (!occasions || occasions.length === 0) return null;
    const occasion = occasions[0];
    const icons = { birthday: '🎂', anniversary: '💑', wedding: '💒', engagement: '💍', 'baby-shower': '👶', graduation: '🎓' };
    return (
      <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium shadow-sm z-10">
        {icons[occasion] || ''} {occasion.charAt(0).toUpperCase() + occasion.slice(1)}
      </span>
    );
  };

  const requireLogin = (action, data) => {
    if (!isLoggedIn) {
      localStorage.setItem('pendingAction', JSON.stringify({ action: action, product: product, quantity: 1 }));
      navigate('/login');
      return false;
    }
    return true;
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isInCart) {
      navigate('/cart');
      return;
    }
    if (requireLogin('addToCart')) {
      // When adding from card, use base product (user can select weight in cart or details page)
      onAddToCart && onAddToCart(product);
    }
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    if (requireLogin('buyNow')) {
      navigate('/checkout', {
        state: {
          product: {
            ...product,
            price: displayPrice,
            originalPrice: originalPrice,
            hasOffer: offerActive,
            offerDiscount: product.offerDiscount,
            offerDescription: product.offerDescription
          },
          quantity: 1,
          isBuyNow: true
        }
      });
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
            onError={(e) => { e.target.src = '/placeholder.png'; }}
          />
          
          {/* Offer Badge */}
          {offerActive && product.offerDiscount && (
            <div className="absolute top-3 left-3 z-10">
              <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md animate-pulse">
                🔥 {product.offerDiscount}
              </div>
            </div>
          )}

         

          {getOccasionBadge(product.occasions)}

          {product.category && (
            <span className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-pink-600 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shadow-sm">
              {product.category}
            </span>
          )}

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
            <h3 className="font-bold text-gray-900 group-hover:text-pink-600 transition-colors text-sm line-clamp-1">
              {product.name}
            </h3>
            <div className="text-right">
              {offerActive && displayPrice !== originalPrice ? (
                <>
                  <span className="font-bold text-pink-600 text-sm">₹{displayPrice}</span>
                  <span className="text-xs text-gray-400 line-through ml-1">₹{originalPrice}</span>
                </>
              ) : (
                <span className="font-bold text-pink-600 text-sm">₹{displayPrice}</span>
              )}
            </div>
          </div>
          
          {/* Weight and Serves Info - Just for info */}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-500">⚖️ {displayWeight}</span>
          </div>
          
          <p className="text-gray-500 text-xs line-clamp-2 mt-1">{product.description}</p>
          
          {/* Offer Description */}
          {offerActive && product.offerDescription && (
            <p className="text-[10px] text-green-600 mt-1 truncate">
               {product.offerDescription}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={handleAddToCart}
          className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all duration-300 ${isInCart
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