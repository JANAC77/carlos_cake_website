// src/components/ProfilePage.jsx
import { useState, useEffect } from 'react';
import { getUserOrders, updateUserInFirestore } from '../firebase';
import { auth } from '../firebase';
import { updateProfile } from 'firebase/auth';

const ProfilePage = ({ user, onUpdateProfile, onNavigate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [orderStats, setOrderStats] = useState({
        totalOrders: 0,
        totalSpent: 0,
        recentOrders: []
    });

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phoneNumber || '',
        address: user?.address || '',
        city: user?.city || '',
        pincode: user?.pincode || ''
    });

    useEffect(() => {
        if (user?.id) {
            fetchUserOrders();
        }
    }, [user]);

    const fetchUserOrders = async () => {
        const orders = await getUserOrders(user.id);
        const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);
        setOrderStats({
            totalOrders: orders.length,
            totalSpent: totalSpent,
            recentOrders: orders.slice(0, 3)
        });
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMessage('');

        try {
            // Update Firebase Auth profile
            if (auth.currentUser && formData.name !== user.name) {
                await updateProfile(auth.currentUser, {
                    displayName: formData.name
                });
            }

            // Update Firestore user document
            const result = await updateUserInFirestore(user.id, {
                name: formData.name,
                phoneNumber: formData.phone,
                address: formData.address,
                city: formData.city,
                pincode: formData.pincode,
                updatedAt: new Date().toISOString()
            });

            if (result.success) {
                const updatedUser = {
                    ...user,
                    name: formData.name,
                    phoneNumber: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    pincode: formData.pincode
                };
                onUpdateProfile(updatedUser);
                setSuccessMessage('Profile updated successfully!');
                setIsEditing(false);

                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                alert('Failed to update profile: ' + result.error);
            }
        } catch (error) {
            console.error('Update error:', error);
            alert('Failed to update profile');
        }
        setLoading(false);
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 pt-32 pb-24">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="bg-white rounded-3xl p-12 shadow-xl">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
                        <p className="text-gray-500 mb-6">You need to be logged in to view your profile.</p>
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

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-24">
            <div className="max-w-6xl mx-auto px-6 lg:px-12">
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-32">
                            <div className="text-center">
                                <div className="w-28 h-28 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-4xl font-bold text-white">
                                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </span>
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                                <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
                                <p className="text-gray-400 text-xs mt-2">Member since {new Date(user?.createdAt).toLocaleDateString()}</p>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-gray-500 text-sm">Total Orders</span>
                                    <span className="font-bold text-gray-900">{orderStats.totalOrders}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 text-sm">Total Spent</span>
                                    <span className="font-bold text-pink-600">₹{orderStats.totalSpent.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="mt-6 space-y-3">
                                <button
                                    onClick={() => onNavigate('/my-orders')}
                                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-pink-600 hover:text-white transition-all"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 11h14l1 12H4L5 11z" />
                                    </svg>
                                    <span>View All Orders</span>
                                </button>
                                <button
                                    onClick={() => onNavigate('/wishlist')}
                                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-pink-600 hover:text-white transition-all"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    <span>My Wishlist</span>
                                </button>
                            </div>

                            {/* Recent Orders Preview */}
                            {orderStats.recentOrders.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    <h3 className="font-bold text-gray-900 mb-3 text-sm">Recent Orders</h3>
                                    <div className="space-y-2">
                                        {orderStats.recentOrders.map((order) => (
                                            <div key={order.id} className="flex justify-between items-center text-sm">
                                                <span className="text-gray-500">#{order.id?.slice(0, 8)}</span>
                                                <span className="font-medium">₹{order.total}</span>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                                                    order.status === 'processing' ? 'bg-yellow-100 text-yellow-600' :
                                                        'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {order.status || 'pending'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Profile Edit Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold text-gray-900">Profile Information</h1>
                                {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="text-pink-600 hover:text-pink-700 font-medium"
                                    >
                                        Edit Profile
                                    </button>
                                )}
                            </div>

                            {successMessage && (
                                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl animate-slide-down">
                                    <p className="text-green-600 text-sm text-center">{successMessage}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 transition-all ${!isEditing ? 'bg-gray-50 text-gray-500' : ''
                                                }`}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            disabled
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                                        />
                                        <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            placeholder="Enter your phone number"
                                            className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 transition-all ${!isEditing ? 'bg-gray-50 text-gray-500' : ''
                                                }`}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address</label>
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            rows="3"
                                            placeholder="Enter your full address"
                                            className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 transition-all ${!isEditing ? 'bg-gray-50 text-gray-500' : ''
                                                }`}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                placeholder="Enter city"
                                                className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 transition-all ${!isEditing ? 'bg-gray-50 text-gray-500' : ''
                                                    }`}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                                            <input
                                                type="text"
                                                name="pincode"
                                                value={formData.pincode}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                placeholder="Enter pincode"
                                                className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 transition-all ${!isEditing ? 'bg-gray-50 text-gray-500' : ''
                                                    }`}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {isEditing && (
                                    <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-100">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsEditing(false);
                                                setFormData({
                                                    name: user?.name || '',
                                                    email: user?.email || '',
                                                    phone: user?.phoneNumber || '',
                                                    address: user?.address || '',
                                                    city: user?.city || '',
                                                    pincode: user?.pincode || ''
                                                });
                                            }}
                                            className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="px-6 py-3 bg-pink-600 text-white rounded-xl font-medium hover:bg-gray-900 transition-all disabled:opacity-50"
                                        >
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;