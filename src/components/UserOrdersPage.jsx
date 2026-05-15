// src/components/UserOrdersPage.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { getUserOrders, getUserOrdersByEmail, cancelOrder } from '../firebase';
import OrderTracking from './OrderTracking';
import { AlertTriangle, XCircle } from 'lucide-react';

const UserOrdersPage = ({ user, onNavigate }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [error, setError] = useState('');
    const hasFetched = useRef(false);

    // Cancel order states
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancellingOrder, setCancellingOrder] = useState(null);
    const [cancelReason, setCancelReason] = useState('');
    const [cancelLoading, setCancelLoading] = useState(false);

    const fetchOrdersByEmail = useCallback(async (email) => {
        try {
            console.log("Fetching orders for user email:", email);
            const emailOrders = await getUserOrdersByEmail(email);
            console.log("Orders by email:", emailOrders);

            if (emailOrders && emailOrders.length > 0) {
                setOrders(emailOrders);
            } else {
                setOrders([]);
            }
        } catch (err) {
            console.error("Error fetching orders by email:", err);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchOrders = useCallback(async (userId, email) => {
        setLoading(true);
        setError('');
        try {
            console.log("Fetching orders for user ID:", userId);
            const userOrders = await getUserOrders(userId);
            console.log("Received orders:", userOrders);

            if (userOrders && userOrders.length > 0) {
                setOrders(userOrders);
                console.log("Orders set successfully:", userOrders.length);
                setLoading(false);
            } else {
                console.log("No orders found by ID, trying email fallback");
                if (email) {
                    await fetchOrdersByEmail(email);
                } else {
                    setLoading(false);
                }
            }
        } catch (err) {
            console.error("Error in fetchOrders:", err);
            setError("Failed to load orders. Please try again.");
            setLoading(false);
        }
    }, [fetchOrdersByEmail]);

    useEffect(() => {
        if (hasFetched.current) return;

        if (user?.id) {
            hasFetched.current = true;
            fetchOrders(user.id, user.email);
        } else if (user?.email) {
            hasFetched.current = true;
            fetchOrdersByEmail(user.email);
        } else {
            setLoading(false);
        }

        return () => {
            hasFetched.current = false;
        };
    }, [user?.id, user?.email, fetchOrders, fetchOrdersByEmail]);

    // Handle cancel order
    const handleCancelOrder = async () => {
        if (!cancelReason.trim()) {
            alert('Please provide a reason for cancellation');
            return;
        }

        setCancelLoading(true);
        const result = await cancelOrder(cancellingOrder.id, cancelReason);

        if (result.success) {
            alert('Order cancelled successfully!');
            setShowCancelModal(false);
            setCancelReason('');
            setCancellingOrder(null);
            // Refresh orders
            if (user?.id) {
                fetchOrders(user.id, user.email);
            } else if (user?.email) {
                fetchOrdersByEmail(user.email);
            }
        } else {
            alert(result.error || 'Failed to cancel order');
        }
        setCancelLoading(false);
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered':
                return 'bg-green-100 text-green-600';
            case 'processing':
                return 'bg-yellow-100 text-yellow-600';
            case 'cancelled':
                return 'bg-red-100 text-red-600';
            case 'pending':
                return 'bg-orange-100 text-orange-600';
            case 'pre-ordered':
                return 'bg-purple-100 text-purple-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    const getStatusText = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered':
                return 'Delivered';
            case 'processing':
                return 'Processing';
            case 'cancelled':
                return 'Cancelled';
            case 'pending':
                return 'Pending';
            case 'pre-ordered':
                return 'Pre-ordered';
            default:
                return status || 'Pending';
        }
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        if (date instanceof Date) {
            return date.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        }
        if (typeof date === 'string') {
            return new Date(date).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        }
        if (date.toDate) {
            return date.toDate().toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        }
        return 'N/A';
    };

    // Function to render order items with add-ons and cake message
    const renderOrderItems = (items) => {
        if (!items || items.length === 0) {
            return <div className="text-gray-500 text-center p-4">No items details available</div>;
        }

        return items.map((item, idx) => {
            const itemTotal = (item.price || 0) * (item.quantity || 1);
            const addonsTotal = (item.addons || []).reduce((s, a) => s + (a.price || 0), 0);
            const totalItemPrice = itemTotal + addonsTotal;

            return (
                <div key={idx} className="p-3 bg-gray-50 rounded-xl mb-3">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-pink-50 rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                    src={item.image || '/placeholder.png'}
                                    alt={item.name || 'Product'}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.src = '/placeholder.png'; }}
                                />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">{item.name || 'Product'}</p>
                                <p className="text-sm text-gray-500">Quantity: {item.quantity || 1}</p>

                                {/* Display Weight */}
                                {item.selectedWeight && (
                                    <div className="mt-1">
                                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                            <span>⚖️</span>
                                            <span>{item.selectedWeight.label}</span>
                                            <span>(Serves: {item.selectedWeight.serves})</span>
                                        </span>
                                    </div>
                                )}

                                {/* Display Occasion */}
                                {item.occasion && (
                                    <p className="text-xs text-blue-600 mt-1">
                                        Occasion: {item.occasion}
                                    </p>
                                )}
                            </div>
                        </div>
                        <p className="font-bold text-gray-900">₹{totalItemPrice}</p>
                    </div>

                    {/* Add-ons */}
                    {item.addons && item.addons.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-gray-200">
                            <p className="text-xs text-gray-500 font-medium mb-1">Add-ons:</p>
                            <div className="flex flex-wrap gap-2">
                                {item.addons.map((addon, addonIdx) => (
                                    <span key={addonIdx} className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full inline-flex items-center gap-1">
                                        <span>{addon.name}</span>
                                        <span className="font-bold">(+₹{addon.price})</span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Cake Message */}
                    {item.cakeMessage && (
                        <div className="mt-2 p-2 bg-purple-50 rounded-lg">
                            <p className="text-xs text-purple-600">
                                💬 Message: <span className="font-medium">"{item.cakeMessage}"</span>
                            </p>
                        </div>
                    )}
                </div>
            );
        });
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 pt-32 pb-24">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="bg-white rounded-3xl p-12 shadow-xl">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
                        <p className="text-gray-500 mb-6">You need to be logged in to view your orders.</p>
                        <button
                            onClick={() => onNavigate('/login')}
                            className="bg-pink-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-900 transition"
                        >
                            Login Now
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-32 pb-24">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                {/* Back Button */}
                <button
                    onClick={() => onNavigate('/')}
                    className="flex items-center space-x-2 text-gray-500 hover:text-pink-600 transition-colors mb-8 group"
                >
                    <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="font-black uppercase tracking-widest text-xs">Back to Home</span>
                </button>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tighter">
                            My Orders
                        </h1>
                        <p className="text-gray-500 mt-2">Track and manage your orders</p>
                    </div>
                    <button
                        onClick={() => onNavigate('/profile')}
                        className="flex items-center space-x-2 text-pink-600 hover:text-pink-700 font-medium"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Go to Profile</span>
                    </button>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-red-600 text-sm text-center">{error}</p>
                    </div>
                )}

                {orders.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                        <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 11h14l1 12H4L5 11z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Orders Yet</h3>
                        <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
                        <button
                            onClick={() => onNavigate('/')}
                            className="bg-pink-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-900 transition"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order, index) => {
                            const canCancel = order.status === 'pending' || order.status === 'pre-ordered';
                            return (
                                <div key={order.id || index} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="p-6 bg-gray-50/50 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div>
                                            <div className="flex items-center space-x-3 mb-2 flex-wrap gap-2">
                                                <span className="text-sm font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                    #{order.orderId || order.id?.slice(0, 8) || `ORD${index + 1}`}
                                                </span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                    {getStatusText(order.status)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                Placed on {formatDate(order.createdAt)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-pink-600">₹{order.total || 0}</p>
                                            <div className="flex gap-2 mt-1 justify-end">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="text-sm text-pink-600 hover:text-pink-700 font-medium hover:underline"
                                                >
                                                    View Details →
                                                </button>
                                                {canCancel && (
                                                    <button
                                                        onClick={() => {
                                                            setCancellingOrder(order);
                                                            setShowCancelModal(true);
                                                        }}
                                                        className="text-sm text-red-500 hover:text-red-600 font-medium"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="flex flex-wrap gap-4">
                                            {order.items && order.items.length > 0 ? (
                                                order.items.slice(0, 3).map((item, idx) => (
                                                    <div key={idx} className="flex items-center space-x-3">
                                                        <div className="w-12 h-12 bg-pink-50 rounded-lg overflow-hidden flex-shrink-0">
                                                            <img
                                                                src={item.image || '/placeholder.png'}
                                                                alt={item.name || 'Product'}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => { e.target.src = '/placeholder.png'; }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900 text-sm">{item.name || 'Product'}</p>
                                                            <p className="text-xs text-gray-500">Qty: {item.quantity || 1}</p>
                                                            {item.occasion && (
                                                                <p className="text-xs text-blue-500"> {item.occasion}</p>
                                                            )}
                                                            {item.addons && item.addons.length > 0 && (
                                                                <p className="text-xs text-pink-500">+{item.addons.length} add-on(s)</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-gray-500 text-sm">No items details available</div>
                                            )}
                                            {order.items && order.items.length > 3 && (
                                                <div className="flex items-center text-gray-500 text-sm">
                                                    +{order.items.length - 3} more items
                                                </div>
                                            )}
                                        </div>

                                        {order.deliveryAddress && (
                                            <div className="mt-4 pt-4 border-t border-gray-100 flex items-start space-x-2 text-sm">
                                                <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <circle cx="12" cy="10" r="3" />
                                                </svg>
                                                <span className="text-gray-500">{order.deliveryAddress}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedOrder(null)}>
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b sticky top-0 bg-white flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                                <p className="text-sm text-gray-500 font-mono">#{selectedOrder.orderId || selectedOrder.id?.slice(0, 8)}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* ORDER TRACKING */}
                            <div className="border-b pb-4">
                                <h3 className="font-bold text-gray-900 mb-3 text-sm">📦 Order Tracking</h3>
                                <OrderTracking orderId={selectedOrder.id} />
                            </div>

                            {/* Order Status */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div>
                                    <p className="text-sm text-gray-500">Current Status</p>
                                    <p className={`font-bold text-lg capitalize ${getStatusColor(selectedOrder.status)}`}>
                                        {getStatusText(selectedOrder.status)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Total Amount</p>
                                    <p className="text-xl font-bold text-pink-600">₹{selectedOrder.total || 0}</p>
                                </div>
                            </div>

                            {/* Delivery Schedule if available */}
                            {selectedOrder.deliveryDate && (
                                <div className="p-4 bg-blue-50 rounded-xl">
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <div>
                                            <p className="text-sm font-medium text-blue-800">Delivery Schedule</p>
                                            <p className="text-xs text-blue-600">
                                                Date: {selectedOrder.deliveryDate} | Time: {selectedOrder.deliveryTimeSlot || 'Not specified'}
                                                {selectedOrder.isPreOrder && " (Pre-order)"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Customer Info */}
                            <div>
                                <h3 className="font-bold text-gray-900 mb-3">👤 Customer Information</h3>
                                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                                    <p><span className="text-gray-500">Name:</span> {selectedOrder.customerName || 'N/A'}</p>
                                    <p><span className="text-gray-500">Email:</span> {selectedOrder.customerEmail || 'N/A'}</p>
                                    <p><span className="text-gray-500">Phone:</span> {selectedOrder.customerPhone || 'N/A'}</p>
                                    <p><span className="text-gray-500">Address:</span> {selectedOrder.deliveryAddress || 'N/A'}</p>
                                </div>
                            </div>

                            {/* Order Items with Add-ons */}
                            <div>
                                <h3 className="font-bold text-gray-900 mb-3">🛒 Items Ordered</h3>
                                <div className="space-y-3">
                                    {renderOrderItems(selectedOrder.items)}
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div className="pt-4 border-t">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Subtotal</span>
                                        <span>₹{selectedOrder.subtotal || 0}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Delivery Charge</span>
                                        <span>₹{selectedOrder.deliveryCharge || 0}</span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t">
                                        <span className="font-bold text-gray-900">Total</span>
                                        <span className="font-bold text-pink-600 text-xl">₹{selectedOrder.total || 0}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div className="bg-gray-50 rounded-xl p-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">Payment Method</span>
                                    <span className="font-medium text-gray-900 capitalize">
                                        {selectedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' :
                                            selectedOrder.paymentMethod === 'card' ? 'Credit/Debit Card' :
                                                selectedOrder.paymentMethod === 'upi' ? 'UPI' :
                                                    selectedOrder.paymentMethod || 'N/A'}
                                    </span>
                                </div>
                            </div>

                            {/* Cancel button in modal if order can be cancelled */}
                            {(selectedOrder.status === 'pending' || selectedOrder.status === 'pre-ordered') && (
                                <button
                                    onClick={() => {
                                        setSelectedOrder(null);
                                        setCancellingOrder(selectedOrder);
                                        setShowCancelModal(true);
                                    }}
                                    className="w-full bg-red-500 text-white py-3 rounded-xl font-medium hover:bg-red-600 transition-colors"
                                >
                                    Cancel Order
                                </button>
                            )}

                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="w-full bg-pink-600 text-white py-3 rounded-xl font-medium hover:bg-gray-900 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel Order Modal */}
            {showCancelModal && cancellingOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full">
                        <div className="p-6 border-b">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                    <AlertTriangle className="w-5 h-5 text-red-500" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Cancel Order</h2>
                            </div>
                            <p className="text-gray-500 text-sm mt-2">
                                Are you sure you want to cancel order #{cancellingOrder.orderId || cancellingOrder.id?.slice(0, 8)}?
                            </p>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Reason for cancellation <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    rows="3"
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                    placeholder="Please tell us why you want to cancel this order..."
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500"
                                />
                            </div>

                            <div className="bg-yellow-50 rounded-xl p-3">
                                <p className="text-xs text-yellow-700">
                                    ⚠️ Note: Once cancelled, this action cannot be undone.
                                    {cancellingOrder?.paymentMethod === 'cod'
                                        ? ' No payment has been collected as this is a COD order.'
                                        : ' Refund will be processed within 5-7 business days.'}
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowCancelModal(false);
                                        setCancellingOrder(null);
                                        setCancelReason('');
                                    }}
                                    className="flex-1 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    Keep Order
                                </button>
                                <button
                                    onClick={handleCancelOrder}
                                    disabled={cancelLoading}
                                    className="flex-1 py-2 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                                >
                                    {cancelLoading ? 'Cancelling...' : 'Yes, Cancel Order'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserOrdersPage;