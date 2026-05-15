// src/components/WhatsAppButton.jsx
import { useState } from 'react';
import { FaWhatsapp, FaTimes } from 'react-icons/fa';
import { getWhatsAppLink, generateQuickConfirmationMessage } from '../services/whatsappService';

const WhatsAppButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [inquiryType, setInquiryType] = useState('general');
    const [message, setMessage] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [orderItems, setOrderItems] = useState([]);

    const whatsappNumber = "918489091148";
    const whatsappLink = `https://wa.me/${whatsappNumber}`;

    const quickInquiryOptions = [
        { id: 'order', label: '📦 Place Order', icon: '🛍️', defaultMsg: "Hi! I'd like to place an order for a cake." },
        { id: 'custom', label: '🎨 Custom Cake', icon: '🎂', defaultMsg: "Hi! I'd like to request a custom cake." },
        { id: 'delivery', label: '🚚 Delivery Status', icon: '📦', defaultMsg: "Hi! I'd like to check my delivery status." },
        { id: 'pricing', label: '💰 Pricing Info', icon: '💵', defaultMsg: "Hi! I'd like to know about cake pricing and offers." },
        { id: 'general', label: '💬 General Inquiry', icon: '💬', defaultMsg: "Hi! I have a question about your cakes." }
    ];

    const handleQuickInquiry = (option) => {
        const message = `${option.defaultMsg}\n\nName: ${name || 'Customer'}\nPhone: ${phone || 'Not provided'}`;
        const link = getWhatsAppLink(message);
        window.open(link, '_blank');
        setIsOpen(false);
    };

    const handleCustomMessage = () => {
        const fullMessage = `*Customer Inquiry*\n\nName: ${name || 'Customer'}\nPhone: ${phone || 'Not provided'}\n\n${message}`;
        const link = getWhatsAppLink(fullMessage);
        window.open(link, '_blank');
        setIsOpen(false);
        setShowForm(false);
        setName('');
        setPhone('');
        setMessage('');
    };

    return (
        <>

            {/* Quick Action Button (Optional - Add near product cards) */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20B859] text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 group"
                >
                    <FaWhatsapp size={28} />
                </button>
            )}

            {/* Quick Order Sidebar */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center">
                                    <FaWhatsapp className="text-white" size={20} />
                                </div>
                                <div>
                                    <h2 className="font-bold text-gray-900">WhatsApp Order</h2>
                                    <p className="text-xs text-gray-500">Quick & Easy Ordering</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    setShowForm(false);
                                }}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <FaTimes size={20} className="text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6">
                            {!showForm ? (
                                <>
                                    {/* Customer Info */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Your Name (Optional)</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Enter your name"
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500"
                                        />
                                    </div>
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Your Phone (Optional)</label>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="Enter your phone number"
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500"
                                        />
                                    </div>

                                    {/* Quick Inquiry Options */}
                                    <p className="text-sm font-medium text-gray-700 mb-3">Select inquiry type:</p>
                                    <div className="space-y-2 mb-6">
                                        {quickInquiryOptions.map((option) => (
                                            <button
                                                key={option.id}
                                                onClick={() => handleQuickInquiry(option)}
                                                className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:border-pink-500 hover:bg-pink-50 transition-all group"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-xl">{option.icon}</span>
                                                    <span className="font-medium text-gray-700 group-hover:text-pink-600">
                                                        {option.label}
                                                    </span>
                                                </div>
                                                <span className="text-pink-500 text-sm">Send →</span>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Custom Message Option */}
                                    <button
                                        onClick={() => setShowForm(true)}
                                        className="w-full flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-pink-300 rounded-xl text-pink-600 hover:bg-pink-50 transition-all"
                                    >
                                        <span>✏️</span>
                                        <span>Type Custom Message</span>
                                    </button>

                                    <div className="mt-6 p-3 bg-green-50 rounded-xl text-center">
                                        <p className="text-xs text-green-600">
                                            ⚡ Our team will respond within 15 minutes during business hours (9AM - 10PM)
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Your Message</label>
                                        <textarea
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            rows="6"
                                            placeholder="Type your message here... For example:&#10;&#10;I'd like to order a 1kg Chocolate Cake for delivery on Saturday. Please let me know if it's available."
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 resize-none"
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setShowForm(false)}
                                            className="flex-1 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={handleCustomMessage}
                                            disabled={!message.trim()}
                                            className="flex-1 py-2 bg-[#25D366] text-white rounded-xl font-medium hover:bg-[#20B859] transition-colors disabled:opacity-50"
                                        >
                                            Send Message
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Business Hours */}
                        <div className="sticky bottom-0 bg-gray-50 p-4 border-t text-center">
                            <p className="text-xs text-gray-500">
                                📍 Business Hours: 9:00 AM - 10:00 PM (Daily)<br />
                                📞 Call us: +91 75029 81623
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default WhatsAppButton;