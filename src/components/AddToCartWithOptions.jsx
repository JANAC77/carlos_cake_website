// src/components/AddToCartWithOptions.jsx
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
      // For Buy Now - Store in localStorage and proceed to checkout
      localStorage.setItem('buyNowItem', JSON.stringify(cartItem));
      onAddToCart(cartItem);
    } else {
      onAddToCart(cartItem);
    }
    onClose();
  };

  // Get occasion icon helper
  const getOccasionIcon = (occasionName) => {
    const occ = occasions.find(o => o.name === occasionName);
    return occ?.icon || '';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b sticky top-0 bg-white flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            {isBuyNow ? 'Complete Your Purchase' : 'Customize Your Order'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Product Info */}
          <div className="flex items-center space-x-4 pb-4 border-b">
            <img
              src={product.image || '/placeholder.png'}
              alt={product.name}
              className="w-16 h-16 rounded-lg object-cover"
              onError={(e) => { e.target.src = '/placeholder.png'; }}
            />
            <div>
              <h3 className="font-bold text-gray-900">{product.name}</h3>
              <p className="text-pink-600 font-bold">₹{product.price}</p>
            </div>
          </div>

          {/* Quantity Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-full border border-gray-300 hover:border-pink-500 transition-colors"
              >
                -
              </button>
              <span className="text-xl font-bold w-12 text-center">{quantity}</span>
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
                className={`w-8 h-8 rounded-full border border-gray-300 transition-colors ${
                  quantity >= (product.stock !== undefined && product.stock !== null ? Number(product.stock) : (product.quantity !== undefined && product.quantity !== null ? Number(product.quantity) : 99))
                    ? 'cursor-not-allowed opacity-50'
                    : 'hover:border-pink-500'
                }`}
              >
                +
              </button>
              <span className="text-xs text-gray-500">
                ({product.stock !== undefined && product.stock !== null ? Number(product.stock) : (product.quantity !== undefined && product.quantity !== null ? Number(product.quantity) : 99)} available)
              </span>
            </div>
          </div>

          {/* Dynamic Occasion Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Occasion <span className="text-xs text-gray-400">(Select to see relevant add-ons)</span>
            </label>
            {loadingOccasions ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-pink-500 border-t-transparent"></div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {occasions.map((occ) => (
                  <button
                    key={occ.id}
                    type="button"
                    onClick={() => setOccasion(occasion === occ.name ? '' : occ.name)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all ${occasion === occ.name
                      ? 'bg-pink-500 text-white'
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add-ons
              {occasion && <span className="text-xs text-pink-500 ml-2">✨ Recommended for {occasion}</span>}
            </label>
            {loadingAddOns ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-pink-500 border-t-transparent"></div>
              </div>
            ) : displayAddOns.length > 0 ? (
              <div className="space-y-2">
                {displayAddOns.map(addon => (
                  <button
                    key={addon.id}
                    type="button"
                    onClick={() => toggleAddon(addon)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${addons.find(a => a.id === addon.id)
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-200 hover:border-pink-200'
                      }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-left">
                        <span className="font-medium">{addon.name}</span>
                        {addon.description && (
                          <p className="text-xs text-gray-400">{addon.description}</p>
                        )}
                      </div>
                    </div>
                    <span className="text-pink-600 font-bold">+₹{addon.price}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-400 text-sm bg-gray-50 rounded-xl">
                {occasion ? (
                  <p>No specific add-ons available for {occasion}.<br />Select another occasion to see add-ons.</p>
                ) : (
                  <p>No add-ons available. Select an occasion to see recommendations.</p>
                )}
              </div>
            )}
          </div>

          {/* Cake Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message on Cake (Optional)</label>
            <input
              type="text"
              value={cakeMessage}
              onChange={(e) => setCakeMessage(e.target.value)}
              placeholder="e.g., Happy Birthday John! 🎂"
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500"
            />
          </div>

          {/* Selected Add-ons Summary */}
          {addons.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-sm font-medium text-gray-700 mb-2">Selected Add-ons:</p>
              <div className="space-y-1">
                {addons.map(addon => (
                  <div key={addon.id} className="flex justify-between text-sm">
                    <span>{addon.name}</span>
                    <span className="text-pink-600">+₹{addon.price}</span>
                  </div>
                ))}
                <div className="border-t pt-1 mt-1 flex justify-between font-medium">
                  <span>Add-ons Total</span>
                  <span className="text-pink-600">+₹{addons.reduce((sum, a) => sum + a.price, 0)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Total & Action */}
          <div className="pt-4 border-t">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-gray-900">Total Amount</span>
              <span className="text-2xl font-bold text-pink-600">₹{getTotalPrice()}</span>
            </div>
            <button
              onClick={handleSubmit}
              className="w-full bg-pink-500 text-white py-3 rounded-xl font-bold hover:bg-pink-600 transition-all"
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