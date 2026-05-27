// src/components/FeaturedProducts.jsx - Redesigned with premium titles and buttons
import { useState, useEffect } from 'react';
import { getFeaturedProducts } from '../firebase';
import ProductCard from './ProductCard';
import { useNavigate } from 'react-router-dom';

const FeaturedProducts = ({ onProductClick, onAddToCart, onAddToWishlist, wishlist = [], cart = [], isLoggedIn = false }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-rose-gold border-t-transparent"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white relative">
      {/* Decorative ambient color blobs */}
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-rose-gold/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-rose-gold font-['Outfit'] font-black uppercase tracking-[0.2em] text-[10px] mb-4 flex items-center">
              <span className="w-12 h-px bg-rose-gold mr-4"></span>
              Signature Collection
            </h2>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-['Outfit'] font-black text-obsidian-dark leading-tight uppercase tracking-tight">
              Crafted With <span className="text-gradient-rose-gold">Passion</span>, <br />
              Delivered With Love
            </h3>
          </div>
          
          <button
            onClick={() => navigate('/all-products')}
            className="self-start md:self-auto group relative px-6 py-3 rounded-2xl border border-obsidian-dark hover:border-rose-gold text-obsidian-dark hover:text-rose-gold font-bold uppercase tracking-widest text-[9px] transition-all duration-300 transform active:scale-95 cursor-pointer"
          >
            View All Products
          </button>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
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
          <div className="text-center py-16 bg-cream-base rounded-[2rem] border border-gray-100">
            <p className="text-gray-500 font-medium text-sm">No featured products available at the moment</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;