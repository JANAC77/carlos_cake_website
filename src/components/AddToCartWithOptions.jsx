// src/components/AddToCartWithOptions.jsx - Redesigned customization modal
import { useState, useEffect } from 'react';
import { getAddOns, getAddOnsByOccasion, getOccasions } from '../firebase';

const AddToCartWithOptions = ({ product, onAddToCart, onClose, isBuyNow = false }) => {
  const [quantity, setQuantity] = useState(1);
  const [addons, setAddons] = useState([]);
  const [cakeMessage, setCakeMessage] = useState('');
  const [occasion, setOccasion] = useState('');
  const [availableAddOns, setAvailableAddOns] = useState([]);
  const [loadingAddOns, setLoadingAddOns] = useState(true);
  const [selectedOccasionAddOns, setSelectedOccasionAddOns] = useState([]);

  // Dynamic occasions state
  const [occasions, setOccasions] = useState([]);
  const [loadingOccasions, setLoadingOccasions] = useState(true);

  // Load occasions and add-ons from Firebase on mount
  useEffect(() => {
    loadOccasions();
    loadAddOns();
  }, []);

  // Load occasion-specific add-ons when occasion changes
  useEffect(() => {
    if (occasion) {
      loadOccasionAddOns(occasion);
    } else {
      setSelectedOccasionAddOns([]);
    }
  }, [occasion]);

  const loadOccasions = async () => {
    setLoadingOccasions(true);
    try {
      const occasionsData = await getOccasions();
      setOccasions(occasionsData);
    } catch (error) {
      console.error("Error loading occasions:", error);
    } finally {
      setLoadingOccasions(false);
    }
  };

  const loadAddOns = async () => {
    setLoadingAddOns(true);
    try {
      const addOnsData = await getAddOns();
      setAvailableAddOns(addOnsData);
    } catch (error) {
      console.error("Error loading add-ons:", error);
    } finally {
      setLoadingAddOns(false);
    }
  };

  const loadOccasionAddOns = async (occasionName) => {
    try {
      const occasionAddOns = await getAddOnsByOccasion(occasionName);
      setSelectedOccasionAddOns(occasionAddOns);
    } catch (error) {
      console.error("Error loading occasion add-ons:", error);
      setSelectedOccasionAddOns([]);
    }
  };

  // Show add-ons based on selected occasion or all
  const displayAddOns = occasion ? selectedOccasionAddOns : availableAddOns;

  const toggleAddon = (addon) => {
    setAddons(prev => {
      const exists = prev.find(a => a.id === addon.id);
      if (exists) return prev.filter(a => a.id !== addon.id);
      return [...prev, addon];
    });
  };

  const getTotalPrice = () => {
    const productTotal = product.price * quantity;
    const addonsTotal = addons.reduce((sum, a) => sum + (a.price || 0), 0);
    return productTotal + addonsTotal;
  };

  const handleSubmit = () => {
    const cartItem = {
      ...product,
      quantity,
      addons: addons.map(a => ({
        id: a.id,
        name: a.name,
        price: a.price,
        icon: a.icon
      })),
      cakeMessage: cakeMessage,
      occasion: occasion,
      totalPrice: getTotalPrice()
    };

    if (isBuyNow) {
      localStorage.setItem('buyNowItem', JSON.stringify(cartItem));
      onAddToCart(cartItem);
    } else {
      onAddToCart(cartItem);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-[2.5rem] max-w-md w-full max-h-[85vh] overflow-y-auto border border-gray-100 shadow-2xl relative no-scrollbar">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-md flex justify-between items-center z-10">
          <h2 className="text-base font-black text-obsidian-dark uppercase tracking-wider">
            {isBuyNow ? 'Complete Purchase' : 'Customize Order'}
          </h2>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-rose-gold transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Product Info */}
          <div className="flex items-center space-x-4 pb-4 border-b border-gray-100">
            <img
              src={product.image || '/placeholder.png'}
              alt={product.name}
              className="w-16 h-16 rounded-2xl object-cover shadow-sm border border-gray-100"
              onError={(e) => { e.target.src = '/placeholder.png'; }}
            />
            <div>
              <h3 className="font-bold text-gray-900 text-sm">{product.name}</h3>
              <p className="text-rose-gold font-black text-sm mt-0.5">₹{product.price}</p>
            </div>
          </div>

          {/* Quantity Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2.5">Quantity</label>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-rose-gold hover:text-rose-gold hover:bg-rose-gold/5 transition-all text-lg font-bold cursor-pointer"
              >
                -
              </button>
              <span className="text-lg font-black w-8 text-center">{quantity}</span>
              <button
                onClick={() => {
                  const stockLimit = product.stock !== undefined && product.stock !== null ? Number(product.stock) : (product.quantity !== undefined && product.quantity !== null ? Number(product.quantity) : 99);
                  if (quantity >= stockLimit) {
                    alert("Stock full");
                    return;
                  }
                  setQuantity(quantity + 1);
                }}
                disabled={quantity >= (product.stock !== undefined && product.stock !== null ? Number(product.stock) : (product.quantity !== undefined && product.quantity !== null ? Number(product.quantity) : 99))}
                className={`w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 transition-all text-lg font-bold cursor-pointer ${
                  quantity >= (product.stock !== undefined && product.stock !== null ? Number(product.stock) : (product.quantity !== undefined && product.quantity !== null ? Number(product.quantity) : 99))
                    ? 'cursor-not-allowed opacity-50'
                    : 'hover:border-rose-gold hover:text-rose-gold hover:bg-rose-gold/5'
                }`}
              >
                +
              </button>
              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                ({product.stock !== undefined && product.stock !== null ? Number(product.stock) : (product.quantity !== undefined && product.quantity !== null ? Number(product.quantity) : 99)} left)
              </span>
            </div>
          </div>

          {/* Dynamic Occasion Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2.5">
              Occasion <span className="text-[10px] text-gray-400 font-semibold lowercase">(optional filter)</span>
            </label>
            {loadingOccasions ? (
              <div className="flex justify-center py-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-rose-gold border-t-transparent"></div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {occasions.map((occ) => (
                  <button
                    key={occ.id}
                    type="button"
                    onClick={() => setOccasion(occasion === occ.name ? '' : occ.name)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 transform active:scale-95 cursor-pointer ${occasion === occ.name
                      ? 'bg-rose-gold text-white shadow-premium-glow'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    {occ.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Add-ons - Dynamic based on occasion */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2.5">
              Add-ons
              {occasion && <span className="text-[10px] font-bold text-rose-gold ml-2 animate-pulse">✨ Best for {occasion}</span>}
            </label>
            {loadingAddOns ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-rose-gold border-t-transparent"></div>
              </div>
            ) : displayAddOns.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar pr-1">
                {displayAddOns.map(addon => {
                  const isSelected = addons.some(a => a.id === addon.id);
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => toggleAddon(addon)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-200 text-left cursor-pointer ${isSelected
                        ? 'border-rose-gold bg-rose-gold/5'
                        : 'border-gray-200 hover:border-rose-gold/30 hover:bg-gray-50'
                        }`}
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        <span className="text-xs font-bold text-gray-900 block truncate">{addon.name}</span>
                        {addon.description && (
                          <p className="text-[10px] text-gray-400 font-semibold truncate mt-0.5">{addon.description}</p>
                        )}
                      </div>
                      <span className="text-rose-gold font-black text-xs flex-shrink-0">+₹{addon.price}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-400 text-xs bg-gray-50 rounded-2xl">
                {occasion ? (
                  <p>No specific add-ons available for {occasion}.<br />Select another occasion or clear filter.</p>
                ) : (
                  <p>No add-ons available.</p>
                )}
              </div>
            )}
          </div>

          {/* Cake Message */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2.5">Message on Cake (Optional)</label>
            <input
              type="text"
              value={cakeMessage}
              onChange={(e) => setCakeMessage(e.target.value)}
              placeholder="e.g., Happy Birthday John! 🎂"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-rose-gold focus:shadow-[0_0_10px_rgba(244,63,94,0.1)] text-xs font-medium transition-all"
            />
          </div>

          {/* Total & Action */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-gray-500 text-xs uppercase tracking-wider">Total Amount</span>
              <span className="text-2xl font-black text-rose-gold">₹{getTotalPrice()}</span>
            </div>
            <button
              onClick={handleSubmit}
              className="w-full bg-rose-gold text-white py-3.5 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-obsidian-dark hover:shadow-lg transition-all duration-300 transform active:scale-95 cursor-pointer"
            >
              {isBuyNow ? `Buy Now • ₹${getTotalPrice()}` : `Add to Cart • ₹${getTotalPrice()}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddToCartWithOptions;