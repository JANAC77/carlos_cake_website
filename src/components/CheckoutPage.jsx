// src/components/CheckoutPage.jsx - With Offer Support
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createOrder, getAddOns, getOccasions } from '../firebase';
import { sendOrderConfirmationEmail } from '../services/emailService';
import emailjs from '@emailjs/browser';
import DeliveryScheduler from './DeliveryScheduler';
import { FaWhatsapp } from 'react-icons/fa';
import { getWhatsAppLink } from '../services/whatsappService';

// Initialize EmailJS
emailjs.init('YOUR_PUBLIC_KEY');

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const CheckoutPage = ({ cart = [], user, onNavigate, showToast, clearCartAfterOrder = false, setCart }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Get Buy Now item
    const buyNowProduct = location.state?.product || null;
    const buyNowQuantity = location.state?.quantity || 1;
    const isBuyNow = location.state?.isBuyNow || false;
    const isSingleProduct = !!buyNowProduct;

    const [loading, setLoading] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [gettingLocation, setGettingLocation] = useState(false);
    const [locationError, setLocationError] = useState('');
    const [emailSent, setEmailSent] = useState(false);
    const [orderSchedule, setOrderSchedule] = useState(null);

    // Add-ons state
    const [selectedAddons, setSelectedAddons] = useState([]);
    const [cakeMessage, setCakeMessage] = useState('');
    const [occasion, setOccasion] = useState('');
    const [availableAddOns, setAvailableAddOns] = useState([]);
    const [loadingAddOns, setLoadingAddOns] = useState(true);

    // Occasions state
    const [occasions, setOccasions] = useState([]);
    const [loadingOccasions, setLoadingOccasions] = useState(true);

    // Create checkout items (with safe undefined handling)
    const getCheckoutItems = () => {
        if (isSingleProduct && buyNowProduct) {
            return [{
                id: buyNowProduct.id || null,
                name: buyNowProduct.name || '',
                price: buyNowProduct.price || 0,
                originalPrice: buyNowProduct.originalPrice || buyNowProduct.price || 0,
                offerPrice: buyNowProduct.offerPrice || null,
                hasOffer: buyNowProduct.hasOffer || false,
                offerDiscount: buyNowProduct.offerDiscount || null,
                offerDescription: buyNowProduct.offerDescription || null,
                image: buyNowProduct.image || '/placeholder.png',
                description: buyNowProduct.description || '',
                quantity: buyNowQuantity || 1,
                addons: selectedAddons || [],
                cakeMessage: cakeMessage || '',
                occasion: occasion || '',
                selectedWeight: buyNowProduct.selectedWeight || null
            }];
        }
        // For cart items, safe mapping with offer support
        return cart.map(item => ({
            id: item.id || null,
            name: item.name || '',
            price: item.price || 0,
            originalPrice: item.originalPrice || item.price || 0,
            offerPrice: item.offerPrice || null,
            hasOffer: item.hasOffer || false,
            offerDiscount: item.offerDiscount || null,
            offerDescription: item.offerDescription || null,
            image: item.image || '/placeholder.png',
            description: item.description || '',
            quantity: item.quantity || 1,
            addons: item.addons || [],
            cakeMessage: item.cakeMessage || '',
            occasion: item.occasion || '',
            selectedWeight: item.selectedWeight || null
        }));
    };

    const checkoutItems = getCheckoutItems();

    // Calculate PRODUCT TOTAL and ADD-ONS TOTAL separately with offer support
    const calculateProductTotal = () => {
        return checkoutItems.reduce((sum, item) => {
            // Use offer price if available, otherwise regular price
            const price = item.offerPrice || item.selectedWeight?.offerPrice || item.selectedWeight?.price || item.price || 0;
            const quantity = item.quantity || 1;
            return sum + (price * quantity);
        }, 0);
    };

    const calculateAddonsTotal = () => {
        return checkoutItems.reduce((sum, item) => {
            const addonsTotal = (item.addons || []).reduce((s, a) => s + (a.price || 0), 0);
            return sum + addonsTotal;
        }, 0);
    };

    const productTotal = calculateProductTotal();
    const addonsTotal = calculateAddonsTotal();

    // Calculate subtotal safely with offer support
    const calculateSubtotal = () => {
        return checkoutItems.reduce((sum, item) => {
            const price = item.offerPrice || item.selectedWeight?.offerPrice || item.selectedWeight?.price || item.price || 0;
            const quantity = item.quantity || 1;
            const itemTotal = price * quantity;
            const addonsTotalItem = (item.addons || []).reduce((s, a) => s + (a.price || 0), 0);
            return sum + itemTotal + addonsTotalItem;
        }, 0);
    };

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phoneNumber || '',
        address: user?.address || '',
        city: user?.city || '',
        pincode: user?.pincode || '',
        paymentMethod: 'online'
    });

    const subtotal = calculateSubtotal();
    const DELIVERY_CHARGE = 100;
    const deliveryCharge = formData.paymentMethod === 'online' ? 0 : DELIVERY_CHARGE;
    const total = subtotal + deliveryCharge;

    const isFormValid = () => {
        if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.pincode) {
            return false;
        }
        if (!orderSchedule || !orderSchedule.date || !orderSchedule.time) {
            return false;
        }
        if (!user || !user.id) {
            return false;
        }
        return true;
    };

    // Load occasions and add-ons from Firebase
    useEffect(() => {
        loadOccasions();
        loadAddOns();
    }, []);

    const loadOccasions = async () => {
        setLoadingOccasions(true);
        try {
            const occasionsData = await getOccasions();
            setOccasions(occasionsData);
        } catch (error) {
            console.error("Error loading occasions:", error);
            setOccasions([]);
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
            setAvailableAddOns([]);
        } finally {
            setLoadingAddOns(false);
        }
    };

    const toggleAddon = (addon) => {
        setSelectedAddons(prev => {
            const exists = prev.find(a => a.id === addon.id);
            if (exists) return prev.filter(a => a.id !== addon.id);
            return [...prev, addon];
        });
        if (showToast) {
            const exists = selectedAddons.find(a => a.id === addon.id);
            showToast(exists ? `${addon.name} removed` : `${addon.name} added (+₹${addon.price})`);
        }
    };

    const getAddonsTotal = () => {
        return selectedAddons.reduce((sum, a) => sum + (a.price || 0), 0);
    };

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

    useEffect(() => {
        if (orderSuccess) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [orderSuccess]);

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
        if (!isFormValid()) {
            if (showToast) showToast('Please fill all required fields and select delivery schedule!');
            return;
        }

        setLoading(true);

        const formattedAddress = `${formData.address}, ${formData.city ? formData.city + ', ' : ''}${formData.pincode || ''}`.replace(/,\s*,/g, ',').replace(/,\s*$/, '');

        const orderData = {
            userId: user?.id || user?.uid || 'guest',
            customerName: formData.name || '',
            customerEmail: formData.email || '',
            customerPhone: formData.phone || '',
            deliveryAddress: formattedAddress || '',
            addressLine: formData.address || '',
            city: formData.city || '',
            pincode: formData.pincode || '',
            deliveryDate: orderSchedule.date || '',
            deliveryTimeSlot: orderSchedule.time || '',
            isPreOrder: orderSchedule.isPreOrder || false,
            items: checkoutItems.map(item => {
                const cleanItem = {
                    id: item.id || null,
                    name: item.name || '',
                    price: item.price || 0,
                    quantity: item.quantity || 1,
                    image: item.image || '/placeholder.png',
                    addons: (item.addons || []).map(addon => ({
                        id: addon.id || null,
                        name: addon.name || '',
                        price: addon.price || 0,
                    })),
                    cakeMessage: item.cakeMessage || '',
                    occasion: item.occasion || '',
                    // Offer fields
                    hasOffer: item.hasOffer || false,
                    offerDiscount: item.offerDiscount || null,
                    offerDescription: item.offerDescription || null,
                    offerPrice: item.offerPrice || null
                };

                if (item.selectedWeight && item.selectedWeight.weight) {
                    cleanItem.selectedWeight = {
                        weight: item.selectedWeight.weight || '',
                        label: item.selectedWeight.label || '',
                        price: item.selectedWeight.price || 0,
                        offerPrice: item.selectedWeight.offerPrice || null,
                        serves: item.selectedWeight.serves || ''
                    };
                    // Use offer price if available
                    cleanItem.price = item.selectedWeight.offerPrice || item.selectedWeight.price || item.price || 0;
                }

                return cleanItem;
            }),
            subtotal: subtotal || 0,
            deliveryCharge: deliveryCharge || 0,
            total: total || 0,
            paymentMethod: formData.paymentMethod || 'cod',
            status: orderSchedule.isPreOrder ? 'pre-ordered' : 'pending',
            createdAt: new Date().toISOString()
        };

        // If online payment is selected
        if (formData.paymentMethod === 'online') {
            try {
                // 1. Load Razorpay script
                const loaded = await loadRazorpayScript();
                if (!loaded) {
                    if (showToast) showToast('Failed to load payment gateway. Please check your internet connection.');
                    setLoading(false);
                    return;
                }

                // 2. Create order on backend
                const response = await fetch('/api/razorpay?action=create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount: total,
                        receipt: `rcpt_${Date.now()}`
                    })
                });

                let rzpOrder;
                const createResponseText = await response.text();
                try {
                    rzpOrder = JSON.parse(createResponseText);
                } catch (e) {
                    throw new Error(`Server returned ${response.status} during order creation: ${createResponseText.substring(0, 150)}`);
                }

                if (!response.ok || !rzpOrder.success) {
                    throw new Error(rzpOrder.message || 'Failed to create payment order');
                }

                // 3. Open Razorpay Checkout modal
                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_SeVhaDmHrwpZgO',
                    amount: rzpOrder.amount,
                    currency: rzpOrder.currency,
                    name: 'Carlos Cake Cafe',
                    description: 'Order Payment',
                    order_id: rzpOrder.orderId,
                    handler: async function (paymentRes) {
                        try {
                            setLoading(true);
                            if (showToast) showToast('Verifying payment signature...');

                            // 4. Verify payment signature
                            const verifyResponse = await fetch('/api/razorpay?action=verify', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    razorpay_order_id: paymentRes.razorpay_order_id,
                                    razorpay_payment_id: paymentRes.razorpay_payment_id,
                                    razorpay_signature: paymentRes.razorpay_signature
                                })
                            });

                             let verifyData;
                             const responseText = await verifyResponse.text();
                             try {
                                 verifyData = JSON.parse(responseText);
                             } catch (e) {
                                 throw new Error(`Server returned ${verifyResponse.status}: ${responseText.substring(0, 150)}`);
                             }

                             if (!verifyResponse.ok || !verifyData.success) {
                                 throw new Error(verifyData.message || 'Signature verification failed');
                             }

                            // 5. Create final database order
                            const paidOrderData = {
                                ...orderData,
                                paymentStatus: 'paid',
                                razorpayOrderId: paymentRes.razorpay_order_id,
                                razorpayPaymentId: paymentRes.razorpay_payment_id,
                                razorpaySignature: paymentRes.razorpay_signature
                            };

                            const result = await createOrder(paidOrderData);

                            if (result.success) {
                                setOrderId(result.id);
                                setOrderSuccess(true);
                                if (showToast) showToast('Order placed successfully! 🎉');
                                if (!isSingleProduct && setCart) setCart([]);
                            } else {
                                if (showToast) showToast('Database registration failed: ' + result.error);
                            }
                        } catch (err) {
                            console.error('Signature verification error:', err);
                            if (showToast) showToast('Payment Verification Failed: ' + err.message);
                        } finally {
                            setLoading(false);
                        }
                    },
                    prefill: {
                        name: formData.name,
                        email: formData.email,
                        contact: formData.phone
                    },
                    notes: {
                        address: formattedAddress
                    },
                    theme: {
                        color: '#DB2777' // Match your pink theme
                    },
                    modal: {
                        ondismiss: function () {
                            setLoading(false);
                            if (showToast) showToast('Payment modal closed.');
                        }
                    }
                };

                const rzp = new window.Razorpay(options);
                rzp.open();

            } catch (error) {
                console.error('Payment initiation error:', error);
                if (showToast) showToast('Payment failed: ' + error.message);
                setLoading(false);
            }
            return;
        }

        // Cash on delivery (COD) or UPI manual orders
        console.log("Order Data being sent:", JSON.stringify(orderData, null, 2));

        const result = await createOrder(orderData);

        if (result.success) {
            setOrderId(result.id);
            setOrderSuccess(true);
            if (showToast) showToast('Order placed successfully! ');
            if (!isSingleProduct && setCart) setCart([]);
        } else {
            if (showToast) showToast('Order failed: ' + result.error);
        }

        setLoading(false);
    };

    const handleWhatsAppOrder = () => {
        if (!isFormValid()) {
            if (showToast) showToast('Please fill all required fields and select delivery schedule before sending WhatsApp order!');
            return;
        }

        const orderMessage = `🛍️ *NEW ORDER REQUEST - CARLOS CAKE CAFE* 🛍️\n\n`;
        const customerInfo = `*Customer Details:*\nName: ${formData.name}\nPhone: ${formData.phone}\nEmail: ${formData.email}\nAddress: ${formData.address}, ${formData.city}, ${formData.pincode}\nDelivery Date: ${orderSchedule?.date || 'ASAP'}\nTime Slot: ${orderSchedule?.time || 'Not specified'}\n\n*Order Items:*\n`;

        let itemsText = '';
        checkoutItems.forEach((item, idx) => {
            const actualPrice = item.offerPrice || item.selectedWeight?.offerPrice || item.selectedWeight?.price || item.price || 0;
            const quantity = item.quantity || 1;
            itemsText += `${idx + 1}. ${item.name} x${quantity} - ₹${actualPrice * quantity}\n`;

            // Show offer savings if applicable
            if (item.hasOffer && item.offerDiscount) {
                const originalPrice = item.selectedWeight?.price || item.price || 0;
                if (originalPrice > actualPrice) {
                    itemsText += `    Offer: ${item.offerDiscount} (Save ₹${(originalPrice - actualPrice) * quantity})\n`;
                }
            }

            if (item.addons && item.addons.length > 0) {
                itemsText += `   Add-ons: ${item.addons.map(a => `${a.name}(+₹${a.price})`).join(', ')}\n`;
            }
        });

        const priceText = `\n*Price Breakdown:*\nProduct Total: ₹${productTotal}\nAdd-ons Total: +₹${addonsTotal}\nDelivery Fee: ₹${deliveryCharge}\n*GRAND TOTAL: ₹${total}*\n\n_Please confirm this order._`;

        const fullMessage = orderMessage + customerInfo + itemsText + priceText;
        const link = getWhatsAppLink(fullMessage);
        window.open(link, '_blank');
        if (showToast) showToast('Order request sent via WhatsApp!');
    };

    // Render order items with add-ons and offer display
    const renderOrderItems = () => {
        if (checkoutItems.length === 0) return null;

        return checkoutItems.map((item, index) => {
            const actualPrice = item.offerPrice || item.selectedWeight?.offerPrice || item.selectedWeight?.price || item.price || 0;
            const originalPrice = item.selectedWeight?.price || item.price || 0;
            const quantity = item.quantity || 1;
            const itemTotal = actualPrice * quantity;
            const addonsTotalItem = (item.addons || []).reduce((s, a) => s + (a.price || 0), 0);
            const totalItemPrice = itemTotal + addonsTotalItem;
            const hasOffer = item.hasOffer && actualPrice < originalPrice;

            return (
                <div key={item.id || index} className="flex items-start space-x-4 p-3 bg-gray-50 rounded-xl mb-3">
                    <div className="w-16 h-16 bg-pink-50 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                            src={item.image || '/placeholder.png'}
                            alt={item.name || 'Product'}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = '/placeholder.png'; }}
                        />
                    </div>
                    <div className="flex-grow">
                        <h4 className="font-bold text-gray-900">{item.name || 'Product'}</h4>
                        <p className="text-gray-500 text-sm">Quantity: {quantity}</p>

                        {/* Offer Badge */}
                        {hasOffer && item.offerDiscount && (
                            <div className="mt-1">
                                <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                    <span>{item.offerDiscount}</span>
                                </span>
                            </div>
                        )}

                        {item.selectedWeight && item.selectedWeight.label && (
                            <div className="mt-1">
                                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                    <span>⚖️</span>
                                    <span>{item.selectedWeight.label}</span>
                                    <span>(Serves: {item.selectedWeight.serves || 'N/A'})</span>
                                </span>
                            </div>
                        )}

                        {item.occasion && (
                            <p className="text-xs text-blue-600 mt-1"> Occasion: {item.occasion}</p>
                        )}

                        {item.addons && item.addons.length > 0 && (
                            <div className="mt-2">
                                <p className="text-xs text-gray-500 font-medium">Add-ons:</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {item.addons.map((addon, addonIdx) => (
                                        <span key={addon.id || addonIdx} className="text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                            <span>{addon.name}</span>
                                            <span className="font-bold">(+₹{addon.price || 0})</span>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {item.cakeMessage && (
                            <div className="mt-2 p-2 bg-purple-50 rounded-lg">
                                <p className="text-xs text-purple-600">💬 Message: "{item.cakeMessage}"</p>
                            </div>
                        )}
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-pink-600">₹{totalItemPrice}</p>
                        {hasOffer && originalPrice !== actualPrice && (
                            <p className="text-xs text-gray-400 line-through">₹{originalPrice * quantity}</p>
                        )}
                    </div>
                </div>
            );
        });
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

                        <h1 className="text-4xl font-['Outfit'] font-black text-gray-900 mb-2">Order Confirmed!</h1>
                        <p className="text-gray-500 text-lg">Thank you for your order</p>

                        <div className="inline-flex items-center space-x-2 bg-white shadow rounded-full px-4 py-1.5 mt-3">
                            <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-xs text-gray-500">Order ID:</span>
                            <span className="font-mono font-bold text-pink-600 text-xs">{orderId?.slice(0, 12)}...</span>
                        </div>

                        {orderSchedule && (
                            <div className="mt-3 p-2 bg-blue-50 rounded-xl inline-flex items-center space-x-2">
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-sm text-blue-700">Delivery: {orderSchedule.date} at {orderSchedule.time}</span>
                            </div>
                        )}

                        <div className="mt-4 p-3 bg-green-50 rounded-xl inline-flex items-center space-x-2">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm text-green-700">
                                {emailSent ? 'Order confirmation sent to your email!' : 'Sending confirmation email...'}
                            </span>
                        </div>
                    </div>

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
                            <div className="space-y-3 mb-6">{renderOrderItems()}</div>
                            <div className="border-t border-gray-100 pt-3 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Product Total</span>
                                    <span>₹{productTotal.toFixed(2)}</span>
                                </div>
                                {addonsTotal > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Add-ons Total</span>
                                        <span className="text-pink-600">+₹{addonsTotal.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Delivery Fee</span>
                                    <span className="text-red-500">₹{deliveryCharge}</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t">
                                    <span className="font-bold text-gray-900">Total</span>
                                    <span className="font-bold text-pink-600 text-xl">₹{total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button onClick={() => navigate('/')} className="flex-1 bg-pink-500 text-white py-3 rounded-xl font-bold hover:bg-pink-600">🍰 Explore More Cakes</button>
                        <button onClick={() => navigate('/my-orders')} className="flex-1 bg-gray-800 text-white py-3 rounded-xl font-bold hover:bg-gray-900">📋 View My Orders</button>
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
                        <button onClick={() => navigate('/login')} className="bg-pink-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-900">Login Now</button>
                    </div>
                </div>
            </div>
        );
    }

    if (orderSuccess) return <OrderConfirmation />;

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
                        <button onClick={() => navigate('/')} className="inline-block bg-pink-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-900">Browse Cakes</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-gray-500 hover:text-pink-600 transition-colors mb-8 group">
                    <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="font-black uppercase tracking-widest text-xs">Back</span>
                </button>

                <h1 className="text-3xl md:text-4xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tighter mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        {/* Order Items */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">{isSingleProduct ? 'Order Summary' : `Order Items (${checkoutItems.length})`}</h3>
                            <div className="space-y-4">{renderOrderItems()}</div>
                        </div>

                        {/* ADD-ONS SELECTION SECTION - For Buy Now only with OCCASION */}
                        {isSingleProduct && (
                            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                    Customize Your Cake
                                </h3>

                                {/* Occasion Selection */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Occasion
                                    </label>
                                    {loadingOccasions ? (
                                        <div className="flex justify-center py-4">
                                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-pink-500 border-t-transparent"></div>
                                        </div>
                                    ) : occasions.length > 0 ? (
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
                                    ) : (
                                        <div className="text-center py-4 text-gray-400 text-sm bg-gray-50 rounded-xl">
                                            No occasions available
                                        </div>
                                    )}
                                </div>

                                {/* All Add-ons - No occasion filtering */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Add-ons
                                        {occasion && <span className="text-xs text-pink-500 ml-2"> For {occasion}</span>}
                                    </label>
                                    {loadingAddOns ? (
                                        <div className="flex justify-center py-4">
                                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-pink-500 border-t-transparent"></div>
                                        </div>
                                    ) : availableAddOns.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-2">
                                            {availableAddOns.map(addon => (
                                                <button
                                                    key={addon.id}
                                                    type="button"
                                                    onClick={() => toggleAddon(addon)}
                                                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${selectedAddons.find(a => a.id === addon.id)
                                                        ? 'border-pink-500 bg-pink-50'
                                                        : 'border-gray-200 hover:border-pink-200'
                                                        }`}
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <div className="text-left">
                                                            <span className="font-medium">{addon.name}</span>
                                                            {addon.description && <p className="text-xs text-gray-400">{addon.description}</p>}
                                                        </div>
                                                    </div>
                                                    <span className="text-pink-600 font-bold">+₹{addon.price}</span>
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-4 text-gray-400 text-sm bg-gray-50 rounded-xl">
                                            No add-ons available
                                        </div>
                                    )}
                                </div>

                                {/* Cake Message */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Message on Cake</label>
                                    <input
                                        type="text"
                                        value={cakeMessage}
                                        onChange={(e) => setCakeMessage(e.target.value)}
                                        placeholder="e.g., Happy Birthday! 🎂"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500"
                                    />
                                </div>

                                {/* Selected Add-ons Summary */}
                                {selectedAddons.length > 0 && (
                                    <div className="bg-gray-50 rounded-xl p-3 mb-4">
                                        <p className="text-sm font-medium text-gray-700 mb-2">Selected Add-ons:</p>
                                        <div className="space-y-1">
                                            {selectedAddons.map(addon => (
                                                <div key={addon.id} className="flex justify-between text-sm">
                                                    <span>{addon.name}</span>
                                                    <span className="text-pink-600">+₹{addon.price}</span>
                                                </div>
                                            ))}
                                            <div className="border-t pt-1 mt-1 flex justify-between font-medium">
                                                <span>Add-ons Total</span>
                                                <span className="text-pink-600">+₹{getAddonsTotal()}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Delivery Scheduler */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                            <DeliveryScheduler onScheduleConfirm={(schedule) => { setOrderSchedule(schedule); if (showToast) showToast(`Delivery scheduled for ${schedule.date} at ${schedule.time}`); }} />
                            {orderSchedule && (
                                <div className="mt-4 p-3 bg-green-50 rounded-xl">
                                    <p className="text-sm text-green-700">✅ Delivery scheduled: {orderSchedule.date} at {orderSchedule.time}</p>
                                </div>
                            )}
                        </div>

                        {/* Delivery Details Form */}
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-gray-900">Delivery Details</h3>
                                <button onClick={getCurrentLocation} disabled={gettingLocation} className="flex items-center space-x-2 bg-pink-50 hover:bg-pink-100 text-pink-600 font-medium text-sm px-4 py-2 rounded-xl">
                                    {gettingLocation ? <><div className="w-4 h-4 border-2 border-pink-600 border-t-transparent rounded-full animate-spin"></div><span>Detecting...</span></> : <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><circle cx="12" cy="10" r="3" strokeWidth="2" /></svg><span>Use Current Location</span></>}
                                </button>
                            </div>

                            {locationError && <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-600 text-xs">⚠️ {locationError}</div>}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500" /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">Email *</label><input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500" /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label><input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500" /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label><input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500" required /></div>
                                <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address *</label><textarea name="address" value={formData.address} onChange={handleInputChange} required rows="3" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500" placeholder="House No, Street, Landmark, Area" /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">City *</label><input type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500" required /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label><select name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500"><option value="online">Online Payment (UPI, Cards, Netbanking)</option><option value="cod">Cash on Delivery (COD)</option></select></div>
                            </div>
                        </div>
                    </div>

                    {/* Price Details */}
                    <div>
                        <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-32">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Price Details</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Product Total ({checkoutItems.reduce((sum, item) => sum + (item.quantity || 1), 0)} items)</span>
                                    <span className="font-medium">₹{productTotal.toFixed(2)}</span>
                                </div>
                                {addonsTotal > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Add-ons Total</span>
                                        <span className="text-pink-600 font-medium">+₹{addonsTotal.toFixed(2)}</span>
                                    </div>
                                )}
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

                            {/* Place Order Button */}
                            <button
                                onClick={handlePlaceOrder}
                                disabled={loading || !isFormValid()}
                                className={`w-full py-3 rounded-xl font-bold transition mt-6 ${isFormValid() && !loading
                                    ? 'bg-pink-600 hover:bg-gray-900 text-white'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                {loading ? 'Placing Order...' : `Place Order • ₹${total.toFixed(2)}`}
                            </button>

                            {/* WhatsApp Button */}
                            <button
                                onClick={handleWhatsAppOrder}
                                disabled={!isFormValid()}
                                className={`w-full py-3 rounded-xl font-bold transition flex items-center justify-center space-x-2 mt-3 ${isFormValid()
                                    ? 'bg-[#25D366] hover:bg-[#20B859] text-white'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                <FaWhatsapp size={20} />
                                <span>Order via WhatsApp</span>
                            </button>

                            {/* Validation messages */}
                            {!orderSchedule && (
                                <p className="text-center text-xs text-red-500 mt-3">⚠️ Please select delivery date and time</p>
                            )}
                            {(!formData.name || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.pincode) && orderSchedule && (
                                <p className="text-center text-xs text-red-500 mt-3">⚠️ Please fill all delivery details</p>
                            )}
                            <p className="text-center text-xs text-gray-400 mt-3">By placing this order, you agree to our terms</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;