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

    const whatsappNumber = "918147751838 ";
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

            {/* Floating Action Buttons */}
            {!isOpen && (
                <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3 items-center">
                    {/* WhatsApp Button */}
                    <button
                        onClick={() => setIsOpen(true)}
                        className="bg-[#25D366] hover:bg-[#20B859] text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 flex-shrink-0 cursor-pointer"
                    >
                        <FaWhatsapp size={28} />
                    </button>

                    {/* Swiggy Button */}
                    <a
                        href="https://www.swiggy.com/city/bangalore/carlos-cake-cafe-bellandur-gate-sarjapur-road-rest58184"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Order on Swiggy"
                        className="bg-[#FC8019] hover:bg-[#e47213] text-white rounded-full w-[52px] h-[52px] flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
                    >
                        <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <title>Swiggy</title>
                            <path d="M12.034 24c-.376-.411-2.075-2.584-3.95-5.513-.547-.916-.901-1.63-.833-1.814.178-.48 3.355-.743 4.333-.308.298.132.29.307.29.409 0 .44-.022 1.619-.022 1.619a.441.441 0 1 0 .883-.002l-.005-2.939c0-.255-.278-.319-.331-.329-.511-.002-1.548-.006-2.661-.006-2.457 0-3.006.101-3.423-.172-.904-.591-2.383-4.577-2.417-6.819C3.849 4.964 5.723 2.225 8.362.868A8.13 8.13 0 0 1 12.026 0c4.177 0 7.617 3.153 8.075 7.209l.001.011c.084.981-5.321 1.189-6.39.904-.164-.044-.206-.212-.206-.284L13.5 4.996a.442.442 0 0 0-.884.002l.009 3.866a.33.33 0 0 0 .268.32l3.354-.001c1.79 0 2.542.207 3.042.588.333.254.461.739.349 1.37C18.633 16.755 12.273 23.71 12.034 24z" />
                        </svg>
                    </a>

                    {/* Zomato Button */}
                    <a
                        href="https://www.zomato.com/bangalore/carlos-cake-cafe-bellandur-bangalore"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Order on Zomato"
                        className="bg-[#E23744] hover:bg-[#cb2f3a] text-white rounded-full w-[52px] h-[52px] flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
                    >
                        <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <title>Zomato</title>
                            <path d="M19.615 9.45l-1.258.473-.167.71-.446.021-.115.978h.408l-.211 1.51c-.131.939.036 1.381.865 1.381.488 0 .91-.175 1.135-.297l.145-.9c-.167.083-.436.19-.618.19-.247 0-.276-.13-.225-.488l.189-1.396h.843c.03-.206.131-.877.16-1h-.865zm-3.779 1.002c-.115.002-.236.01-.361.026a3.592 3.592 0 0 0-1.347.432l.26.789c.269-.15.615-.28.978-.326.538-.066.757.1.79.375.014.109.004.199-.005.289l-.014.056a3.46 3.46 0 0 0-1.097-.036c-.518.063-.943.273-1.204.6a1.324 1.324 0 0 0-.225 1.034c.127.583.553.84 1.199.76.45-.055.812-.27 1.076-.63a2.665 2.665 0 0 1-.03.304 1.74 1.74 0 0 1-.072.29l1.244.001a3.657 3.657 0 0 1-.001-.365c.036-.459.118-1.143.247-2.051a2.397 2.397 0 0 0-.002-.59c-.08-.644-.628-.969-1.436-.958zm6.536.063c-1.194 0-2.107 1.067-2.107 2.342 0 .959.552 1.693 1.628 1.693 1.2 0 2.107-1.067 2.107-2.35 0-.95-.538-1.685-1.628-1.685zm-11.777.041c-.538 0-1.12.465-1.52 1.236.102-.504.08-1.076.051-1.198a8.964 8.964 0 0 1-1.287.122 6.9 6.9 0 0 1-.073 1.243l-.167 1.145c-.066.45-.138.969-.211 1.297h1.353c.007-.199.058-.511.094-.786l.116-.786c.095-.511.502-1.114.815-1.114.182 0 .175.176.124.504l-.131.885c-.066.45-.138.969-.211 1.297h1.367c.008-.199.051-.512.088-.786l.116-.786c.094-.512.502-1.114.814-1.114.182 0 .175.168.146.396l-.327 2.29H13l.438-2.609c.095-.649.044-1.236-.676-1.236-.523 0-1.09.443-1.49 1.182.087-.61.036-1.182-.677-1.182zm-4.88.008c-1.177 0-2.08 1.053-2.08 2.312 0 .946.546 1.67 1.608 1.67 1.185 0 2.08-1.052 2.08-2.319 0-.938-.531-1.663-1.607-1.663zm-5.126.091c-.05.39-.102.778-.175 1.13.328-.008.619-.016 1.411-.016l-1.81 1.96-.015.703c.444-.03.997-.039 1.63-.039.566 0 1.134.008 1.497.039.065-.458.13-.763.21-1.137-.275.015-.755.023-1.512.023l1.81-1.969.023-.694c-.437.023-.83.03-1.52.03-.749 0-.975-.007-1.549-.03zm4.988.927c.255 0 .408.228.408.701 0 .687-.276 1.251-.626 1.251-.261 0-.414-.236-.414-.702 0-.694.283-1.25.632-1.25zm16.629 0c.254 0 .407.228.407.701 0 .687-.276 1.251-.625 1.251-.262 0-.415-.236-.415-.702 0-.694.284-1.25.633-1.25zM15.51 12.64c.206-.003.403.024.55.058l-.013.118c-.075.44-.39.881-.848.938-.31.037-.578-.148-.608-.39a.538.538 0 0 1 .114-.41c.117-.159.336-.268.599-.3.069-.009.138-.013.206-.014Z" />
                        </svg>
                    </a>


                </div>
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
                                📞 Call us: +91 81477 51838
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default WhatsAppButton;