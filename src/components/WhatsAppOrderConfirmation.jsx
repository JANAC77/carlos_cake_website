// src/components/WhatsAppOrderConfirmation.jsx
import { useState, useEffect } from 'react';
import { FaWhatsapp, FaCheckCircle, FaClock, FaTruck } from 'react-icons/fa';
import { getWhatsAppLink } from '../services/whatsappService';

const WhatsAppOrderConfirmation = ({ orderDetails, onClose }) => {
    const [countdown, setCountdown] = useState(10);
    const [orderSent, setOrderSent] = useState(false);

    useEffect(() => {
        if (countdown > 0 && !orderSent) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0 && !orderSent) {
            // Auto-send order after countdown
            sendOrder();
        }
    }, [countdown, orderSent]);

    const sendOrder = () => {
        const message = generateOrderMessage();
        const link = getWhatsAppLink(message);
        window.open(link, '_blank');
        setOrderSent(true);

        // Auto close after 3 seconds
        setTimeout(() => {
            if (onClose) onClose();
        }, 3000);
    };

    const generateOrderMessage = () => {
        let message = "🛒 *NEW ORDER REQUEST* 🛒\n\n";
        message += `*Customer:* ${orderDetails.customerName}\n`;
        message += `*Phone:* ${orderDetails.customerPhone}\n`;
        message += `*Email:* ${orderDetails.customerEmail}\n\n`;
        message += `*Order Items:*\n`;

        orderDetails.items.forEach((item, idx) => {
            message += `${idx + 1}. ${item.name} x${item.quantity} - ₹${item.price * item.quantity}\n`;
        });

        message += `\n*Total:* ₹${orderDetails.total}\n`;
        message += `*Delivery:* ${orderDetails.deliveryDate || 'ASAP'} at ${orderDetails.deliveryTime || 'Anytime'}\n`;
        message += `*Address:* ${orderDetails.address}\n\n`;
        message += `_Please confirm availability and provide order confirmation._`;

        return message;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#25D366] to-[#20B859] p-6 text-white text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                        <FaWhatsapp size={32} className="text-[#25D366]" />
                    </div>
                    <h2 className="text-xl font-bold">WhatsApp Order</h2>
                    <p className="text-sm opacity-90">Quick & Easy Ordering</p>
                </div>

                {/* Content */}
                <div className="p-6 text-center">
                    {!orderSent ? (
                        <>
                            <div className="mb-4">
                                <div className="text-6xl mb-2">📱</div>
                                <p className="text-gray-700 font-medium mb-2">
                                    Redirecting to WhatsApp...
                                </p>
                                <div className="text-4xl font-bold text-[#25D366] mb-2">
                                    {countdown}
                                </div>
                                <p className="text-sm text-gray-500">
                                    You'll be redirected to WhatsApp in {countdown} seconds
                                </p>
                            </div>

                            <div className="space-y-3 mt-4">
                                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                                    <div className="flex items-center space-x-3">
                                        <FaCheckCircle className="text-green-500" />
                                        <span className="text-sm text-gray-700">Order details prepared</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                                    <div className="flex items-center space-x-3">
                                        <FaClock className="text-blue-500" />
                                        <span className="text-sm text-gray-700">Quick review by our team</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl">
                                    <div className="flex items-center space-x-3">
                                        <FaTruck className="text-yellow-500" />
                                        <span className="text-sm text-gray-700">Fast delivery within hours</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => onClose()}
                                    className="flex-1 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={sendOrder}
                                    className="flex-1 py-2 bg-[#25D366] text-white rounded-xl font-medium hover:bg-[#20B859] transition-colors flex items-center justify-center space-x-2"
                                >
                                    <FaWhatsapp size={16} />
                                    <span>Send Now</span>
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="py-6">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaCheckCircle size={40} className="text-green-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Order Sent! </h3>
                            <p className="text-gray-500">
                                Your order request has been sent. Our team will confirm shortly.
                            </p>
                            <button
                                onClick={() => onClose()}
                                className="mt-6 w-full py-3 bg-pink-600 text-white rounded-xl font-medium hover:bg-pink-700"
                            >
                                Close
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WhatsAppOrderConfirmation;