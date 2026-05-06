// src/components/CartPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CartPage = ({ cart, setCart, user, onNavigate, showToast }) => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        address: '',
        city: '',
        pincode: '',
        paymentMethod: 'cod'
    });

    // Delivery charge - fixed ₹100
    const DELIVERY_CHARGE = 100;

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

    const subtotal = cart.reduce((sum, item) => {
        const price = parseFloat(item.price) || 0;
        return sum + (price * (item.quantity || 1));
    }, 0);

    // Fixed delivery charge of ₹100 for all orders
    const deliveryCharge = DELIVERY_CHARGE;
    const total = subtotal + deliveryCharge;

    const removeItem = (id) => {
        const item = cart.find(i => i.id === id);
        setCart(prev => prev.filter(item => item.id !== id));
        if (showToast) showToast(`${item?.name} removed from cart! 🗑️`);
    };

    const updateQuantity = (id, delta) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, (item.quantity || 1) + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const handleProceedToCheckout = () => {
        if (cart.length === 0) {
            if (showToast) showToast('Your cart is empty!');
            return;
        }
        
        if (!user || !user.id) {
            const pendingAction = {
                action: 'proceedToCheckout',
                timestamp: Date.now()
            };
            localStorage.setItem('pendingAction', JSON.stringify(pendingAction));
            
            if (showToast) showToast('Please login to place your order! 🔐');
            setTimeout(() => {
                onNavigate('/login');
            }, 500);
            return;
        }
        
        navigate('/checkout');
    };

    // Empty Cart
    if (cart.length === 0) {
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
                            onClick={() => onNavigate('/')}
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
                        onClick={() => onNavigate('/')}
                        className="flex items-center space-x-2 text-gray-500 hover:text-pink-600 transition-colors group"
                    >
                        <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="font-black uppercase tracking-widest text-xs">Continue Shopping</span>
                    </button>
                </div>

                <h1 className="text-3xl md:text-4xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tighter mb-8">
                    Shopping Cart ({cart.length})
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items - Left Column */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                            <div className="divide-y divide-gray-100">
                                {cart.map((item) => (
                                    <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-6">
                                        {/* Product Image */}
                                        <div className="w-32 h-32 bg-pink-50 rounded-xl overflow-hidden flex-shrink-0">
                                            <img 
                                                src={item.image || '/placeholder.png'} 
                                                alt={item.name} 
                                                className="w-full h-full object-cover"
                                                onError={(e) => { e.target.src = '/placeholder.png'; }}
                                            />
                                        </div>
                                        
                                        {/* Product Details */}
                                        <div className="flex-grow">
                                            <div className="flex flex-col sm:flex-row justify-between gap-4">
                                                <div>
                                                    <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
                                                    <p className="text-gray-500 text-sm mt-1">{item.category || 'Cake'}</p>
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
                                            
                                            {/* Quantity Selector */}
                                            <div className="flex items-center space-x-4 mt-4">
                                                <div className="flex items-center border border-gray-200 rounded-lg">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                        className="px-3 py-2 hover:bg-gray-50 text-gray-600"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="px-4 py-2 font-bold text-gray-900 border-x border-gray-200 min-w-[60px] text-center">
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

                    {/* Order Summary - Right Column */}
                    <div>
                        <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-32">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
                            
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Subtotal ({cart.length} items)</span>
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

                            <div className="mt-4 p-3 bg-yellow-50 rounded-xl mb-6">
                                <div className="flex items-center space-x-2">
                                    <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-xs text-yellow-700">Delivery charge ₹{deliveryCharge} applied</p>
                                </div>
                            </div>

                            <button
                                onClick={handleProceedToCheckout}
                                className="w-full bg-pink-600 text-white py-3 rounded-xl font-bold hover:bg-gray-900 transition"
                            >
                                Proceed to Checkout • ₹{total.toFixed(2)}
                            </button>

                            {(!user || !user.id) && (
                                <p className="text-center text-xs text-red-500 mt-3">
                                    Please login to proceed with checkout
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;