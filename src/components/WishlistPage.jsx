// src/components/WishlistPage.jsx
import { useState } from 'react';
import { Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';

const WishlistPage = ({ wishlist, onRemove, onMoveToCart, onNavigate, onProductClick }) => {
    if (wishlist.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 pt-32 pb-24">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="bg-white rounded-3xl p-12 shadow-xl">
                        <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Wishlist is Empty</h2>
                        <p className="text-gray-500 mb-6">Save your favorite items here!</p>
                        <button
                            onClick={() => onNavigate('home')}
                            className="inline-block bg-pink-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-900 transition"
                        >
                            Start Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                {/* Back Button */}
                <div className="mb-8">
                    <button
                        onClick={() => onNavigate('home')}
                        className="flex items-center space-x-2 text-gray-500 hover:text-pink-600 transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
                        <span className="font-black uppercase tracking-widest text-xs">Back to Home</span>
                    </button>
                </div>

                <h1 className="text-3xl md:text-4xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tighter mb-8">
                    My Wishlist ({wishlist.length})
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {wishlist.map((item) => (
                        <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                            <div
                                className="relative aspect-square bg-gray-100 overflow-hidden cursor-pointer"
                                onClick={() => onProductClick(item)}
                            >
                                <img
                                    src={item.image || '/placeholder.png'}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>

                            <div className="p-5">
                                <h3
                                    className="font-bold text-gray-900 text-lg mb-1 cursor-pointer hover:text-pink-600 transition-colors line-clamp-1"
                                    onClick={() => onProductClick(item)}
                                >
                                    {item.name}
                                </h3>
                                <p className="text-gray-500 text-sm mb-3">{item.category}</p>
                                <p className="text-xl font-bold text-pink-600 mb-4">₹{item.price}</p>

                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => onMoveToCart(item)}
                                        className="flex-1 flex items-center justify-center space-x-2 bg-pink-600 text-white py-2.5 rounded-xl font-medium hover:bg-gray-900 transition-all"
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                        <span>Move to Cart</span>
                                    </button>
                                    <button
                                        onClick={() => onRemove(item.id)}
                                        className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WishlistPage;