// src/components/PrivacyPolicy.jsx
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-24">
            <div className="max-w-4xl mx-auto px-6">
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

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tighter mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-gray-500">Last Updated: January 2026</p>
                </div>

                {/* Content */}
                <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            At Carlos Cake Cafe, we collect information to provide better services to our customers. We collect:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                            <li>Personal information (name, email, phone number, address)</li>
                            <li>Order history and preferences</li>
                            <li>Payment information (processed securely through third-party providers)</li>
                            <li>Website usage data and cookies</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            We use the collected information for:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                            <li>Processing and delivering your orders</li>
                            <li>Communicating about your orders and updates</li>
                            <li>Improving our products and services</li>
                            <li>Sending promotional offers (with your consent)</li>
                            <li>Customer support and feedback</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information Sharing</h2>
                        <p className="text-gray-600 leading-relaxed">
                            We do not sell, trade, or rent your personal information to third parties. We may share information with:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4 mt-4">
                            <li>Delivery partners to fulfill your orders</li>
                            <li>Payment processors for secure transactions</li>
                            <li>Legal authorities when required by law</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
                        <p className="text-gray-600 leading-relaxed">
                            We implement industry-standard security measures to protect your personal information. This includes encrypted data transmission, secure servers, and regular security audits.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cookies</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Our website uses cookies to enhance your browsing experience. You can choose to disable cookies through your browser settings, but this may affect website functionality.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights</h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            You have the right to:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                            <li>Access your personal information</li>
                            <li>Correct inaccurate information</li>
                            <li>Request deletion of your data</li>
                            <li>Opt-out of marketing communications</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Contact Us</h2>
                        <p className="text-gray-600 leading-relaxed">
                            For privacy-related questions, contact us at:<br />
                            Email: carloscakecafe@gmail.com<br />
                            Phone: +91 98809 44843
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;