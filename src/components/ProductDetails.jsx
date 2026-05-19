// src/components/ProductDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, getProducts, getCakeWeights } from '../firebase';
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
  const [showWeightSelector, setShowWeightSelector] = useState(false);
  const [loadingWeights, setLoadingWeights] = useState(true);

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
      let weights = await getCakeWeights();

      console.log('Weights from Firebase:', weights);

      if (!weights || weights.length === 0) {
        console.log("No weights in Firebase, using fallback weights");
        weights = [
          { id: 'fb_1', weight: "0.5", weightLabel: "0.5 kg", priceMultiplier: 0.6, serves: "2-4 people" },
          { id: 'fb_2', weight: "1", weightLabel: "1 kg", priceMultiplier: 1, serves: "4-6 people" },
          { id: 'fb_3', weight: "1.5", weightLabel: "1.5 kg", priceMultiplier: 1.4, serves: "6-8 people" },
          { id: 'fb_4', weight: "2", weightLabel: "2 kg", priceMultiplier: 1.8, serves: "8-12 people" }
        ];
      }

      if (weights && weights.length > 0) {
        // Calculate offer price for each weight if product has offer
        const options = weights.map(w => {
          let weightPrice = Math.round(productData.price * (w.priceMultiplier || 1));
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
            id: w.id,
            weight: w.weight,
            label: w.weightLabel || `${w.weight} kg`,
            price: weightPrice,
            offerPrice: weightOfferPrice,
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
    if (selectedWeight) {
      // Return offer price if available, otherwise regular price
      return selectedWeight.offerPrice || selectedWeight.price;
    }
    // Return product offer price if available
    return product?.offerPrice || product?.price || 0;
  };

  const getOriginalPrice = () => {
    if (selectedWeight) {
      return selectedWeight.price;
    }
    return product?.price || 0;
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
    if (requireLogin('addToCart', { ...product, quantity, selectedWeight, price: getDisplayPrice(), originalPrice: getOriginalPrice() })) {
      const itemToAdd = weightOptions.length > 0
        ? { 
            ...product, 
            quantity, 
            selectedWeight, 
            price: getDisplayPrice(),
            originalPrice: getOriginalPrice(),
            hasOffer: product?.hasOffer,
            offerDiscount: product?.offerDiscount,
            offerDescription: product?.offerDescription
          }
        : { 
            ...product, 
            quantity,
            price: getDisplayPrice(),
            originalPrice: getOriginalPrice()
          };
      onAddToCart(itemToAdd);
      const weightText = selectedWeight ? ` (${selectedWeight.label})` : '';
      alert(`${product.name}${weightText} added to cart!`);
    }
  };

  const handleBuyNow = () => {
    if (!selectedWeight && weightOptions.length > 0) {
      alert('Please select cake weight');
      return;
    }
    if (requireLogin('buyNow', { ...product, quantity, selectedWeight, price: getDisplayPrice(), originalPrice: getOriginalPrice() })) {
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
      <div className="pt-32 pb-24 bg-white min-h-screen">
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-32 pb-24 bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <button onClick={() => navigate('/')} className="text-pink-600 hover:underline">Back to Home</button>
        </div>
      </div>
    );
  }

  const averageRating = product.averageRating || 0;
  const ratingCount = product.ratingCount || 0;
  const offerActive = isOfferValid();
  const stockLimit = product.stock !== undefined && product.stock !== null ? Number(product.stock) : (product.quantity !== undefined && product.quantity !== null ? Number(product.quantity) : 99);
  const isOutOfStock = stockLimit <= 0;

  return (
    <div className="pt-32 pb-16 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-500 hover:text-pink-600 transition-colors mb-6 group"
        >
          <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Back</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <div className="relative">
            {/* Offer Badge on Image */}
            {offerActive && product.offerDiscount && (
              <div className="absolute top-4 left-4 z-10">
                <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg animate-pulse">
                   {product.offerDiscount}
                </div>
              </div>
            )}
            <div className="bg-pink-50 rounded-2xl overflow-hidden">
              <img
                src={product.image || '/placeholder.png'}
                alt={product.name}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          <div>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-pink-600 font-semibold uppercase tracking-wider text-xs">
                  {product.categoryName || product.category || 'Cake'}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-3">
                  {product.name}
                </h1>
              </div>
              <button
                onClick={handleAddToWishlist}
                className="p-2 hover:bg-pink-50 rounded-full transition-colors"
              >
                <HeartIcon filled={isInWishlist} />
              </button>
            </div>

            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className={`w-4 h-4 ${star <= averageRating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`} viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-medium text-gray-900">{averageRating.toFixed(1)}</span>
              <span className="text-sm text-gray-500">({ratingCount} reviews)</span>
            </div>

            <p className="text-gray-600 leading-relaxed mb-6">
              {product.description || 'Delicious cake freshly baked with premium ingredients. Perfect for any celebration.'}
            </p>

            {/* OFFER DISPLAY SECTION */}
            {offerActive && product.offerDiscount && (
              <div className="mb-4 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border border-pink-200">
                <div className="flex items-start gap-3">
                  <div>
                    <p className="font-bold text-pink-600 text-lg">{product.offerDiscount}</p>
                    {product.offerDescription && (
                      <p className="text-sm text-gray-600 mt-1">{product.offerDescription}</p>
                    )}
                    {product.offerValidTill && (
                      <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                        <span>⏰</span> Valid till: {new Date(product.offerValidTill).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="border-t border-b border-gray-100 py-4 mb-6">
              <div className="flex items-center justify-between">
                {selectedWeight ? (
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-bold text-pink-600">₹{getDisplayPrice()}</span>
                      {getDisplayPrice() !== getOriginalPrice() && (
                        <span className="text-gray-400 line-through text-lg">₹{getOriginalPrice()}</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Base price for 1kg</p>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-bold text-pink-600">₹{getDisplayPrice()}</span>
                      {product.offerPrice && (
                        <span className="text-gray-400 line-through text-lg">₹{product.price}</span>
                      )}
                    </div>
                  </div>
                )}
                {offerActive && (
                  <div className="bg-green-100 text-green-600 text-xs font-bold px-3 py-1 rounded-full">
                    Save {product.offerType === 'percentage' ? product.offerDiscount : `₹${product.offerDiscount}`}
                  </div>
                )}
              </div>
            </div>
            
            {/* WEIGHT SELECTOR */}
            {!loadingWeights && weightOptions.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Cake Weight</label>
                <div className="relative">
                  <button
                    onClick={() => setShowWeightSelector(!showWeightSelector)}
                    className="w-full flex justify-between items-center px-4 py-3 border border-gray-200 rounded-xl bg-white hover:border-pink-500 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">⚖️</span>
                      <div className="text-left">
                        <span className="font-medium text-gray-900">{selectedWeight?.label || 'Select Weight'}</span>
                        <p className="text-xs text-gray-400">{selectedWeight?.serves || 'Choose size'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        {selectedWeight?.offerPrice && selectedWeight?.offerPrice !== selectedWeight?.price ? (
                          <>
                            <span className="font-bold text-pink-600">₹{selectedWeight.offerPrice}</span>
                            <span className="text-xs text-gray-400 line-through ml-1">₹{selectedWeight.price}</span>
                          </>
                        ) : (
                          <span className="font-bold text-pink-600">₹{selectedWeight?.price || 0}</span>
                        )}
                      </div>
                      <svg className={`w-4 h-4 transition-transform ${showWeightSelector ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {showWeightSelector && (
                    <div className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                      {weightOptions.map((weight) => (
                        <button
                          key={weight.id}
                          onClick={() => {
                            setSelectedWeight(weight);
                            setShowWeightSelector(false);
                          }}
                          className={`w-full flex justify-between items-center p-3 hover:bg-pink-50 transition-colors ${selectedWeight?.id === weight.id ? 'bg-pink-50' : ''}`}
                        >
                          <div>
                            <span className="font-medium text-gray-900">{weight.label}</span>
                            <p className="text-xs text-gray-400">{weight.serves}</p>
                          </div>
                          <div className="text-right">
                            {weight.offerPrice && weight.offerPrice !== weight.price ? (
                              <>
                                <span className="font-bold text-pink-600">₹{weight.offerPrice}</span>
                                <span className="text-xs text-gray-400 line-through ml-1">₹{weight.price}</span>
                              </>
                            ) : (
                              <span className="font-bold text-pink-600">₹{weight.price}</span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-2">💡 Larger cakes serve more people. Price varies by weight.</p>
              </div>
            )}

            {loadingWeights && (
              <div className="mb-6 flex justify-center py-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-pink-500 border-t-transparent"></div>
              </div>
            )}

            {!loadingWeights && weightOptions.length === 0 && (
              <div className="mb-6 p-3 bg-yellow-50 rounded-xl text-center">
                <p className="text-xs text-yellow-600">⚖️ Weight options loading... Please refresh</p>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <div className="flex items-center space-x-4">
                <div className={`flex items-center border border-gray-200 rounded-lg ${isOutOfStock ? 'opacity-50 pointer-events-none' : ''}`}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-50 text-gray-600 text-lg"
                    disabled={isOutOfStock}
                  >
                    -
                  </button>
                  <span className="px-6 py-2 font-medium text-gray-900 border-x border-gray-200 min-w-[60px] text-center">
                    {isOutOfStock ? 0 : quantity}
                  </span>
                  <button
                    onClick={() => {
                      if (quantity >= stockLimit) {
                        alert("Stock full");
                        return;
                      }
                      setQuantity(quantity + 1);
                    }}
                    className={`px-4 py-2 text-lg text-gray-600 ${quantity >= stockLimit ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-50'}`}
                    disabled={isOutOfStock || quantity >= stockLimit}
                  >
                    +
                  </button>
                </div>
                {isOutOfStock ? (
                  <p className="text-sm text-red-600 font-bold">❌ Out of Stock</p>
                ) : (
                  <p className="text-sm text-green-600 font-medium">
                    {stockLimit <= 5 ? `⚠️ Only ${stockLimit} left in stock!` : `✓ In Stock (${stockLimit} available)`}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-4 mb-4">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                  isOutOfStock
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : isInCart
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-gray-900 hover:bg-pink-600 text-white'
                }`}
              >
                {isOutOfStock ? 'Out of Stock' : isInCart ? 'Go to Cart' : 'Add to Cart'}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                  isOutOfStock
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-pink-600 text-white hover:bg-gray-900'
                }`}
              >
                Buy Now
              </button>
            </div>

            {!isLoggedIn && (
              <p className="text-center text-xs text-amber-600 mb-4 flex items-center justify-center space-x-1">
                <span>🔒</span>
                <span>Login required for Add to Cart & Buy Now</span>
              </p>
            )}

            <button
              onClick={() => setShowCustomOrder(true)}
              className="w-full flex items-center justify-center space-x-2 border-2 border-dashed border-purple-300 bg-purple-50 text-purple-600 py-3 rounded-xl font-bold text-sm hover:bg-purple-100 transition-all mb-6"
            >
              <span>Request Custom Cake</span>
            </button>

            <div className="mt-2 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3 text-sm">
                <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-600">Free delivery on orders above ₹500</span>
              </div>
              <div className="flex items-center space-x-3 text-sm mt-2">
                <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-600">Delivery within 2-3 hours</span>
              </div>
              <div className="flex items-center space-x-3 text-sm mt-2">
                <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span className="text-gray-600">Cash on Delivery available</span>
              </div>
            </div>
          </div>
        </div>

        <Reviews
          productId={id}
          user={user}
          onReviewAdded={fetchProductDetails}
        />

        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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