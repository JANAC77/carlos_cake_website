// src/components/CheckoutPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createOrder } from '../firebase';

const CheckoutPage = ({ cart = [], user, onNavigate, showToast, clearCartAfterOrder = false, setCart }) => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Check if coming from Buy Now (single product) or Cart (multiple products)
    const buyNowProduct = location.state?.product || null;
    const buyNowQuantity = location.state?.quantity || 1;
    
    // Determine if this is single product checkout or cart checkout
    const isSingleProduct = !!buyNowProduct;
    const [loading, setLoading] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    
    // Get items for checkout
    const checkoutItems = isSingleProduct 
        ? [{ ...buyNowProduct, quantity: buyNowQuantity }]
        : cart;
    
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phoneNumber || '',
        address: user?.address || '',
        city: user?.city || '',
        pincode: user?.pincode || '',
        paymentMethod: 'cod'
    });

    // Calculate totals
    const subtotal = checkoutItems.reduce((sum, item) => {
        const price = parseFloat(item.price) || 0;
        return sum + (price * (item.quantity || 1));
    }, 0);
    const deliveryCharge = 0;
    const total = subtotal;

    // Update form when user changes
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || prev.name,
                email: user.email || prev.email,
                phone: user.phoneNumber || prev.phone,
                address: user.address || prev.address,
                city: user.city || prev.city,
                pincode: user.pincode || prev.pincode
            }));
        }
    }, [user]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handlePlaceOrder = async () => {
        if (!formData.name || !formData.email || !formData.phone || !formData.address) {
            if (showToast) showToast('Please fill all required fields!');
            return;
        }

        if (!user || !user.id) {
            if (showToast) showToast('Please login to place your order! 🔐');
            setTimeout(() => {
                navigate('/login');
            }, 1500);
            return;
        }

        setLoading(true);

        // Format address properly
        const formattedAddress = `${formData.address}, ${formData.city ? formData.city + ', ' : ''}${formData.pincode ? formData.pincode : ''}`.replace(/,\s*,/g, ',').replace(/,\s*$/, '');

        const orderData = {
            userId: user?.id || user?.uid || 'guest',
            customerName: formData.name,
            customerEmail: formData.email,
            customerPhone: formData.phone,
            deliveryAddress: formattedAddress,
            addressLine: formData.address,
            city: formData.city || '',
            pincode: formData.pincode || '',
            items: checkoutItems.map(item => ({
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
            if (showToast) showToast('Order placed successfully! 🎉');
            
            // Clear cart if coming from cart page
            if (!isSingleProduct && setCart) {
                setCart([]);
            }
            
            setTimeout(() => {
                navigate('/');
            }, 8000);
        } else {
            if (showToast) showToast('Order failed: ' + result.error);
        }

        setLoading(false);
    };

    // Check if user is logged in
    if (!user || !user.id) {
        return (
            <div className="min-h-screen bg-gray-50 pt-32 pb-24">
                <div className="max-w-2xl mx-auto px-6">
                    <div className="bg-white rounded-3xl p-12 shadow-xl text-center">
                        <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h2>
                        <p className="text-gray-500 mb-6">Please login to complete your purchase</p>
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-pink-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-900 transition"
                        >
                            Login Now
                        </button>
                    </div>
                </div>
            </div>
        );
    }

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
                            onClick={() => navigate('/')}
                            className="inline-block bg-pink-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-900 transition"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Check if cart is empty for cart checkout
    if (!isSingleProduct && checkoutItems.length === 0) {
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
                            onClick={() => navigate('/')}
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
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-gray-500 hover:text-pink-600 transition-colors mb-8 group"
                >
                    <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="font-black uppercase tracking-widest text-xs">Back</span>
                </button>

                <h1 className="text-3xl md:text-4xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tighter mb-8">
                    Checkout
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Order Items and Delivery Details */}
                    <div className="lg:col-span-2">
                        {/* Order Items Summary */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">
                                {isSingleProduct ? 'Order Summary' : `Order Items (${checkoutItems.length})`}
                            </h3>
                            <div className="space-y-4">
                                {checkoutItems.map((item, index) => (
                                    <div key={item.id || index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl">
                                        <div className="w-16 h-16 bg-pink-50 rounded-xl overflow-hidden flex-shrink-0">
                                            <img 
                                                src={item.image || '/placeholder.png'} 
                                                alt={item.name} 
                                                className="w-full h-full object-cover"
                                                onError={(e) => { e.target.src = '/placeholder.png'; }}
                                            />
                                        </div>
                                        <div className="flex-grow">
                                            <h4 className="font-bold text-gray-900">{item.name}</h4>
                                            <p className="text-gray-500 text-sm">Quantity: {item.quantity || 1}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-pink-600">₹{(item.price || 0) * (item.quantity || 1)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Delivery Details Form */}
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
                                        <option value="cod">Cash on Delivery (COD)</option>
                                        <option value="upi">UPI (Google Pay, PhonePe, Paytm)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Price Summary */}
                    <div>
                        <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-32">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Price Details</h3>

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">
                                        Price ({checkoutItems.reduce((sum, item) => sum + (item.quantity || 1), 0)} items)
                                    </span>
                                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Delivery Fee</span>
                                    <span className="text-green-600 font-medium">FREE</span>
                                </div>
                                <div className="border-t border-gray-100 pt-3 mt-3">
                                    <div className="flex justify-between">
                                        <span className="font-bold text-gray-900">Total Amount</span>
                                        <span className="font-bold text-pink-600 text-xl">₹{total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 p-3 bg-green-50 rounded-xl">
                                <div className="flex items-center space-x-2">
                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <p className="text-xs text-green-700">You saved ₹{deliveryCharge} on delivery</p>
                                </div>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={loading}
                                className="w-full bg-pink-600 text-white py-3 rounded-xl font-bold hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                            >
                                {loading ? 'Placing Order...' : `Place Order • ₹${total.toFixed(2)}`}
                            </button>

                            <p className="text-center text-xs text-gray-400 mt-3">
                                By placing this order, you agree to our terms and conditions
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;