// components/CategoryPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProducts, getCategories } from '../firebase';
import ProductCard from './ProductCard';

const CategoryPage = ({ onProductClick, onAddToCart, onAddToWishlist, wishlist, cart, isLoggedIn }) => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (categoryName) {
      fetchCategoryAndProducts();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [categoryName]);

  const fetchCategoryAndProducts = async () => {
    setLoading(true);
    
    // Decode the category name from URL
    const decodedName = decodeURIComponent(categoryName).replace(/-/g, ' ');
    
    // Get all categories to find matching one
    const allCategories = await getCategories();
    
    // Find category by matching name (case insensitive)
    const matchedCategory = allCategories.find(
      cat => cat.name?.toLowerCase() === decodedName.toLowerCase() ||
              cat.name?.toLowerCase().replace(/\s+/g, '-') === categoryName.toLowerCase()
    );
    
    setCategory(matchedCategory);
    
    if (matchedCategory) {
      // Get products for this category
      const allProducts = await getProducts();
      const categoryProducts = allProducts.filter(
        product => product.categoryId === matchedCategory.id ||
                   product.category?.toLowerCase() === matchedCategory.name?.toLowerCase() ||
                   product.categoryName?.toLowerCase() === matchedCategory.name?.toLowerCase()
      );
      setProducts(categoryProducts);
    } else {
      // Fallback: try to filter by name
      const allProducts = await getProducts();
      const filteredProducts = allProducts.filter(
        product => product.category?.toLowerCase().includes(decodedName.toLowerCase()) ||
                   product.categoryName?.toLowerCase().includes(decodedName.toLowerCase()) ||
                   (product.tags && product.tags.some(tag => tag.toLowerCase().includes(decodedName.toLowerCase())))
      );
      setProducts(filteredProducts);
    }
    
    setLoading(false);
  };

  const getCategoryDescription = (name) => {
    const lowerName = name?.toLowerCase() || '';
    if (lowerName.includes('birthday')) {
      return 'Make every birthday extra special with our delicious, beautifully decorated cakes';
    }
    if (lowerName.includes('wedding')) {
      return 'Create unforgettable memories with our elegant, handcrafted wedding cakes';
    }
    if (lowerName.includes('custom')) {
      return 'Bring your vision to life with our bespoke cake design service';
    }
    if (lowerName.includes('cupcake')) {
      return 'Bite-sized happiness - Perfect for parties, gifts, or simply treating yourself';
    }
    if (lowerName.includes('chocolate')) {
      return 'Rich, decadent chocolate cakes made with premium cocoa for the ultimate indulgence';
    }
    if (lowerName.includes('fruit')) {
      return 'Fresh fruit cakes bursting with natural flavors and seasonal ingredients';
    }
    return `Discover our amazing collection of ${name} cakes, freshly baked with premium ingredients`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-24 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
      </div>
    );
  }

  const displayName = category?.name || decodeURIComponent(categoryName).replace(/-/g, ' ');
  const description = getCategoryDescription(displayName);

  return (
    <div className="min-h-screen bg-white pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
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

        {/* Category Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tighter">
            {displayName}
          </h1>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            {description}
          </p>
        </div>


        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={onProductClick}
                onAddToCart={onAddToCart}
                onAddToWishlist={onAddToWishlist}
                wishlist={wishlist}
                cart={cart}
                isLoggedIn={isLoggedIn}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 7h18M3 12h18M3 17h18" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">No products found in this category.</p>
            <p className="text-gray-400 mt-2">Check back soon for new arrivals!</p>
            <button 
              onClick={() => navigate('/')} 
              className="mt-6 bg-pink-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-900 transition-all"
            >
              Browse All Cakes
            </button>
          </div>
        )}

        {/* Custom Order CTA - Only show for custom/customizable categories */}
        {(displayName?.toLowerCase().includes('custom') || displayName?.toLowerCase().includes('bespoke')) && (
          <div className="mt-16 bg-gradient-to-r from-pink-50 to-rose-50 rounded-3xl p-8 text-center">
            <h3 className="text-2xl font-['Outfit'] font-black text-gray-900 mb-4">Need Something Unique?</h3>
            <p className="text-gray-600 mb-6">Can't find what you're looking for? Let us create a custom cake just for you!</p>
            <button onClick={() => navigate('/contact')} className="bg-pink-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-900 transition-all">
              Request Custom Cake →
            </button>
          </div>
        )}

       
      </div>
    </div>
  );
};

export default CategoryPage;