// components/AllProductsPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../firebase';
import ProductCard from './ProductCard';

const AllProductsPage = ({ onProductClick, onAddToCart, onAddToWishlist, wishlist, cart, isLoggedIn }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    setLoading(true);
    const allProducts = await getProducts();
    setProducts(allProducts);
    
    // Extract unique categories
    const uniqueCategories = ['all', ...new Set(allProducts.map(p => p.category || p.categoryName).filter(Boolean))];
    setCategories(uniqueCategories);
    setLoading(false);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === '' || 
                          product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                            (product.category === selectedCategory) || 
                            (product.categoryName === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-24 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-500 hover:text-pink-600 transition-colors mb-8 group"
        >
          <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-black uppercase tracking-widest text-xs">Back to Home</span>
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tighter">
            All Products
          </h1>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            Discover our complete collection of delicious cakes and treats
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search cakes..."
              className="w-full px-4 py-3 pl-11 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 transition-all"
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        {categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize ${
                  selectedCategory === category
                    ? 'bg-pink-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'All' : category}
              </button>
            ))}
          </div>
        )}

        {/* Products Count */}
        <p className="text-gray-500 text-sm mb-6 text-center">
          Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
        </p>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-['Outfit'] font-black text-gray-900 mb-2">No Products Found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filter</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="bg-pink-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-900 transition-all"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProductsPage;