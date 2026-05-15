// src/components/OccasionBasedFilter.jsx
import { useState, useEffect } from 'react';
import { getProductsByOccasion } from '../firebase';
import ProductCard from './ProductCard';

const occasions = [
  { id: 'birthday', name: 'Birthday', icon: '🎂', color: 'bg-pink-100', textColor: 'text-pink-600' },
  { id: 'anniversary', name: 'Anniversary', icon: '💑', color: 'bg-red-100', textColor: 'text-red-600' },
  { id: 'wedding', name: 'Wedding', icon: '💒', color: 'bg-purple-100', textColor: 'text-purple-600' },
  { id: 'engagement', name: 'Engagement', icon: '💍', color: 'bg-blue-100', textColor: 'text-blue-600' },
  { id: 'baby-shower', name: 'Baby Shower', icon: '👶', color: 'bg-green-100', textColor: 'text-green-600' },
  { id: 'graduation', name: 'Graduation', icon: '🎓', color: 'bg-orange-100', textColor: 'text-orange-600' }
];

const OccasionBasedFilter = ({ onProductClick, onAddToCart, onAddToWishlist, wishlist, cart, isLoggedIn }) => {
  const [selectedOccasion, setSelectedOccasion] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedOccasion) {
      fetchProductsByOccasion();
    }
  }, [selectedOccasion]);

  const fetchProductsByOccasion = async () => {
    setLoading(true);
    const data = await getProductsByOccasion(selectedOccasion);
    setProducts(data);
    setLoading(false);
  };

  const getOccasionMessage = (occasion) => {
    const messages = {
      birthday: '🎂 Make their birthday extra special!',
      anniversary: '💑 Celebrate love with sweetness!',
      wedding: '💒 Make your big day unforgettable!',
      engagement: '💍 Say yes with a delicious cake!',
      'baby-shower': '👶 Welcome the little one!',
      graduation: '🎓 Celebrate achievements!'
    };
    return messages[occasion] || 'Perfect for your celebration!';
  };

  return (
    <div className="py-8">
      {/* Occasion Selection */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tighter mb-2">
          Choose Your Occasion
        </h2>
        <p className="text-gray-500">Find the perfect cake for your celebration</p>
      </div>

      {/* Occasion Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
        {occasions.map((occasion) => (
          <button
            key={occasion.id}
            onClick={() => setSelectedOccasion(occasion.id)}
            className={`p-4 rounded-2xl text-center transition-all transform hover:scale-105 ${
              selectedOccasion === occasion.id
                ? `${occasion.color} ring-2 ring-pink-500 shadow-lg`
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <div className="text-3xl mb-2">{occasion.icon}</div>
            <h3 className={`font-bold text-sm ${selectedOccasion === occasion.id ? occasion.textColor : 'text-gray-700'}`}>
              {occasion.name}
            </h3>
          </button>
        ))}
      </div>

      {/* Products Display */}
      {selectedOccasion && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {occasions.find(o => o.id === selectedOccasion)?.name} Cakes
              </h3>
              <p className="text-sm text-gray-500">{getOccasionMessage(selectedOccasion)}</p>
            </div>
            <button
              onClick={() => setSelectedOccasion(null)}
              className="text-pink-500 text-sm hover:underline"
            >
              Clear Filter
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-pink-500 border-t-transparent"></div>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => onProductClick(product)}
                  onAddToCart={onAddToCart}
                  onAddToWishlist={onAddToWishlist}
                  wishlist={wishlist}
                  cart={cart}
                  isLoggedIn={isLoggedIn}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <div className="text-6xl mb-4">🍰</div>
              <p className="text-gray-500">No products found for this occasion yet.</p>
              <button
                onClick={() => window.location.href = '/contact'}
                className="mt-4 text-pink-500 hover:underline"
              >
                Request a custom cake →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OccasionBasedFilter;