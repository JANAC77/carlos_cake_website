// src/components/Cart.jsx
import { useState } from 'react';
import { createOrder } from '../firebase';

const Cart = ({ isOpen, onClose, items, setItems, user }) => {
  const [isCheckoutMode, setIsCheckoutMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    paymentMethod: 'cod'
  });

  const subtotal = items.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0;
    return sum + (price * (item.quantity || 1));
  }, 0);

  const deliveryCharge = subtotal > 500 ? 0 : 50;
  const total = subtotal + deliveryCharge;

  const removeItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, delta) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, (item.quantity || 1) + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = async () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      alert('Please fill all required fields');
      return;
    }

    setLoading(true);

    const orderData = {
      userId: user?.id || 'guest',
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      deliveryAddress: `${formData.address}, ${formData.city} - ${formData.pincode}`,
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
        image: item.image
      })),
      subtotal: subtotal,
      deliveryCharge: deliveryCharge,
      total: total,
      paymentMethod: formData.paymentMethod,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const result = await createOrder(orderData);

    if (result.success) {
      setOrderSuccess(true);
      setItems([]);
      setTimeout(() => {
        onClose();
        setOrderSuccess(false);
        setIsCheckoutMode(false);
      }, 3000);
    } else {
      alert('Order failed: ' + result.error);
    }

    setLoading(false);
  };

  const handleProceedToCheckout = () => {
    if (items.length === 0) {
      alert('Your cart is empty');
      return;
    }
    setIsCheckoutMode(true);
  };

  // Success Screen
  if (orderSuccess) {
    return (
      <div className={`fixed inset-0 z-[100] transition-all duration-500 ${isOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose}></div>
        <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl transition-transform duration-500 transform translate-x-0">
          <div className="h-full flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
            <p className="text-gray-500 mb-6">Thank you for your order. We'll deliver it soon.</p>
            <button onClick={onClose} className="bg-pink-600 text-white px-6 py-3 rounded-xl font-bold">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 z-[100] transition-all duration-500 ${isOpen ? 'visible' : 'invisible'}`}>
      <div className={`absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose}></div>

      <div className={`absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl transition-transform duration-500 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col p-6 lg:p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tight">
              {isCheckoutMode ? 'Checkout' : 'Your Cart'}
            </h2>
            <button onClick={() => {
              if (isCheckoutMode) {
                setIsCheckoutMode(false);
              } else {
                onClose();
              }
            }} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {!isCheckoutMode ? (
            // Cart View
            <>
              <div className="flex-grow overflow-y-auto">
                {items.length > 0 ? (
                  <div className="space-y-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex space-x-4 items-center">
                        <div className="w-20 h-20 bg-pink-50 rounded-xl overflow-hidden flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-gray-900">{item.name}</h4>
                            <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                          <p className="text-pink-600 font-bold text-sm mb-2">₹{item.price}</p>
                          <div className="flex items-center space-x-3">
                            <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 rounded-lg border border-gray-200 hover:bg-gray-50">-</button>
                            <span className="font-bold text-gray-900">{item.quantity || 1}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 rounded-lg border border-gray-200 hover:bg-gray-50">+</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center text-pink-600 mb-4">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 11h14l1 12H4L5 11z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900">Your cart is empty</h4>
                    <p className="text-gray-400 text-sm mt-2">Add some delicious cakes to your cart!</p>
                  </div>
                )}
              </div>

              {items.length > 0 && (
                <div className="pt-6 mt-6 border-t border-gray-100">
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-bold text-gray-900">₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Delivery Charge</span>
                      <span className="font-bold text-gray-900">₹{deliveryCharge.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg pt-2 border-t border-gray-100">
                      <span className="font-bold text-gray-900">Total</span>
                      <span className="font-bold text-pink-600">₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleProceedToCheckout}
                    className="w-full bg-pink-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-gray-900 transition-all"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </>
          ) : (
            // Checkout View
            <>
              <div className="flex-grow overflow-y-auto">
                {/* Order Summary */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <h3 className="font-bold text-gray-900 mb-3">Order Summary</h3>
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm mb-2">
                      <span>{item.name} x {item.quantity}</span>
                      <span>₹{item.price * (item.quantity || 1)}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 mt-3 pt-3">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-pink-600">₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Delivery Details Form */}
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900">Delivery Details</h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address *</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                    <select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500"
                    >
                      <option value="cod">Cash on Delivery</option>
                      <option value="card">Credit/Debit Card</option>
                      <option value="upi">UPI</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Checkout Buttons */}
              <div className="pt-6 mt-6 border-t border-gray-100 space-y-3">
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="w-full bg-pink-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-gray-900 transition-all disabled:opacity-50"
                >
                  {loading ? 'Placing Order...' : `Place Order • ₹${total.toFixed(2)}`}
                </button>
                <button
                  onClick={() => setIsCheckoutMode(false)}
                  className="w-full border border-gray-200 text-gray-600 py-3 rounded-xl font-medium text-sm hover:bg-gray-50 transition-all"
                >
                  Back to Cart
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;