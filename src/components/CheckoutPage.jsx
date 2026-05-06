// src/components/CheckoutPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createOrder } from '../firebase';
import { sendOrderConfirmationEmail } from '../services/emailService';
import emailjs from '@emailjs/browser';

// Initialize EmailJS
emailjs.init('YOUR_PUBLIC_KEY'); // Replace with your public key

const CheckoutPage = ({ cart = [], user, onNavigate, showToast, clearCartAfterOrder = false, setCart }) => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const buyNowProduct = location.state?.product || null;
    const buyNowQuantity = location.state?.quantity || 1;
    const isSingleProduct = !!buyNowProduct;
    const [loading, setLoading] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [gettingLocation, setGettingLocation] = useState(false);
    const [locationError, setLocationError] = useState('');
    const [emailSent, setEmailSent] = useState(false);
    
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

    const DELIVERY_CHARGE = 100;
    
    const subtotal = checkoutItems.reduce((sum, item) => {
        const price = parseFloat(item.price) || 0;
        return sum + (price * (item.quantity || 1));
    }, 0);
    
    const deliveryCharge = DELIVERY_CHARGE;
    const total = subtotal + deliveryCharge;

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

    useEffect(() => {
        if (orderSuccess && orderId && !emailSent) {
            sendEmailConfirmation();
        }
    }, [orderSuccess, orderId, emailSent]);

    const sendEmailConfirmation = async () => {
        const formattedAddress = `${formData.address}, ${formData.city ? formData.city + ', ' : ''}${formData.pincode || ''}`.replace(/,\s*,/g, ',').replace(/,\s*$/, '');
        
        const orderData = {
            customerName: formData.name,
            customerEmail: formData.email,
            customerPhone: formData.phone,
            deliveryAddress: formattedAddress,
            items: checkoutItems,
            subtotal: subtotal,
            deliveryCharge: deliveryCharge,
            total: total,
            paymentMethod: formData.paymentMethod,
            orderId: orderId
        };

        const result = await sendOrderConfirmationEmail(orderData);
        
        if (result.success) {
            console.log('Confirmation email sent successfully');
            setEmailSent(true);
        } else {
            console.error('Failed to send email:', result.error);
            // Don't show error to user as order is already placed
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (e.target.name === 'city' || e.target.name === 'pincode' || e.target.name === 'address') {
            setLocationError('');
        }
    };

    const getCurrentLocation = () => {
        setGettingLocation(true);
        setLocationError('');

        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by your browser');
            setGettingLocation(false);
            if (showToast) showToast('Geolocation not supported in your browser');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                
                try {
                    if (showToast) showToast('📍 Fetching your address...');
                    
                    const addressData = await getAddressFromCoordinates(latitude, longitude);
                    
                    if (addressData) {
                        let fullAddress = '';
                        
                        if (addressData.houseNumber) fullAddress += addressData.houseNumber;
                        if (addressData.road) fullAddress += fullAddress ? ', ' + addressData.road : addressData.road;
                        if (addressData.landmark) fullAddress += fullAddress ? ', ' + addressData.landmark : addressData.landmark;
                        if (addressData.suburb) fullAddress += fullAddress ? ', ' + addressData.suburb : addressData.suburb;
                        if (!fullAddress && addressData.displayName) fullAddress = addressData.displayName;
                        
                        setFormData(prev => ({
                            ...prev,
                            address: prev.address || fullAddress,
                            city: addressData.city || prev.city,
                            pincode: addressData.pincode || prev.pincode
                        }));
                        
                        if (showToast) showToast('📍 Address detected successfully!');
                        setLocationError('');
                    } else {
                        setLocationError('Could not get address details');
                    }
                } catch (error) {
                    console.error('Reverse geocoding error:', error);
                    setLocationError('Failed to get address details');
                }
                setGettingLocation(false);
            },
            (error) => {
                console.error('Geolocation error:', error);
                let errorMessage = '';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location permission denied';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location unavailable';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out';
                        break;
                    default:
                        errorMessage = 'Unable to get location';
                }
                setLocationError(errorMessage);
                setGettingLocation(false);
                if (showToast) showToast(errorMessage);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    const getAddressFromCoordinates = async (lat, lng) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
                {
                    headers: { 'Accept-Language': 'en-IN' }
                }
            );
            
            if (!response.ok) throw new Error('Reverse geocoding failed');
            
            const data = await response.json();
            
            if (data && data.address) {
                const address = data.address;
                
                let houseNumber = address.house_number || address.building || address.house || '';
                let road = address.road || address.street || '';
                let suburb = address.suburb || address.neighbourhood || '';
                let landmark = address.landmark || '';
                let city = address.city || address.town || address.village || address.district || '';
                let pincode = address.postcode || '';
                
                return {
                    houseNumber, road, suburb, landmark, city, pincode,
                    displayName: data.display_name
                };
            }
            return null;
        } catch (error) {
            console.error('Reverse geocoding error:', error);
            return null;
        }
    };

    const handlePlaceOrder = async () => {
        if (!formData.name || !formData.email || !formData.phone || !formData.address) {
            if (showToast) showToast('Please fill all required fields!');
            return;
        }

        if (!user || !user.id) {
            if (showToast) showToast('Please login to place your order! 🔐');
            setTimeout(() => navigate('/login'), 1500);
            return;
        }

        setLoading(true);

        const formattedAddress = `${formData.address}, ${formData.city ? formData.city + ', ' : ''}${formData.pincode || ''}`.replace(/,\s*,/g, ',').replace(/,\s*$/, '');

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
            setOrderId(result.id);
            setOrderSuccess(true);
            if (showToast) showToast('Order placed successfully! 🎉');
            if (!isSingleProduct && setCart) setCart([]);
        } else {
            if (showToast) showToast('Order failed: ' + result.error);
        }

        setLoading(false);
    };

    // Order Confirmation Component
    const OrderConfirmation = () => {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 pt-32 pb-24">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="text-center mb-8">
                        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        
                        <h1 className="text-4xl font-['Outfit'] font-black text-gray-900 mb-2">
                            Order Confirmed! 🎉
                        </h1>
                        
                        <p className="text-gray-500 text-lg">Thank you for your order</p>
                        
                        <div className="inline-flex items-center space-x-2 bg-white shadow rounded-full px-4 py-1.5 mt-3">
                            <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-xs text-gray-500">Order ID:</span>
                            <span className="font-mono font-bold text-pink-600 text-xs">{orderId?.slice(0, 12)}...</span>
                        </div>
                        
                        {/* Email confirmation message */}
                        <div className="mt-4 p-3 bg-green-50 rounded-xl inline-flex items-center space-x-2">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm text-green-700">
                                {emailSent ? 'Order confirmation sent to your email!' : 'Sending confirmation email...'}
                            </span>
                        </div>
                    </div>

                    {/* Order Summary Card */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
                        <div className="bg-pink-500 px-6 py-4">
                            <div className="flex items-center space-x-2">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 11h14l1 12H4L5 11z" />
                                </svg>
                                <h3 className="text-lg font-bold text-white">Order Summary</h3>
                            </div>
                        </div>
                        
                        <div className="p-6">
                            <div className="space-y-3 mb-6">
                                {checkoutItems.map((item, index) => (
                                    <div key={item.id || index} className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <div>
                                            <p className="font-medium text-gray-900">{item.name}</p>
                                            <p className="text-xs text-gray-500">Qty: {item.quantity || 1}</p>
                                        </div>
                                        <p className="font-medium text-gray-900">₹{(item.price || 0) * (item.quantity || 1)}</p>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="border-t border-gray-100 pt-3 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span>₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Delivery Fee</span>
                                    <span className="text-red-500">₹{deliveryCharge}</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-gray-100">
                                    <span className="font-bold text-gray-900">Total</span>
                                    <span className="font-bold text-pink-600 text-xl">₹{total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="flex-1 bg-pink-500 text-white py-3 rounded-xl font-bold hover:bg-pink-600 transition"
                        >
                            🍰 Explore More Cakes
                        </button>
                        <button
                            onClick={() => navigate('/my-orders')}
                            className="flex-1 bg-gray-800 text-white py-3 rounded-xl font-bold hover:bg-gray-900 transition"
                        >
                            📋 View My Orders
                        </button>
                    </div>
                </div>
            </div>
        );
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

    // Show Order Confirmation Page if order is successful
    if (orderSuccess) {
        return <OrderConfirmation />;
    }

    // Check if cart is empty
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
                    <div className="lg:col-span-2">
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

                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-gray-900">Delivery Details</h3>
                                <button
                                    type="button"
                                    onClick={getCurrentLocation}
                                    disabled={gettingLocation}
                                    className="flex items-center space-x-2 bg-pink-50 hover:bg-pink-100 text-pink-600 font-medium text-sm px-4 py-2 rounded-xl transition"
                                >
                                    {gettingLocation ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
                                            <span>Detecting...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <circle cx="12" cy="10" r="3" strokeWidth="2" />
                                            </svg>
                                            <span>Use Current Location</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            {locationError && (
                                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-600 text-xs">
                                    ⚠️ {locationError}
                                </div>
                            )}

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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500"
                                        placeholder="Enter pincode"
                                        required
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500"
                                        placeholder="Enter city"
                                        required
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
                                    <span className="font-medium text-red-500">₹{deliveryCharge}</span>
                                </div>
                                <div className="border-t border-gray-100 pt-3 mt-3">
                                    <div className="flex justify-between">
                                        <span className="font-bold text-gray-900">Total Amount</span>
                                        <span className="font-bold text-pink-600 text-xl">₹{total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 p-3 bg-yellow-50 rounded-xl">
                                <div className="flex items-center space-x-2">
                                    <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-xs text-yellow-700">
                                        Delivery charge ₹{deliveryCharge} applied
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={loading}
                                className="w-full bg-pink-600 text-white py-3 rounded-xl font-bold hover:bg-gray-900 transition disabled:opacity-50 mt-6"
                            >
                                {loading ? 'Placing Order...' : `Place Order • ₹${total.toFixed(2)}`}
                            </button>

                            <p className="text-center text-xs text-gray-400 mt-3">
                                By placing this order, you agree to our terms
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;