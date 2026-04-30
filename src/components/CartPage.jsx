// src/components/CartPage.jsx
import { useState } from 'react';
import { createOrder } from '../firebase';

const CartPage = ({ cart, setCart, user, onNavigate, showToast }) => {
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

    const subtotal = cart.reduce((sum, item) => {
        const price = parseFloat(item.price) || 0;
        return sum + (price * (item.quantity || 1));
    }, 0);

    const deliveryCharge = subtotal > 500 ? 0 : 50;
    const total = subtotal + deliveryCharge;

    const removeItem = (id) => {
        const item = cart.find(i => i.id === id);
        setCart(prev => prev.filter(item => item.id !== id));
        showToast(`${item?.name} removed from cart! 🗑️`, 'error');
    };

    const updateQuantity = (id, delta) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, (item.quantity || 1) + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
        const item = cart.find(i => i.id === id);
        if (delta > 0) {
            showToast(`Increased quantity of ${item?.name}`, 'success');
        } else {
            showToast(`Decreased quantity of ${item?.name}`, 'success');
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handlePlaceOrder = async () => {
        if (!formData.name || !formData.email || !formData.phone || !formData.address) {
            showToast('Please fill all required fields!', 'error');
            return;
        }

        setLoading(true);

        const orderData = {
            userId: user?.id || 'guest',
            customerName: formData.name,
            customerEmail: formData.email,
            customerPhone: formData.phone,
            deliveryAddress: `${formData.address}, ${formData.city} - ${formData.pincode}`,
            items: cart.map(item => ({
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
            setCart([]);
            showToast('Order placed successfully! 🎉', 'success');
            setTimeout(() => {
                setOrderSuccess(false);
                setIsCheckoutMode(false);
                onNavigate('home');
            }, 3000);
        } else {
            showToast('Order failed: ' + result.error, 'error');
        }

        setLoading(false);
    };

    // Success Screen
    if (orderSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 pt-32 pb-24">
                <div className="max-w-2xl mx-auto px-6 text-center">
                    <div className="bg-white rounded-3xl p-12 shadow-xl">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
                        <p className="text-gray-500 mb-6">Thank you for your order. We'll deliver it soon.</p>
                        <button
                            onClick={() => onNavigate('home')}
                            className="inline-block bg-pink-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-900 transition"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Empty Cart
    if (cart.length === 0 && !isCheckoutMode) {
        return (
            <div className="min-h-screen bg-gray-50 pt-32 pb-24">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="bg-white rounded-3xl p-12 shadow-xl">
                        <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 11h14l1 12H4L5 11z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
                        <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
                        <button
                            onClick={() => onNavigate('home')}
                            className="inline-block bg-pink-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-900 transition"
                        >
                            Browse Cakes
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                {/* Back Button */}
                <div className="mb-8">
                    <button
                        onClick={() => isCheckoutMode ? setIsCheckoutMode(false) : onNavigate('home')}
                        className="flex items-center space-x-2 text-gray-500 hover:text-pink-600 transition-colors group"
                    >
                        <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="font-black uppercase tracking-widest text-xs">
                            {isCheckoutMode ? 'Back to Cart' : 'Continue Shopping'}
                        </span>
                    </button>
                </div>

                <h1 className="text-3xl md:text-4xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tighter mb-8">
                    {isCheckoutMode ? 'Checkout' : 'Shopping Cart'}
                </h1>

                {!isCheckoutMode ? (
                    // Cart View
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                                <div className="divide-y divide-gray-100">
                                    {cart.map((item) => (
                                        <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-6">
                                            <div className="w-32 h-32 bg-pink-50 rounded-xl overflow-hidden flex-shrink-0">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-grow">
                                                <div className="flex flex-col sm:flex-row justify-between gap-4">
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
                                                        <p className="text-gray-500 text-sm mt-1">{item.category}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xl font-bold text-pink-600">₹{item.price}</p>
                                                        <button
                                                            onClick={() => removeItem(item.id)}
                                                            className="text-red-500 text-sm hover:text-red-600 mt-1"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-4 mt-4">
                                                    <div className="flex items-center border border-gray-200 rounded-lg">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, -1)}
                                                            className="px-3 py-2 hover:bg-gray-50 text-gray-600"
                                                        >
                                                            -
                                                        </button>
                                                        <span className="px-4 py-2 font-bold text-gray-900 border-x border-gray-200">
                                                            {item.quantity || 1}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, 1)}
                                                            className="px-3 py-2 hover:bg-gray-50 text-gray-600"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                    <p className="text-gray-500 text-sm">
                                                        Total: ₹{item.price * (item.quantity || 1)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div>
                            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-32">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Subtotal ({cart.length} items)</span>
                                        <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Delivery Charge</span>
                                        <span className="font-medium">₹{deliveryCharge.toFixed(2)}</span>
                                    </div>
                                    {subtotal < 500 && (
                                        <p className="text-xs text-gray-400">Add ₹{(500 - subtotal).toFixed(2)} more for free delivery</p>
                                    )}
                                    <div className="border-t border-gray-100 pt-3 mt-3">
                                        <div className="flex justify-between">
                                            <span className="font-bold text-gray-900">Total</span>
                                            <span className="font-bold text-pink-600 text-xl">₹{total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsCheckoutMode(true)}
                                    className="w-full bg-pink-600 text-white py-3 rounded-xl font-bold hover:bg-gray-900 transition"
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Checkout View
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Delivery Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-6">Delivery Details</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500"
                                            placeholder="Enter your full name"
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
                                            placeholder="your@email.com"
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
                                            placeholder="10-digit mobile number"
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
                                            placeholder="Enter pincode"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address *</label>
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            required
                                            rows="3"
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500"
                                            placeholder="House No, Street, Landmark, Area"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500"
                                            placeholder="Enter city"
                                        />
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
                                            <option value="upi">UPI (Google Pay, PhonePe, Paytm)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary Checkout */}
                        <div>
                            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-32">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>

                                <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                                    {cart.map((item) => (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <span className="text-gray-600">{item.name} x{item.quantity}</span>
                                            <span className="font-medium">₹{item.price * (item.quantity || 1)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-gray-100 pt-3 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Subtotal</span>
                                        <span>₹{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Delivery Charge</span>
                                        <span>₹{deliveryCharge.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-gray-100 pt-3 mt-2">
                                        <div className="flex justify-between">
                                            <span className="font-bold text-gray-900">Total Amount</span>
                                            <span className="font-bold text-pink-600 text-xl">₹{total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={loading}
                                    className="w-full bg-pink-600 text-white py-3 rounded-xl font-bold hover:bg-gray-900 transition disabled:opacity-50 mt-6"
                                >
                                    {loading ? 'Placing Order...' : `Place Order • ₹${total.toFixed(2)}`}
                                </button>

                                <button
                                    onClick={() => setIsCheckoutMode(false)}
                                    className="w-full text-gray-500 text-center py-2 text-sm hover:text-pink-600 transition mt-3"
                                >
                                    Back to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;