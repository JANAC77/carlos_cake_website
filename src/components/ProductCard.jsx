// src/components/ProductCard.jsx - Redesigned with premium hover and glass elements
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, onClick, onAddToCart, onAddToWishlist, wishlist = [], cart = [], isLoggedIn = false }) => {
  const isInWishlist = wishlist?.some(item => item.id === product.id);
  const isInCart = cart?.some(item => item.id === product.id);
  const navigate = useNavigate();

  // Get display weight label for card
  const getDisplayWeight = () => {
    if (product.weightOptions && product.weightOptions.length > 0) {
      const oneKg = product.weightOptions.find(w => String(w.weight) === '1');
      const defaultOpt = oneKg || product.weightOptions[0];
      if (defaultOpt) return defaultOpt.weightLabel || defaultOpt.label || `${defaultOpt.weight} kg`;
    }
    if (product.weight) return product.weight;
    if (product.weightLabel) return product.weightLabel;
    return '1 kg';
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

  // Get 1 kg price from weightOptions if available
  const get1kgPrice = () => {
    if (product.weightOptions && product.weightOptions.length > 0) {
      const oneKg = product.weightOptions.find(w => String(w.weight) === '1');
      const defaultOpt = oneKg || product.weightOptions[0];
      if (defaultOpt) {
        const basePrice = defaultOpt.price !== undefined ? parseFloat(defaultOpt.price) : product.price;
        if (offerActive && product.hasOffer && product.offerDiscount) {
          if (product.offerType === 'percentage') {
            const discountPercent = parseFloat(product.offerDiscount);
            return { display: Math.round(basePrice - (basePrice * discountPercent / 100)), original: basePrice };
          } else {
            const discountAmount = parseFloat(product.offerDiscount);
            return { display: Math.round(basePrice - discountAmount), original: basePrice };
          }
        }
        return { display: basePrice, original: basePrice };
      }
    }
    return { display: offerActive && product.offerPrice ? product.offerPrice : product.price, original: product.price };
  };

  const { display: displayPrice, original: originalPrice } = get1kgPrice();
  const displayWeight = getDisplayWeight();

  const getOccasionBadge = (occasions) => {
    if (!occasions || occasions.length === 0) return null;
    const occasion = occasions[0];
    const icons = { birthday: '🎂', anniversary: '💑', wedding: '💒', engagement: '💍', 'baby-shower': '👶', graduation: '🎓' };
    return (
      <span className="absolute top-4 left-4 bg-white/75 backdrop-blur-md border border-white/40 rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-gray-800 shadow-sm z-10">
        {icons[occasion] || ''} {occasion}
      </span>
    );
  };

  const requireLogin = (action) => {
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
    <div
      onClick={() => onClick && onClick(product)}
      className="group relative bg-white rounded-[2rem] p-3.5 transition-all duration-300 hover:shadow-2xl border border-gray-100 hover:border-rose-gold/20 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Image Container with Badges */}
        <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-rose-gold/5">
          <img
            src={product.image || '/placeholder.png'}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => { e.target.src = '/placeholder.png'; }}
            loading="lazy"
          />

          {/* Pulsing Offer Badge */}
          {offerActive && product.offerDiscount && (
            <div className="absolute top-3 right-12 z-10">
              <div className="bg-gradient-to-r from-red-500 to-rose-gold text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md animate-pulse">
                🔥 {product.offerDiscount}
              </div>
            </div>
          )}

          {getOccasionBadge(product.occasions)}

          {product.category && (
            <span className="absolute bottom-3 left-3 bg-white/70 backdrop-blur-md text-rose-gold text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
              {product.category}
            </span>
          )}

          {/* Wishlist Button - Circle glass badge */}
          <button
            onClick={handleWishlistClick}
            className="absolute top-3 right-3 w-8 h-8 bg-white/70 hover:bg-white backdrop-blur-md rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-all cursor-pointer border border-white/30"
            aria-label="Add to wishlist"
          >
            <svg
              className={`w-4 h-4 transition-all duration-300 ${isInWishlist ? 'fill-rose-gold text-rose-gold scale-110' : 'text-gray-500 hover:text-rose-gold'}`}
              fill={isInWishlist ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        {/* Product details */}
        <div className="mt-4 px-1">
          <div className="flex justify-between items-start mb-1.5 gap-2">
            <h3 className="font-bold text-gray-900 group-hover:text-rose-gold transition-colors text-sm line-clamp-1">
              {product.name}
            </h3>
            <div className="text-right flex-shrink-0">
              {offerActive && displayPrice !== originalPrice ? (
                <div className="flex items-center space-x-1 justify-end">
                  <span className="text-[10px] text-gray-400 line-through">₹{originalPrice}</span>
                  <span className="font-black text-rose-gold text-sm">₹{displayPrice}</span>
                </div>
              ) : (
                <span className="font-black text-rose-gold text-sm">₹{displayPrice}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">⚖️ {displayWeight}</span>
          </div>

          <p className="text-gray-400 text-xs line-clamp-2 mt-1.5 leading-relaxed font-medium">{product.description}</p>

          {offerActive && product.offerDescription && (
            <p className="text-[9px] font-bold text-green-600 mt-1.5 flex items-center gap-1 uppercase tracking-wider">
              <span>✨</span> {product.offerDescription}
            </p>
          )}
        </div>
      </div>

      {/* Interactive capsules button layout */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={handleAddToCart}
          className={`flex-1 py-2.5 rounded-xl font-black uppercase tracking-wider text-[9px] transition-all duration-300 transform active:scale-95 cursor-pointer ${isInCart
            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
            : 'bg-obsidian-dark hover:bg-rose-gold text-white hover:shadow-premium-glow'
            }`}
        >
          {isInCart ? 'Go to Cart' : 'Add to Cart'}
        </button>
        <button
          onClick={handleBuyNow}
          className="flex-1 bg-rose-gold text-white py-2.5 rounded-xl font-black uppercase tracking-wider text-[9px] transition-all duration-300 hover:bg-obsidian-dark hover:shadow-lg transform active:scale-95 cursor-pointer"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductCard;