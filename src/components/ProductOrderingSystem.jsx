// components/ProductOrderingSystem.jsx - Add this new component for customer-facing features
import { useState, useEffect } from 'react';
import { createOrder, getDeliveryCharges, getAvailableTimeSlots, getHolidayDates } from '../firebase';

const ProductOrderingSystem = ({ product, user, onClose, onOrderSuccess }) => {
  const [quantity, setQuantity] = useState(1);
  const [addons, setAddons] = useState([]);
  const [cakeMessage, setCakeMessage] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [deliveryArea, setDeliveryArea] = useState('');
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [occasion, setOccasion] = useState('');
  const [customCakeDetails, setCustomCakeDetails] = useState({
    flavor: '',
    size: '',
    design: '',
    referenceImage: null
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: basic, 2: customization, 3: delivery, 4: payment

  const addonsList = [
    { id: 'candle', name: 'Birthday Candle Set', price: 50, icon: '🕯️' },
    { id: 'message', name: 'Custom Message on Cake', price: 100, icon: '💬' },
    { id: 'gift_box', name: 'Premium Gift Box', price: 150, icon: '🎁' },
    { id: 'cake_topper', name: 'Custom Cake Topper', price: 200, icon: '🎀' },
    { id: 'cutlery', name: 'Cutlery Set + Napkins', price: 25, icon: '🍴' },
    { id: 'balloon', name: 'Balloon Bouquet', price: 150, icon: '🎈' }
  ];

  const occasionsList = [
    'Birthday', 'Anniversary', 'Wedding', 'Engagement', 'Baby Shower',
    'Graduation', 'Retirement', 'Corporate Event', 'Just Because', 'Other'
  ];

  const cakeFlavors = [
    'Vanilla', 'Chocolate', 'Strawberry', 'Red Velvet', 'Black Forest',
    'Pineapple', 'Mango', 'Butterscotch', 'Caramel', 'Lemon'
  ];

  const cakeSizes = [
    { name: '6 inches', serves: '4-6 people', priceMultiplier: 1 },
    { name: '8 inches', serves: '8-12 people', priceMultiplier: 1.5 },
    { name: '10 inches', serves: '14-18 people', priceMultiplier: 2 },
    { name: '12 inches', serves: '20-25 people', priceMultiplier: 2.5 },
    { name: '14 inches', serves: '30-35 people', priceMultiplier: 3 }
  ];

  useEffect(() => {
    // Set minimum date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    // Load available time slots
    loadTimeSlots();
  }, [deliveryDate]);

  const loadTimeSlots = async () => {
    const slots = await getAvailableTimeSlots(deliveryDate);
    setAvailableTimeSlots(slots);
  };

  const handleDeliveryAreaChange = (area) => {
    setDeliveryArea(area.name);
    setDeliveryCharge(area.charge);
  };

  const handleAddonToggle = (addon) => {
    setAddons(prev => {
      const exists = prev.find(a => a.id === addon.id);
      if (exists) {
        return prev.filter(a => a.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
  };

  const getBasePrice = () => {
    if (occasion === 'Custom Cake' && customCakeDetails.size) {
      const size = cakeSizes.find(s => s.name === customCakeDetails.size);
      return (product?.price || 500) * (size?.priceMultiplier || 1) * quantity;
    }
    return (product?.price || 0) * quantity;
  };

  const getAddonsTotal = () => {
    return addons.reduce((sum, addon) => sum + addon.price, 0);
  };

  const getTotalPrice = () => {
    return getBasePrice() + getAddonsTotal() + deliveryCharge;
  };

  const handlePlaceOrder = async () => {
    setLoading(true);

    const orderData = {
      userId: user?.id || 'guest',
      customerName: user?.name || '',
      customerEmail: user?.email || '',
      customerPhone: user?.phoneNumber || '',
      deliveryAddress: deliveryArea,
      deliveryDate: deliveryDate,
      deliveryTimeSlot: deliveryTimeSlot,
      deliveryCharge: deliveryCharge,
      occasion: occasion,
      items: product ? [{
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        addons: addons,
        cakeMessage: cakeMessage
      }] : [],
      customCake: occasion === 'Custom Cake' ? customCakeDetails : null,
      specialInstructions: specialInstructions,
      subtotal: getBasePrice(),
      addonsTotal: getAddonsTotal(),
      total: getTotalPrice(),
      status: 'pending',
      paymentMethod: 'cod',
      createdAt: new Date().toISOString()
    };

    const result = await createOrder(orderData);

    if (result.success) {
      onOrderSuccess && onOrderSuccess(result.id);
    } else {
      alert('Order failed: ' + result.error);
    }

    setLoading(false);
  };

  const deliveryAreas = [
    { name: 'Munekolal', charge: 100, estimatedTime: '30-45 min' },
    { name: 'Marathahalli', charge: 100, estimatedTime: '30-45 min' },
    { name: 'Bellandur', charge: 100, estimatedTime: '20-35 min' },
    { name: 'Sarjapur Road', charge: 100, estimatedTime: '25-40 min' },
    { name: 'Electronic City', charge: 120, estimatedTime: '35-50 min' },
    { name: 'Whitefield', charge: 150, estimatedTime: '45-60 min' },
    { name: 'Koramangala', charge: 120, estimatedTime: '30-45 min' },
    { name: 'Indiranagar', charge: 130, estimatedTime: '35-50 min' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b sticky top-0 bg-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {occasion === 'Custom Cake' ? 'Custom Cake Order' : (product?.name || 'Place Order')}
              </h2>
              <div className="flex items-center space-x-2 mt-2">
                {[1, 2, 3, 4].map((s) => (
                  <div key={s} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-500'
                      }`}>
                      {s}
                    </div>
                    {s < 4 && <div className={`w-8 h-0.5 ${step > s ? 'bg-pink-500' : 'bg-gray-200'}`}></div>}
                  </div>
                ))}
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Step 1: Occasion Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-gray-900 mb-4">What's the occasion?</h3>
                <div className="grid grid-cols-2 gap-3">
                  {occasionsList.map((occ) => (
                    <button
                      key={occ}
                      onClick={() => {
                        setOccasion(occ);
                        setStep(2);
                      }}
                      className="p-4 text-left border rounded-xl hover:border-pink-500 hover:bg-pink-50 transition-all"
                    >
                      <span className="text-lg mr-2">
                        {occ === 'Birthday' ? '🎂' : occ === 'Anniversary' ? '💑' : occ === 'Wedding' ? '💒' : '🎉'}
                      </span>
                      <span className="font-medium">{occ}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Customization */}
          {step === 2 && (
            <div className="space-y-6">
              {occasion === 'Custom Cake' ? (
                <>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-4">Cake Flavor</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {cakeFlavors.map((flavor) => (
                        <button
                          key={flavor}
                          onClick={() => setCustomCakeDetails({ ...customCakeDetails, flavor })}
                          className={`p-2 rounded-lg border transition-all ${customCakeDetails.flavor === flavor
                              ? 'border-pink-500 bg-pink-50 text-pink-600'
                              : 'border-gray-200 hover:border-pink-200'
                            }`}
                        >
                          {flavor}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 mb-4">Cake Size</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {cakeSizes.map((size) => (
                        <button
                          key={size.name}
                          onClick={() => setCustomCakeDetails({ ...customCakeDetails, size: size.name })}
                          className={`p-3 rounded-xl border text-left transition-all ${customCakeDetails.size === size.name
                              ? 'border-pink-500 bg-pink-50'
                              : 'border-gray-200 hover:border-pink-200'
                            }`}
                        >
                          <p className="font-bold">{size.name}</p>
                          <p className="text-xs text-gray-500">Serves {size.serves}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 mb-4">Design Description</h3>
                    <textarea
                      value={customCakeDetails.design}
                      onChange={(e) => setCustomCakeDetails({ ...customCakeDetails, design: e.target.value })}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-pink-500"
                      placeholder="Describe the design you want (colors, theme, decorations...)"
                    />
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 mb-4">Quantity</h3>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-full border border-gray-300 hover:border-pink-500"
                      >-</button>
                      <span className="text-xl font-bold w-12 text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 rounded-full border border-gray-300 hover:border-pink-500"
                      >+</button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-4">Quantity</h3>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-full border border-gray-300 hover:border-pink-500"
                      >-</button>
                      <span className="text-xl font-bold w-12 text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 rounded-full border border-gray-300 hover:border-pink-500"
                      >+</button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 mb-4">Add-ons</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {addonsList.map((addon) => (
                        <button
                          key={addon.id}
                          onClick={() => handleAddonToggle(addon)}
                          className={`flex items-center justify-between p-3 rounded-xl border transition-all ${addons.find(a => a.id === addon.id)
                              ? 'border-pink-500 bg-pink-50'
                              : 'border-gray-200 hover:border-pink-200'
                            }`}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-xl">{addon.icon}</span>
                            <span className="text-sm">{addon.name}</span>
                          </div>
                          <span className="text-sm font-bold text-pink-600">₹{addon.price}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 mb-4">Cake Message</h3>
                    <input
                      type="text"
                      value={cakeMessage}
                      onChange={(e) => setCakeMessage(e.target.value)}
                      placeholder="e.g., Happy Birthday John!"
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-pink-500"
                    />
                  </div>
                </>
              )}

              <div>
                <h3 className="font-bold text-gray-900 mb-4">Special Instructions</h3>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-pink-500"
                  placeholder="Any dietary restrictions, allergies, or special requests?"
                />
              </div>

              <button
                onClick={() => setStep(3)}
                className="w-full bg-pink-500 text-white py-3 rounded-xl font-medium hover:bg-pink-600 transition-colors"
              >
                Continue to Delivery
              </button>
            </div>
          )}

          {/* Step 3: Delivery Details */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Delivery Area</h3>
                <div className="grid grid-cols-1 gap-3">
                  {deliveryAreas.map((area) => (
                    <button
                      key={area.name}
                      onClick={() => handleDeliveryAreaChange(area)}
                      className={`flex justify-between items-center p-4 rounded-xl border transition-all ${deliveryArea === area.name
                          ? 'border-pink-500 bg-pink-50'
                          : 'border-gray-200 hover:border-pink-200'
                        }`}
                    >
                      <div>
                        <p className="font-bold">{area.name}</p>
                        <p className="text-xs text-gray-500">Est. delivery: {area.estimatedTime}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-pink-600">₹{area.charge}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-4">Delivery Date</h3>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-pink-500"
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 1 day advance for regular orders, 3 days for custom cakes</p>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-4">Delivery Time Slot</h3>
                <div className="grid grid-cols-2 gap-2">
                  {availableTimeSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setDeliveryTimeSlot(slot)}
                      className={`p-2 rounded-lg border text-center transition-all ${deliveryTimeSlot === slot
                          ? 'border-pink-500 bg-pink-50 text-pink-600'
                          : 'border-gray-200 hover:border-pink-200'
                        }`}
                    >
                      {slot}
                      {slot.includes('PM') && <span className="block text-xs text-gray-400">Evening</span>}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setStep(4)}
                disabled={!deliveryArea || !deliveryDate || !deliveryTimeSlot}
                className="w-full bg-pink-500 text-white py-3 rounded-xl font-medium hover:bg-pink-600 transition-colors disabled:opacity-50"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {/* Step 4: Order Summary & Payment */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-bold text-gray-900 mb-3">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Item Total</span>
                    <span>₹{getBasePrice()}</span>
                  </div>
                  {addons.length > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Add-ons</span>
                      <span>₹{getAddonsTotal()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Delivery Charge</span>
                    <span>₹{deliveryCharge}</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold">
                      <span>Total Amount</span>
                      <span className="text-pink-600 text-xl">₹{getTotalPrice()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg">💰</span>
                  </div>
                  <div>
                    <p className="font-bold text-green-800">Cash on Delivery</p>
                    <p className="text-xs text-green-600">Pay when you receive your order</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="flex-1 bg-pink-500 text-white py-3 rounded-xl font-bold hover:bg-pink-600 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Placing Order...' : 'Place Order • ₹' + getTotalPrice()}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductOrderingSystem;