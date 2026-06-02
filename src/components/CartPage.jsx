// src/components/CartPage.jsx - Redesigned with premium product lists & summary details
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';
import { generateCartOrderMessage, getWhatsAppLink, sendOrderConfirmation } from '../services/whatsappService';

const CartPage = ({ cart, setCart, user, onNavigate, showToast }) => {
    const navigate = useNavigate();

    const getCleanCategoryName = (categoryName) => {
        const name = categoryName || '';
        if (name.toLowerCase().includes('choclate') || name.toLowerCase().includes('chocolate')) return 'Chocolate Cakes';
        if (name.toLowerCase().includes('design')) return 'Designer Cakes';
        if (name.toLowerCase().includes('fresh cream')) return 'Fresh Cream Cakes';
        return name;
    };

    const isOfferActive = (item) => {
        if (!item?.hasOffer) return false;
        if (item?.offerValidTill) {
            const today = new Date().toISOString().split('T')[0];
            if (item.offerValidTill < today) return false;
        }
        return true;
    };

    const getItemPrice = (item) => {
        const active = isOfferActive(item);
        let basePrice = 0;
        if (active) {
            basePrice = item.selectedWeight?.offerPrice || item.offerPrice || item.selectedWeight?.price || item.price || 0;
        } else {
            basePrice = item.selectedWeight?.price || item.price || 0;
        }

        if (item.isEggless && item.egglessOption && item.egglessExtra) {
            basePrice += parseFloat(item.egglessExtra);
        }
        return basePrice;
    };

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phoneNumber || '',
        address: user?.address || '',
        city: user?.city || '',
        pincode: user?.pincode || ''
    });

    const DELIVERY_CHARGE = 100;

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
        const price = getItemPrice(item);
        return sum + (price * (item.quantity || 1));
    }, 0);
    const deliveryCharge = DELIVERY_CHARGE;
    const total = subtotal + deliveryCharge;

    const removeItem = (id) => {
        const item = cart.find(i => i.id === id);
        setCart(prev => prev.filter(item => item.id !== id));
        if (showToast) showToast(`${item?.name} removed! 🗑️`);
    };

    const updateQuantity = (id, delta) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const stockLimit = (item.selectedWeight && item.selectedWeight.stock !== undefined && item.selectedWeight.stock !== null)
                    ? Number(item.selectedWeight.stock)
                    : (item.stock !== undefined && item.stock !== null ? Number(item.stock) : 99);
                const currentQty = item.quantity || 1;
                if (delta > 0 && currentQty >= stockLimit) {
                    if (showToast) showToast(`Only ${stockLimit} available! ⚠️`);
                    return item;
                }
                const newQty = Math.max(1, currentQty + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    // WhatsApp Order Handler
    const handleWhatsAppOrder = () => {
        if (cart.length === 0) {
            if (showToast) showToast('Your cart is empty!');
            return;
        }

        let customerInfo = '';
        if (formData.name) customerInfo += `\n\n*Customer Details:*\nName: ${formData.name}`;
        if (formData.phone) customerInfo += `\nPhone: ${formData.phone}`;
        if (formData.email) customerInfo += `\nEmail: ${formData.email}`;
        if (formData.address) customerInfo += `\nAddress: ${formData.address}`;
        if (formData.city) customerInfo += `\nCity: ${formData.city}`;
        if (formData.pincode) customerInfo += `\nPincode: ${formData.pincode}`;

        const orderMessage = generateCartOrderMessage(cart, subtotal, deliveryCharge, total);
        const fullMessage = orderMessage + customerInfo + `\n\n_Please confirm this order and provide delivery availability._`;

        const link = getWhatsAppLink(fullMessage);
        window.open(link, '_blank');

        sendOrderConfirmation('cart', cart, '2-3 hours');

        if (showToast) showToast('Order request sent via WhatsApp! ');
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
            <div className="min-h-screen bg-cream-base pt-32 pb-24 flex items-center">
                <div className="max-w-md mx-auto px-4 w-full text-center">
                    <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-gray-100/60">
                        <div className="w-20 h-20 bg-rose-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-rose-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 11h14l1 12H4L5 11z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-black text-obsidian-dark uppercase tracking-tight mb-2">Your Cart is Empty</h2>
                        <p className="text-gray-400 text-xs font-semibold mb-6">Explore our fresh collections and find your next sweet delight!</p>
                        <button
                            onClick={() => onNavigate('/')}
                            className="bg-rose-gold hover:bg-obsidian-dark hover:shadow-lg text-white px-8 py-3 rounded-xl font-bold uppercase tracking-wider text-[10px] transition-all duration-300 cursor-pointer"
                        >
                            Browse Cakes
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream-base pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <button
                        onClick={() => onNavigate('/')}
                        className="flex items-center space-x-2 text-gray-500 hover:text-rose-gold transition-colors group cursor-pointer"
                    >
                        <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="font-black uppercase tracking-widest text-[10px]">Continue Shopping</span>
                    </button>
                </div>

                <h1 className="text-3xl md:text-4xl font-['Outfit'] font-black text-obsidian-dark uppercase tracking-tighter mb-8">
                    Shopping Cart ({cart.length})
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items list */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map((item) => {
                            const actualPrice = getItemPrice(item);
                            const originalPrice = item.selectedWeight?.price || item.price || 0;
                            const itemTotal = actualPrice * (item.quantity || 1);

                            return (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-3xl p-5 border border-gray-100 flex flex-col sm:flex-row gap-5 shadow-sm hover:shadow-md transition-shadow relative"
                                >
                                    {/* Item Image */}
                                    <div className="w-28 h-28 bg-rose-gold/5 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100">
                                        <img
                                            src={item.image || '/placeholder.png'}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.src = '/placeholder.png'; }}
                                        />
                                    </div>

                                    {/* Item Details */}
                                    <div className="flex-grow flex flex-col justify-between">
                                        <div className="flex justify-between gap-4">
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-base">{item.name}</h3>
                                                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mt-0.5">{getCleanCategoryName(item.categoryName || item.category || 'Cake')}</p>
                                                <span className="inline-block mt-2 text-[10px] bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                                    {item.selectedWeight?.label || '1 kg'}
                                                </span>
                                                {item.isEggless && (
                                                    <span className="inline-block mt-2 text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ml-1">
                                                        Eggless
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-black text-rose-gold">₹{actualPrice}</p>
                                                {isOfferActive(item) && originalPrice > actualPrice && (
                                                    <p className="text-xs text-gray-400 line-through">₹{originalPrice}</p>
                                                )}
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-red-500 hover:text-red-600 text-xs font-bold uppercase tracking-wider mt-2.5 cursor-pointer block w-full text-right"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-3 border-t border-gray-50">
                                            {/* Quantity Counter */}
                                            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                                                <button
                                                    onClick={() => updateQuantity(item.id, -1)}
                                                    className="px-3 py-1.5 hover:bg-gray-100 text-gray-600 font-bold transition-colors cursor-pointer text-sm"
                                                >
                                                    -
                                                </button>
                                                <span className="px-4 py-1.5 font-bold text-gray-900 border-x border-gray-200 min-w-[50px] text-center text-xs bg-white">
                                                    {item.quantity || 1}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, 1)}
                                                    className="px-3 py-1.5 hover:bg-gray-100 text-gray-600 font-bold transition-colors cursor-pointer text-sm"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <p className="text-gray-700 text-xs font-bold uppercase tracking-wider">
                                                Subtotal: <span className="text-rose-gold text-sm font-black">₹{itemTotal}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div>
                        <div className="bg-white rounded-[2rem] border border-gray-100 p-6 sticky top-32 shadow-lg">
                            <h3 className="text-base font-black text-obsidian-dark uppercase tracking-wider mb-6">Order Summary</h3>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-500">
                                    <span>Subtotal</span>
                                    <span className="text-gray-900">₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-500">
                                    <span>Delivery Fee</span>
                                    <span className="text-red-500">₹{deliveryCharge.toFixed(2)}</span>
                                </div>
                                <div className="border-t border-gray-100 pt-4 mt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="font-black text-obsidian-dark text-sm uppercase tracking-wider">Total</span>
                                        <span className="font-black text-rose-gold text-2xl">₹{total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* WhatsApp Order Button */}
                            <button
                                onClick={handleWhatsAppOrder}
                                className="w-full bg-[#25D366] text-white py-3.5 rounded-xl font-bold uppercase tracking-widest text-[9px] hover:bg-[#20B859] hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 mb-3 cursor-pointer"
                            >
                                <FaWhatsapp size={14} />
                                <span>Order via WhatsApp</span>
                            </button>

                            <button
                                onClick={handleProceedToCheckout}
                                className="w-full bg-rose-gold text-white py-3.5 rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-obsidian-dark hover:shadow-lg transition-all duration-300 transform active:scale-95 cursor-pointer"
                            >
                                Proceed to Checkout
                            </button>

                            <p className="text-center text-[10px] text-green-600 mt-4 flex items-center justify-center space-x-1 font-bold uppercase tracking-wider">
                                <span>⚡</span>
                                <span>Quick confirmation on WhatsApp!</span>
                            </p>

                            {(!user || !user.id) && (
                                <p className="text-center text-[10px] font-bold uppercase tracking-wider text-red-500 mt-3 animate-pulse">
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