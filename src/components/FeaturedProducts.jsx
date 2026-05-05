// src/components/FeaturedProducts.jsx
import { useState, useEffect } from 'react';
import { getFeaturedProducts } from '../firebase';
import ProductCard from './ProductCard';

const FeaturedProducts = ({ onProductClick, onAddToCart, onAddToWishlist, wishlist = [], cart = [], isLoggedIn = false }) => {  // Add cart prop
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    const data = await getFeaturedProducts();
    setProducts(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-pink-600 font-['Outfit'] font-black uppercase tracking-[0.2em] text-xs mb-4 flex items-center">
              <span className="w-12 h-px bg-pink-500 mr-4"></span>
              Signature Collection
            </h2>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-['Outfit'] font-black text-gray-900 leading-tight">
              Crafted With Passion, <br />
              Delivered With Love
            </h3>
          </div>
          <button
            onClick={() => onProductClick && onProductClick({ id: 'all' })}
            className="text-gray-900 font-black uppercase tracking-widest text-xs border-b-2 border-gray-900 pb-1 hover:text-pink-600 hover:border-pink-600 transition-all"
          >
            View All Products
          </button>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {products.map((product) => (
              <ProductCard
        key={product.id}
        product={product}
        onClick={onProductClick}
        onAddToCart={onAddToCart}
        onAddToWishlist={onAddToWishlist}
        wishlist={wishlist}
        cart={cart}
        isLoggedIn={isLoggedIn}  // Add this line
      />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No featured products available</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;