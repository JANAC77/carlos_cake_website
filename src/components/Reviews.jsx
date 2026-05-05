// src/components/Reviews.jsx
import { useState, useEffect } from 'react';
import { getProductReviews, addReview, getUserReviewForProduct } from '../firebase';

const Reviews = ({ productId, user, onReviewAdded }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [userReview, setUserReview] = useState(null);
    const [formData, setFormData] = useState({
        rating: 5,
        comment: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (productId) {
            fetchReviews();
        }
    }, [productId]);

    useEffect(() => {
        if (user && productId) {
            checkUserReview();
        }
    }, [user, productId]);

    const fetchReviews = async () => {
        setLoading(true);
        const data = await getProductReviews(productId);
        setReviews(data);
        setLoading(false);
    };

    const checkUserReview = async () => {
        if (user?.id) {
            const existingReview = await getUserReviewForProduct(productId, user.id);
            setUserReview(existingReview);
            if (existingReview) {
                setShowForm(false);
            }
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!user || !user.id) {
            alert('Please login to submit a review');
            return;
        }
        
        if (!formData.comment.trim()) {
            alert('Please write your review');
            return;
        }
        
        setSubmitting(true);
        
        const result = await addReview(
            productId,
            user.id,
            user.name || user.email?.split('@')[0] || 'Anonymous',
            formData.rating,
            formData.comment
        );
        
        if (result.success) {
            setSuccessMessage('Review submitted successfully! 🎉');
            setFormData({ rating: 5, comment: '' });
            setShowForm(false);
            fetchReviews();
            checkUserReview();
            if (onReviewAdded) onReviewAdded();
            
            setTimeout(() => setSuccessMessage(''), 3000);
        } else {
            alert('Failed to submit review: ' + result.error);
        }
        
        setSubmitting(false);
    };

    const renderStars = (rating, interactive = false, onStarClick = null) => {
        return (
            <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type={interactive ? "button" : undefined}
                        onClick={interactive ? () => onStarClick?.(star) : undefined}
                        className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
                    >
                        <svg 
                            className={`w-5 h-5 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
                            viewBox="0 0 20 20"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    </button>
                ))}
            </div>
        );
    };

    const calculateAverageRating = () => {
        if (reviews.length === 0) return 0;
        const total = reviews.reduce((sum, review) => sum + review.rating, 0);
        return (total / reviews.length).toFixed(1);
    };

    const formatDate = (date) => {
        if (!date) return 'Recently';
        try {
            // Handle different date formats
            let dateObj = date;
            if (date && typeof date.toDate === 'function') {
                dateObj = date.toDate();
            } else if (date && typeof date === 'object' && date.seconds) {
                dateObj = new Date(date.seconds * 1000);
            } else if (date && typeof date === 'string') {
                dateObj = new Date(date);
            } else if (date instanceof Date) {
                dateObj = date;
            } else {
                return 'Recently';
            }
            
            if (isNaN(dateObj.getTime())) return 'Recently';
            
            return dateObj.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        } catch (error) {
            return 'Recently';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-pink-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="mt-12 pt-8 border-t border-gray-200">
            {/* Success Message */}
            {successMessage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl animate-slide-down">
                    <p className="text-green-600 text-center font-medium">{successMessage}</p>
                </div>
            )}

            {/* Reviews Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h3 className="text-2xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tight">
                        Customer Reviews
                    </h3>
                    <div className="flex items-center space-x-3 mt-2">
                        <div className="flex items-center">
                            {renderStars(calculateAverageRating())}
                        </div>
                        <span className="text-2xl font-bold text-gray-900">{calculateAverageRating()}</span>
                        <span className="text-gray-500">({reviews.length} reviews)</span>
                    </div>
                </div>
                
                {!userReview && (
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-pink-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-gray-900 transition-all"
                    >
                        {showForm ? 'Cancel' : 'Write a Review'}
                    </button>
                )}
            </div>

            {/* Review Form */}
            {showForm && !userReview && (
                <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                    <h4 className="font-bold text-gray-900 mb-4">Share Your Experience</h4>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                            <div className="flex items-center space-x-2">
                                {renderStars(formData.rating, true, (star) => setFormData({ ...formData, rating: star }))}
                                <span className="text-sm text-gray-500 ml-2">
                                    {formData.rating === 5 ? 'Excellent!' : 
                                     formData.rating === 4 ? 'Very Good' : 
                                     formData.rating === 3 ? 'Good' : 
                                     formData.rating === 2 ? 'Fair' : 'Poor'}
                                </span>
                            </div>
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Your Review *</label>
                            <textarea
                                name="comment"
                                value={formData.comment}
                                onChange={handleInputChange}
                                rows="4"
                                required
                                placeholder="Tell us about your experience with this product..."
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 transition-all"
                            />
                        </div>
                        
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="bg-pink-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-gray-900 transition-all disabled:opacity-50"
                            >
                                {submitting ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* User's Own Review */}
            {userReview && (
                <div className="bg-pink-50 rounded-2xl p-5 mb-8 border border-pink-100">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                                {userReview.userName?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">{userReview.userName}</p>
                                <p className="text-xs text-gray-400">Your Review</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-1">
                            {renderStars(userReview.rating)}
                        </div>
                    </div>
                    <p className="text-gray-600 mt-2">{userReview.comment}</p>
                    <p className="text-xs text-gray-400 mt-3">{formatDate(userReview.createdAt)}</p>
                </div>
            )}

            {/* All Reviews List */}
            {reviews.length > 0 ? (
                <div className="space-y-6">
                    {reviews.map((review) => (
                        // Skip showing user's own review again if already shown above
                        (userReview?.id !== review.id) && (
                            <div key={review.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold">
                                            {review.userName?.charAt(0)?.toUpperCase() || 'A'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{review.userName}</p>
                                            <p className="text-xs text-gray-400">{formatDate(review.createdAt)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        {renderStars(review.rating)}
                                    </div>
                                </div>
                                <p className="text-gray-600 mt-2 leading-relaxed">{review.comment}</p>
                            </div>
                        )
                    ))}
                </div>
            ) : (
                !userReview && (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl">
                        <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">No Reviews Yet</h4>
                        <p className="text-gray-500">Be the first to review this product!</p>
                    </div>
                )
            )}
        </div>
    );
};

export default Reviews;