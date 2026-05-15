// src/components/RefundPolicy.jsx
import { useNavigate } from 'react-router-dom';

const RefundPolicy = () => {
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
                        Refund & Cancellation Policy
                    </h1>
                    <p className="text-gray-500">Last Updated: January 2026</p>
                </div>

                {/* Content */}
                <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Cancellation Policy</h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            You can cancel your order under the following conditions:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                            <li><strong>Regular Orders:</strong> Cancel within 1 hour of placing the order for full refund</li>
                            <li><strong>Custom Cakes:</strong> Cancellation must be made at least 48 hours before delivery</li>
                            <li><strong>Same-day Orders:</strong> Cannot be cancelled after order confirmation</li>
                            <li><strong>Bulk Orders:</strong> Require 72 hours notice for cancellation</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Refund Policy</h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            Refunds are processed based on the following criteria:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                            <li><strong>Full Refund:</strong> Order cancelled within allowed time frame</li>
                            <li><strong>Partial Refund (50%):</strong> Order cancelled after the cancellation window but before preparation begins</li>
                            <li><strong>No Refund:</strong> Order already prepared or out for delivery</li>
                            <li><strong>Quality Issues:</strong> Full refund or replacement if product quality is unsatisfactory (with proof)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Refund Process</h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            Refunds are processed as follows:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                            <li><strong>COD Orders:</strong> No payment collected, no refund needed</li>
                            <li><strong>UPI/Razorpay:</strong> Refund processed within 5-7 business days</li>
                            <li><strong>Store Credit:</strong> Available for future orders</li>
                            <li>Refund amount will be credited to the original payment method</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Damaged or Incorrect Items</h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            If you receive damaged or incorrect items:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                            <li>Report within 2 hours of delivery</li>
                            <li>Provide clear photos of the product</li>
                            <li>We will arrange for replacement or refund</li>
                            <li>Delivery fee will be refunded in case of damaged items</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Quality Guarantee</h2>
                        <p className="text-gray-600 leading-relaxed">
                            We take pride in our product quality. If you're unsatisfied with the taste or quality:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4 mt-4">
                            <li>Contact us within 24 hours of delivery</li>
                            <li>Return at least 50% of the product</li>
                            <li>We will issue a full refund or replacement</li>
                            <li>Quality issues assessed on a case-by-case basis</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Delivery Delays</h2>
                        <p className="text-gray-600 leading-relaxed">
                            In case of significant delivery delays (beyond 2 hours of promised time):
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4 mt-4">
                            <li>Partial refund of delivery charges may be offered</li>
                            <li>Full refund if delay exceeds 4 hours</li>
                            <li>Compensation for special occasion cakes (birthdays, weddings) if delay causes inconvenience</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. How to Request Refund</h2>
                        <p className="text-gray-600 leading-relaxed">
                            To request a refund or cancellation:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4 mt-4">
                            <li>Email: carloscakecafe@gmail.com</li>
                            <li>Phone: +91 98809 44843</li>
                            <li>Through your order history on our website</li>
                            <li>Provide your order ID and reason for refund</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Exceptions</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Refunds will not be provided in the following cases:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4 mt-4">
                            <li>Change of mind after order preparation</li>
                            <li>Incorrect address provided by customer</li>
                            <li>Customer not available for delivery</li>
                            <li>Natural disasters or unforeseen circumstances</li>
                        </ul>
                    </section>

                    <div className="bg-pink-50 rounded-xl p-6 mt-8">
                        <h3 className="font-bold text-gray-900 mb-2">Need Help?</h3>
                        <p className="text-gray-600 text-sm">
                            For any refund-related queries, please contact our customer support:<br />
                            📞 Phone: +91 98809 44843<br />
                            📧 Email: carloscakecafe@gmail.com<br />
                            ⏰ Hours: 9:00 AM - 10:00 PM (Daily)
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RefundPolicy;