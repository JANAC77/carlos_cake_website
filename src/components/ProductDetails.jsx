// src/components/ProductDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, getProducts } from '../firebase';
import ProductCard from './ProductCard';

const ProductDetails = ({ onAddToCart, onAddToWishlist, wishlist = [] }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      fetchProductDetails();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const fetchProductDetails = async () => {
    setLoading(true);
    const productData = await getProductById(id);
    setProduct(productData);

    if (productData) {
      const related = await getProducts(productData.categoryId);
      const filtered = related.filter(p => p.id !== id).slice(0, 3);
      setRelatedProducts(filtered);
    }
    setLoading(false);
  };

  const handleAddToCart = () => {
    onAddToCart({ ...product, quantity });
  };

  const handleBuyNow = () => {
    // Add to cart first then navigate to checkout
    onAddToCart({ ...product, quantity });
    // Navigate to cart page
    navigate('/cart');
  };

  const handleAddToWishlist = () => {
    onAddToWishlist(product);
  };

  const isInWishlist = wishlist?.some(item => item.id === id);

  const HeartIcon = ({ filled }) => (
    <svg className={`w-6 h-6 transition-colors ${filled ? 'fill-pink-600 text-pink-600' : 'text-gray-400 hover:text-pink-600'}`} fill={filled ? "#EC4899" : "none"} stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );

  if (loading) {
    return (
      <div className="pt-32 pb-24 bg-white min-h-screen">
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-32 pb-24 bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <button onClick={() => navigate('/')} className="text-pink-600 hover:underline">Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-16 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-500 hover:text-pink-600 transition-colors mb-6 group"
        >
          <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Product Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="relative">
            <div className="bg-pink-50 rounded-2xl overflow-hidden">
              <img
                src={product.image || '/placeholder.png'}
                alt={product.name}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-pink-600 font-semibold uppercase tracking-wider text-xs">
                  {product.categoryName || product.category || 'Cake'}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-3">
                  {product.name}
                </h1>
              </div>
              <button
                onClick={handleAddToWishlist}
                className="p-2 hover:bg-pink-50 rounded-full transition-colors"
              >
                <HeartIcon filled={isInWishlist} />
              </button>
            </div>

            <p className="text-gray-600 leading-relaxed mb-6">
              {product.description || 'Delicious cake freshly baked with premium ingredients. Perfect for any celebration.'}
            </p>

            <div className="border-t border-b border-gray-100 py-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current text-yellow-400" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-sm text-gray-500 ml-1">(48 reviews)</span>
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-50 text-gray-600 text-lg"
                  >
                    -
                  </button>
                  <span className="px-6 py-2 font-medium text-gray-900 border-x border-gray-200 min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-gray-50 text-gray-600 text-lg"
                  >
                    +
                  </button>
                </div>
                <p className="text-sm text-green-600">✓ In Stock</p>
              </div>
            </div>

            {/* Buttons - Add to Cart and Buy Now */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-pink-600 text-white py-3 rounded-xl font-semibold hover:bg-gray-900 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 11h14l1 12H4L5 11z" />
                </svg>
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-pink-600 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Buy Now</span>
              </button>
            </div>

            {/* Delivery Info */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3 text-sm">
                <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-600">Free delivery on orders above ₹500</span>
              </div>
              <div className="flex items-center space-x-3 text-sm mt-2">
                <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-600">Delivery within 2-3 hours</span>
              </div>
              <div className="flex items-center space-x-3 text-sm mt-2">
                <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span className="text-gray-600">Cash on Delivery available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  onClick={() => navigate(`/product/${relatedProduct.id}`)}
                  onAddToCart={onAddToCart}
                  onAddToWishlist={onAddToWishlist}
                  wishlist={wishlist}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;