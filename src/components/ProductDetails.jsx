// src/components/ProductDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, getProducts } from '../firebase';
import ProductCard from './ProductCard';
import Reviews from './Reviews';
import CustomCakeOrder from './CustomCakeOrder';

const ProductDetails = ({ onAddToCart, onAddToWishlist, wishlist = [], cart = [], user, isLoggedIn = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showCustomOrder, setShowCustomOrder] = useState(false);

  const [selectedWeight, setSelectedWeight] = useState(null);
  const [weightOptions, setWeightOptions] = useState([]);
  const [loadingWeights, setLoadingWeights] = useState(true);
  const [isEggless, setIsEggless] = useState(false);

  useEffect(() => {
    console.log('ProductDetails mounted, isLoggedIn:', isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
    console.log('weightOptions updated:', weightOptions.length, 'options');
  }, [weightOptions]);

  const requireLogin = (action, productData = null) => {
    if (!isLoggedIn) {
      localStorage.setItem('pendingAction', JSON.stringify({
        action: action,
        product: productData || product,
        quantity: quantity,
        productId: id,
        selectedWeight: selectedWeight
      }));
      navigate('/login');
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (id) {
      fetchProductDetails();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  useEffect(() => {
    const limit = (selectedWeight && selectedWeight.stock !== undefined && selectedWeight.stock !== null)
      ? Number(selectedWeight.stock)
      : (product?.stock !== undefined && product?.stock !== null ? Number(product.stock) : (product?.quantity !== undefined && product?.quantity !== null ? Number(product.quantity) : 99));

    if (quantity > limit) {
      setQuantity(Math.max(1, limit));
    }
  }, [selectedWeight, product, quantity]);

  const fetchProductDetails = async () => {
    setLoading(true);
    const productData = await getProductById(id);
    setProduct(productData);

    if (productData) {
      const related = await getProducts(productData.categoryId);
      const filtered = related.filter(p => p.id !== id).slice(0, 3);
      setRelatedProducts(filtered);
      await loadWeights(productData);
    }
    setLoading(false);
  };

  const loadWeights = async (productData) => {
    setLoadingWeights(true);
    try {
      let weights = [];
      if (productData.weightOptions && productData.weightOptions.length > 0) {
        console.log('Using product-specific custom weights:', productData.weightOptions);
        weights = productData.weightOptions;
      }

      if (weights && weights.length > 0) {
        // Calculate offer price for each weight if product has offer
        const options = weights.map(w => {
          let weightPrice = w.price !== undefined ? parseFloat(w.price) : Math.round(productData.price * (w.priceMultiplier || 1));
          let weightOfferPrice = null;

          if (productData.hasOffer && productData.offerPrice) {
            if (productData.offerType === 'percentage') {
              const discountPercent = parseFloat(productData.offerDiscount);
              weightOfferPrice = Math.round(weightPrice - (weightPrice * discountPercent / 100));
            } else {
              const discountAmount = parseFloat(productData.offerDiscount);
              weightOfferPrice = Math.round(weightPrice - discountAmount);
            }
          }

          return {
            id: w.id || `opt_${Math.random().toString(36).substr(2, 9)}`,
            weight: w.weight,
            label: w.weightLabel || w.label || `${w.weight} kg`,
            price: weightPrice,
            offerPrice: weightOfferPrice,
            stock: w.stock !== undefined && w.stock !== null && w.stock !== '' ? Number(w.stock) : null,
            serves: w.serves || `${Math.round(parseFloat(w.weight) * 4)}-${Math.round(parseFloat(w.weight) * 6)} people`,
          };
        });

        console.log('Generated weight options:', options);
        setWeightOptions(options);

        const defaultWeight = options.find(w => w.weight === '1') || options[0];
        setSelectedWeight(defaultWeight || null);
      } else {
        setWeightOptions([]);
        setSelectedWeight(null);
      }
    } catch (error) {
      console.error("Error loading weights:", error);
      setWeightOptions([]);
      setSelectedWeight(null);
    } finally {
      setLoadingWeights(false);
    }
  };

  const getDisplayPrice = () => {
    let basePrice = 0;
    if (selectedWeight) {
      // Return offer price if available, otherwise regular price
      basePrice = selectedWeight.offerPrice || selectedWeight.price;
    } else {
      // Return product offer price if available
      basePrice = product?.offerPrice || product?.price || 0;
    }

    if (isEggless && product?.egglessOption) {
      basePrice += parseFloat(product.egglessExtra || 0);
    }
    return basePrice;
  };

  const getOriginalPrice = () => {
    let basePrice = 0;
    if (selectedWeight) {
      basePrice = selectedWeight.price;
    } else {
      basePrice = product?.price || 0;
    }

    if (isEggless && product?.egglessOption) {
      basePrice += parseFloat(product.egglessExtra || 0);
    }
    return basePrice;
  };

  const handleAddToCart = () => {
    if (isInCart) {
      navigate('/cart');
      return;
    }
    if (!selectedWeight && weightOptions.length > 0) {
      alert('Please select cake weight');
      return;
    }
    if (requireLogin('addToCart', { ...product, quantity, selectedWeight, isEggless: product.egglessOption ? isEggless : false, price: getDisplayPrice(), originalPrice: getOriginalPrice() })) {
      const itemToAdd = weightOptions.length > 0
        ? {
          ...product,
          quantity,
          selectedWeight,
          isEggless: product.egglessOption ? isEggless : false,
          price: getDisplayPrice(),
          originalPrice: getOriginalPrice(),
          hasOffer: product?.hasOffer,
          offerDiscount: product?.offerDiscount,
          offerDescription: product?.offerDescription
        }
        : {
          ...product,
          quantity,
          isEggless: product.egglessOption ? isEggless : false,
          price: getDisplayPrice(),
          originalPrice: getOriginalPrice()
        };
      onAddToCart(itemToAdd);
      const weightText = selectedWeight ? ` (${selectedWeight.label})` : '';
      const typeText = product.egglessOption ? ` (${isEggless ? 'Eggless' : 'With Egg'})` : '';
      alert(`${product.name}${weightText}${typeText} added to cart!`);
    }
  };

  const handleBuyNow = () => {
    if (!selectedWeight && weightOptions.length > 0) {
      alert('Please select cake weight');
      return;
    }
    if (requireLogin('buyNow', { ...product, quantity, selectedWeight, isEggless: product.egglessOption ? isEggless : false, price: getDisplayPrice(), originalPrice: getOriginalPrice() })) {
      navigate('/checkout', {
        state: {
          product: {
            id: product.id,
            name: product.name,
            price: getDisplayPrice(),
            originalPrice: getOriginalPrice(),
            image: product.image,
            description: product.description,
            selectedWeight: selectedWeight || null,
            isEggless: product.egglessOption ? isEggless : false,
            egglessOption: product.egglessOption || false,
            egglessExtra: product.egglessExtra || 0,
            hasOffer: product?.hasOffer,
            offerDiscount: product?.offerDiscount,
            offerDescription: product?.offerDescription
          },
          quantity: quantity,
          isBuyNow: true
        }
      });
    }
  };

  const handleAddToWishlist = () => {
    if (requireLogin('addToWishlist', product)) {
      onAddToWishlist(product);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description || '',
        url: window.location.href,
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Product link copied to clipboard!');
    }
  };

  const isInWishlist = wishlist?.some(item => item.id === id);
  const isInCart = cart?.some(item => item.id === id);

  const HeartIcon = ({ filled }) => (
    <svg className={`w-6 h-6 transition-colors ${filled ? 'fill-pink-600 text-pink-600' : 'text-gray-400 hover:text-pink-600'}`} fill={filled ? "#EC4899" : "none"} stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );

  // Check if offer is still valid
  const isOfferValid = () => {
    if (!product?.hasOffer) return false;
    if (product?.offerValidTill) {
      const today = new Date().toISOString().split('T')[0];
      if (product.offerValidTill < today) return false;
    }
    return true;
  };

  if (loading) {
    return (
      <div className="pt-32 pb-24 bg-cream-base min-h-screen flex justify-center items-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-rose-gold border-t-transparent shadow-premium-glow"></div>
          <p className="text-sm font-semibold text-neutral-500 uppercase tracking-widest animate-pulse font-['Outfit']">Loading Chef's Creation...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-32 pb-24 bg-cream-base min-h-screen flex justify-center items-center">
        <div className="max-w-md mx-auto px-6 text-center glass-panel-light p-8 rounded-[2rem] border border-white/50 shadow-premium-glow">
          <span className="text-4xl block mb-4">🍰</span>
          <h2 className="text-2xl font-extrabold text-obsidian-dark mb-3 font-['Outfit']">Product Not Found</h2>
          <p className="text-sm text-neutral-500 mb-6 font-medium">The sweet creation you are looking for might have been sold out or moved.</p>
          <button
            onClick={() => navigate('/')}
            className="btn-premium px-6 py-3 bg-gradient-to-r from-rose-gold to-pink-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-premium-glow cursor-pointer"
          >
            Back to Creations
          </button>
        </div>
      </div>
    );
  }

  const averageRating = product.averageRating || 0;
  const ratingCount = product.ratingCount || 0;
  const offerActive = isOfferValid();

  const getStockLimit = () => {
    if (selectedWeight && selectedWeight.stock !== undefined && selectedWeight.stock !== null) {
      return Number(selectedWeight.stock);
    }
    return product.stock !== undefined && product.stock !== null ? Number(product.stock) : (product.quantity !== undefined && product.quantity !== null ? Number(product.quantity) : 99);
  };

  const stockLimit = getStockLimit();
  const isOutOfStock = stockLimit <= 0;

  return (
    <div className="pt-32 pb-16 bg-cream-base min-h-screen relative overflow-hidden">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-rose-200/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-amber-100/25 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-neutral-500 hover:text-rose-gold transition-colors mb-8 group cursor-pointer font-medium text-sm"
        >
          <svg className="w-5 h-5 transform group-hover:-translate-x-1.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-semibold tracking-wide">Back to Creations</span>
        </button>

        {/* 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">

          {/* Left Column: Image Gallery Showcase */}
          <div className="lg:col-span-6 lg:sticky lg:top-32 space-y-4">
            <div className="relative glass-panel-light rounded-[2.5rem] p-3 shadow-premium-glow group overflow-hidden border border-white/50 bg-white/40">

              {/* Offer Badge overlay */}
              <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
                {offerActive && product.offerDiscount && (
                  <span className="bg-gradient-to-r from-rose-gold to-pink-600 text-white text-[10px] font-extrabold px-3.5 py-2 rounded-full shadow-md uppercase tracking-wider animate-pulse">
                    Offer: {product.offerDiscount}
                  </span>
                )}
                {product.isPopular && (
                  <span className="bg-obsidian-dark text-white text-[10px] font-extrabold px-3.5 py-2 rounded-full shadow-md uppercase tracking-wider flex items-center gap-1">
                    ✨ Best Seller
                  </span>
                )}
              </div>

              {/* Wishlist Button on Image overlay */}
              <div className="absolute top-6 right-6 z-10">
                <button
                  onClick={handleAddToWishlist}
                  className="w-11 h-11 flex items-center justify-center bg-white/90 hover:bg-white text-gray-800 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 group/heart"
                >
                  <HeartIcon filled={isInWishlist} />
                </button>
              </div>

              {/* Image Container with Hover Zoom */}
              <div className="rounded-[2rem] overflow-hidden bg-cream-base/50 aspect-square flex items-center justify-center">
                <img
                  src={product.image || '/placeholder.png'}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
            </div>

            {/* Sharing Info */}
            <div className="flex items-center justify-between px-4 py-2">
              <span className="text-xs text-neutral-400 font-medium">Baked fresh with premium ingredients</span>
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 text-sm font-semibold text-neutral-500 hover:text-rose-gold transition-colors duration-300 group cursor-pointer"
              >
                <svg className="w-4 h-4 text-neutral-400 group-hover:text-rose-gold transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186l5.302-2.651m-5.302 4.837l5.302 2.651m-5.302-2.186a2.25 2.25 0 11-3.182-1.998 2.25 2.25 0 0 1 3.182 1.998zm1.096-3.37a2.25 2.25 0 1 1 3.181-1.998 2.25 2.25 0 0 1-3.181 1.998zm0 6.74a2.25 2.25 0 1 1 3.181 1.998 2.25 2.25 0 0 1-3.181-1.998z" />
                </svg>
                <span className="text-xs font-bold uppercase tracking-wider">Share</span>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Details Panel */}
          <div className="lg:col-span-6 space-y-8">

            {/* Header Details */}
            <div>
              <span className="text-rose-gold font-bold uppercase tracking-widest text-[10px] px-3 py-1.5 bg-rose-50 rounded-lg border border-rose-100">
                {product.categoryName || product.category || 'Premium Cake'}
              </span>

              <h1 className="text-3xl lg:text-4xl font-extrabold text-obsidian-dark mt-4 mb-3 font-['Outfit'] tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Star Rating Info */}
              <div className="flex items-center space-x-3 mt-2">
                <div className="flex items-center space-x-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className={`w-4 h-4 ${star <= averageRating ? 'fill-amber-400 text-amber-400' : 'fill-neutral-200 text-neutral-200'}`} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <div className="h-4 w-[1px] bg-neutral-200" />
                <span className="text-sm font-semibold text-neutral-800">{averageRating.toFixed(1)} Rating</span>
                <span className="text-xs text-neutral-400">({ratingCount} verified reviews)</span>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="glass-panel-light rounded-3xl p-6 border border-white/60 bg-gradient-to-br from-white/90 to-rose-50/30 shadow-premium-glow relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-200/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Total Price</span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-extrabold text-gradient-rose-gold">₹{getDisplayPrice() * quantity}</span>
                    {getDisplayPrice() !== getOriginalPrice() && (
                      <span className="text-neutral-400 line-through text-lg font-medium">₹{getOriginalPrice() * quantity}</span>
                    )}
                  </div>
                  {quantity > 1 && (
                    <p className="text-xs text-neutral-500 mt-2 font-medium">
                      ₹{getDisplayPrice()} × {quantity} unit{quantity > 1 ? 's' : ''}
                    </p>
                  )}
                  {selectedWeight && (
                    <p className="text-[11px] text-neutral-400 mt-1 font-medium">
                      Weight Option: {selectedWeight.label} (Base: ₹{getDisplayPrice()})
                    </p>
                  )}
                </div>

                {offerActive && (
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wider">
                      Save {product.offerType === 'percentage' ? `${product.offerDiscount}%` : `₹${product.offerDiscount}`}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      🎉 Special Offer Applied
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Offer description card */}
            {offerActive && product.offerDescription && (
              <div className="p-4 bg-amber-50/60 border border-amber-200/40 rounded-2xl flex gap-3 items-start shadow-sm">
                <span className="text-xl shrink-0">🎁</span>
                <div>
                  <p className="text-xs font-extrabold text-amber-800 uppercase tracking-wider">Special Cake Deal</p>
                  <p className="text-xs text-neutral-600 mt-1 font-medium">{product.offerDescription}</p>
                  {product.offerValidTill && (
                    <p className="text-[10px] text-neutral-400 mt-2 flex items-center gap-1 font-bold">
                      <span>⏰</span> Valid till: {new Date(product.offerValidTill).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* WEIGHT OPTIONS SELECTOR */}
            {!loadingWeights && weightOptions.length > 0 && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-obsidian-dark uppercase tracking-widest">Select Cake Weight</label>
                  <span className="text-xs text-rose-gold font-bold uppercase tracking-wider">Required *</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {weightOptions.map((weight) => {
                    const isSelected = selectedWeight?.id === weight.id;
                    const isOptOutOfStock = weight.stock !== undefined && weight.stock !== null && Number(weight.stock) <= 0;
                    return (
                      <button
                        key={weight.id}
                        type="button"
                        onClick={() => {
                          setSelectedWeight(weight);
                          const limit = weight.stock !== undefined && weight.stock !== null ? Number(weight.stock) : 99;
                          if (quantity > limit) {
                            setQuantity(Math.max(1, limit));
                          }
                        }}
                        className={`relative flex flex-col justify-center p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${isSelected
                            ? 'border-rose-gold bg-rose-50/25 shadow-premium-glow ring-1 ring-rose-gold scale-[1.02]'
                            : 'border-neutral-200 bg-white hover:border-rose-gold/40 hover:bg-rose-50/5'
                          }`}
                      >
                        {/* Checkmark indicator */}
                        <div className="absolute top-1/2 -translate-y-1/2 right-4 flex items-center justify-center">
                          <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center transition-all ${isSelected ? 'border-rose-gold bg-rose-gold text-white' : 'border-neutral-300 bg-white'
                            }`}>
                            {isSelected && (
                              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>

                        <div className="space-y-1 pr-8">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-extrabold text-obsidian-dark text-base">{weight.label}</span>
                            {isOptOutOfStock && (
                              <span className="text-[8px] font-extrabold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-md border border-red-100 uppercase tracking-wider">Sold Out</span>
                            )}
                          </div>
                          <p className="text-[10px] text-neutral-400 font-semibold flex items-center gap-1">
                            <span>👥</span> {weight.serves}
                          </p>
                        </div>


                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {loadingWeights && (
              <div className="mb-6 flex justify-center py-6 glass-panel-light rounded-2xl">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-rose-gold border-t-transparent"></div>
              </div>
            )}

            {/* DIETARY PREFERENCE */}
            {product?.egglessOption && (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-obsidian-dark uppercase tracking-widest">Dietary Preference</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsEggless(false)}
                    className={`flex-1 py-3.5 px-4 rounded-2xl border text-center transition-all duration-300 font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 cursor-pointer ${!isEggless
                        ? 'border-rose-gold bg-rose-50/20 text-rose-gold shadow-sm ring-1 ring-rose-gold scale-[1.01]'
                        : 'border-neutral-200 bg-white text-neutral-600 hover:border-rose-gold/30'
                      }`}
                  >
                    <span className="text-base">🥚</span> With Egg
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEggless(true)}
                    className={`flex-1 py-3.5 px-4 rounded-2xl border text-center transition-all duration-300 font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 cursor-pointer ${isEggless
                        ? 'border-rose-gold bg-rose-50/20 text-rose-gold shadow-sm ring-1 ring-rose-gold scale-[1.01]'
                        : 'border-neutral-200 bg-white text-neutral-600 hover:border-rose-gold/30'
                      }`}
                  >
                    <span className="text-base">🌱</span> Eggless {product.egglessExtra > 0 ? `(+₹${product.egglessExtra})` : ''}
                  </button>
                </div>
              </div>
            )}

            {/* QUANTITY */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-obsidian-dark uppercase tracking-widest">Quantity</label>
              <div className="flex items-center space-x-4">
                <div className={`flex items-center bg-white border border-neutral-200 rounded-2xl p-1 shadow-sm ${isOutOfStock ? 'opacity-50 pointer-events-none' : ''}`}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-xl hover:bg-neutral-50 flex items-center justify-center text-neutral-500 hover:text-obsidian-dark text-lg font-bold transition-colors cursor-pointer"
                    disabled={isOutOfStock}
                  >
                    -
                  </button>
                  <span className="px-6 font-bold text-obsidian-dark min-w-[50px] text-center">
                    {isOutOfStock ? 0 : quantity}
                  </span>
                  <button
                    onClick={() => {
                      if (quantity >= stockLimit) {
                        alert("Stock limit reached");
                        return;
                      }
                      setQuantity(quantity + 1);
                    }}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold transition-colors cursor-pointer ${quantity >= stockLimit
                        ? 'text-neutral-300 cursor-not-allowed'
                        : 'text-neutral-500 hover:text-obsidian-dark hover:bg-neutral-50'
                      }`}
                    disabled={isOutOfStock || quantity >= stockLimit}
                  >
                    +
                  </button>
                </div>
                {isOutOfStock ? (
                  <span className="text-sm text-red-500 font-bold bg-red-50 border border-red-100 px-3 py-1.5 rounded-xl uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
                    ⚠️ Out of Stock
                  </span>
                ) : (
                  stockLimit < 10 && (
                    <span className="text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider">
                      Only {stockLimit} Left!
                    </span>
                  )
                )}
              </div>
            </div>

            {/* BUTTON CONTROLS */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer shadow-md flex items-center justify-center gap-2 ${isOutOfStock
                      ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed shadow-none'
                      : isInCart
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-100/50'
                        : 'bg-obsidian-dark hover:bg-neutral-800 text-white hover:-translate-y-0.5'
                    }`}
                >
                  {isInCart ? (
                    <>
                      <span>🛒</span> Go to Cart
                    </>
                  ) : (
                    <>
                      <span>💼</span> Add to Cart
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className={`flex-1 btn-premium py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer text-white shadow-premium-glow bg-gradient-to-r from-rose-gold to-pink-600 hover:-translate-y-0.5 ${isOutOfStock ? 'opacity-50 cursor-not-allowed shadow-none from-neutral-300 to-neutral-400' : ''
                    }`}
                >
                  ⚡ Buy Now
                </button>
              </div>

              {!isLoggedIn && (
                <p className="text-center text-[11px] text-amber-600 bg-amber-50/50 border border-amber-100/30 py-2.5 rounded-xl flex items-center justify-center gap-1.5 font-bold uppercase tracking-wider">
                  <span>🔒</span> Login required for checkout
                </p>
              )}
            </div>

            {/* CUSTOM CAKE ORDER BANNER */}
            <div className="bg-purple-50/60 border border-purple-100/40 px-4 py-3 rounded-2xl flex items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-2.5">
                <span className="text-lg shrink-0">🎂</span>
                <span className="text-xs font-bold text-purple-950">Want a custom cake design?</span>
              </div>
              <button
                onClick={() => setShowCustomOrder(true)}
                className="text-xs font-extrabold text-purple-600 hover:text-purple-800 transition-colors uppercase tracking-widest cursor-pointer shrink-0"
              >
                Customize →
              </button>
            </div>

            {/* Description & Specs Grid */}
            <div className="space-y-6 pt-6 border-t border-neutral-200/70">
              <div>
                <h4 className="text-xs font-extrabold text-neutral-400 uppercase tracking-widest mb-2.5">Creations Story & Details</h4>
                <p className="text-neutral-600 leading-relaxed text-sm font-medium">
                  {product.description || 'Delicious cake freshly baked with premium ingredients. Perfect for any celebration.'}
                </p>
              </div>

              {/* Icon Grid for Specs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {product.availability && (
                  <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-neutral-100 shadow-sm">
                    <span className="text-xl shrink-0">🕒</span>
                    <div>
                      <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Availability</span>
                      <span className="text-xs font-semibold text-neutral-700 mt-1 block leading-relaxed">{product.availability}</span>
                    </div>
                  </div>
                )}

                {product.shelfLife && (
                  <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-neutral-100 shadow-sm">
                    <span className="text-xl shrink-0">📅</span>
                    <div>
                      <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Shelf Life</span>
                      <span className="text-xs font-semibold text-neutral-700 mt-1 block leading-relaxed">{product.shelfLife}</span>
                    </div>
                  </div>
                )}
              </div>

              {product.disclaimer && (
                <div className="p-4 rounded-2xl bg-neutral-50/70 border border-neutral-200/50">
                  <span className="block text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    ⚠️ Disclaimer
                  </span>
                  <p className="text-[11px] text-neutral-500 leading-relaxed font-semibold">{product.disclaimer}</p>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Reviews Section */}
        <Reviews
          productId={id}
          user={user}
          onReviewAdded={fetchProductDetails}
        />

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-10 border-t border-neutral-200/50">
            <h2 className="text-2xl lg:text-3xl font-extrabold text-obsidian-dark mb-8 font-['Outfit'] tracking-tight">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  onClick={() => navigate(`/product/${relatedProduct.id}`)}
                  onAddToCart={onAddToCart}
                  onAddToWishlist={onAddToWishlist}
                  wishlist={wishlist}
                  cart={cart}
                  isLoggedIn={isLoggedIn}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {showCustomOrder && (
        <CustomCakeOrder
          user={user}
          onClose={() => setShowCustomOrder(false)}
          onSuccess={() => {
            setShowCustomOrder(false);
            alert('Custom cake request submitted! We will contact you within 24 hours with a quote.');
          }}
        />
      )}
    </div>
  );
};

export default ProductDetails;