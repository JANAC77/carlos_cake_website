// src/components/TermsConditions.jsx
import { useNavigate } from 'react-router-dom';

const TermsConditions = () => {
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
                        Terms & Conditions
                    </h1>
                    <p className="text-gray-500">Last Updated: January 2026</p>
                </div>

                {/* Content */}
                <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                        <p className="text-gray-600 leading-relaxed">
                            By accessing and using Carlos Cake Cafe's website and services, you agree to comply with these Terms & Conditions. If you disagree with any part, please do not use our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Order Placement</h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            When placing an order:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                            <li>You must provide accurate and complete information</li>
                            <li>Orders are subject to availability and confirmation</li>
                            <li>We reserve the right to cancel any order at our discretion</li>
                            <li>Custom cake orders require 48-72 hours advance notice</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Pricing and Payment</h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            All prices are in Indian Rupees (INR) and include applicable taxes unless stated otherwise.
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                            <li>Prices are subject to change without notice</li>
                            <li>Payment must be completed before order processing</li>
                            <li>We accept Cash on Delivery and UPI payments</li>
                            <li>Delivery charges of ₹100 apply to all orders</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Delivery Policy</h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            We strive to deliver your orders promptly:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                            <li>Delivery within 2-3 hours of order confirmation</li>
                            <li>Delivery available within Bangalore city limits</li>
                            <li>A ₹100 delivery fee applies to all orders</li>
                            <li>Please provide accurate address for successful delivery</li>
                            <li>Delivery delays due to unforeseen circumstances will be communicated</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. User Account</h2>
                        <p className="text-gray-600 leading-relaxed">
                            You are responsible for maintaining the confidentiality of your account credentials. Notify us immediately of any unauthorized use of your account.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Prohibited Activities</h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            You agree not to:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                            <li>Use the website for any illegal purpose</li>
                            <li>Attempt to gain unauthorized access to our systems</li>
                            <li>Interfere with the website's functionality</li>
                            <li>Submit false or misleading information</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property</h2>
                        <p className="text-gray-600 leading-relaxed">
                            All content on this website, including logos, images, text, and designs, is the property of Carlos Cake Cafe and protected by copyright laws.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Carlos Cake Cafe shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to Terms</h2>
                        <p className="text-gray-600 leading-relaxed">
                            We reserve the right to modify these terms at any time. Continued use of our services constitutes acceptance of the updated terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Information</h2>
                        <p className="text-gray-600 leading-relaxed">
                            For questions about these Terms & Conditions:<br />
                            Email: carloscakecafe@gmail.com<br />
                            Phone: +91 98809 44843<br />
                            Address: #3, Bellandur Gate, Sarjapur Road, Bangalore-560068
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsConditions;