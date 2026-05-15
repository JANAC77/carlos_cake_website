// src/components/QuickOrderButton.jsx
import { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { quickOrderViaWhatsApp, generateProductOrderMessage, getWhatsAppLink } from '../services/whatsappService';

const QuickOrderButton = ({ product }) => {
    const [showModal, setShowModal] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');

    const handleQuickOrder = () => {
        const message = generateProductOrderMessage(product, quantity, [], '', '', null);
        const customerInfo = customerName || customerPhone ? `\n\n*Customer Details:*\nName: ${customerName || 'Not provided'}\nPhone: ${customerPhone || 'Not provided'}` : '';
        const fullMessage = message + customerInfo + `\n\n_This is a quick order request. Please confirm availability._`;
        
        const link = getWhatsAppLink(fullMessage);
        window.open(link, '_blank');
        setShowModal(false);
        setQuantity(1);
        setCustomerName('');
        setCustomerPhone('');
    };

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-[#25D366] text-white rounded-xl font-medium hover:bg-[#20B859] transition-all"
            >
                <FaWhatsapp size={18} />
                <span>Quick Order on WhatsApp</span>
            </button>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
                        <div className="p-6 border-b">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                    <FaWhatsapp className="text-[#25D366]" size={24} />
                                    <h2 className="text-xl font-bold text-gray-900">Quick Order</h2>
                                </div>
                                <button 
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">Order {product.name} via WhatsApp</p>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-8 h-8 rounded-full border border-gray-300 hover:border-pink-500 flex items-center justify-center"
                                    >
                                        -
                                    </button>
                                    <span className="text-xl font-bold w-12 text-center">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-8 h-8 rounded-full border border-gray-300 hover:border-pink-500 flex items-center justify-center"
                                    >
                                        +
                                    </button>
                                </div>
                                <p className="text-sm text-pink-600 mt-2">Total: ₹{product.price * quantity}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name (Optional)</label>
                                <input
                                    type="text"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    placeholder="Enter your name"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Your Phone (Optional)</label>
                                <input
                                    type="tel"
                                    value={customerPhone}
                                    onChange={(e) => setCustomerPhone(e.target.value)}
                                    placeholder="Enter your phone number"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500"
                                />
                            </div>

                            <div className="p-3 bg-green-50 rounded-xl">
                                <p className="text-xs text-green-700 flex items-center space-x-2">
                                    <span>⚡</span>
                                    <span>Quick confirmation within 15 minutes!</span>
                                </p>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleQuickOrder}
                                    className="flex-1 py-2 bg-[#25D366] text-white rounded-xl font-medium hover:bg-[#20B859] transition-colors flex items-center justify-center space-x-2"
                                >
                                    <FaWhatsapp size={16} />
                                    <span>Send Order Request</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default QuickOrderButton;