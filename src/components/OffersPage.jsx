// src/components/OffersPage.jsx - Updated to show product offers
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProductsWithOffers, incrementOfferClick } from '../firebase';

const OffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductOffers();
  }, []);

  const fetchProductOffers = async () => {
    setLoading(true);
    const productsWithOffers = await getProductsWithOffers();
    setOffers(productsWithOffers);
    setLoading(false);
  };

  const handleOfferClick = async (product) => {
    // Track click if you want
    // await incrementOfferClick(product.id);
    navigate(`/product/${product.id}`);
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-pink-50 to-white">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-pink-500 border-t-transparent"></div>
        </div>
      </section>
    );
  }

  if (offers.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-br from-pink-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 bg-pink-100 px-4 py-2 rounded-full mb-3">
            <span className="text-pink-600 font-black uppercase tracking-wider text-xs">Hot Deals</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tighter">
            Special Offers
          </h2>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto text-sm">
            Grab these amazing discounts before they're gone!
          </p>
        </div>

        {/* Offers Grid - Product Cards with Offers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((product) => (
            <div 
              key={product.id} 
              onClick={() => handleOfferClick(product)}
              className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-1 cursor-pointer"
            >
              {/* Offer Badge */}
              <div className="absolute top-3 left-3 z-10">
                <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                   {product.offerDiscount}
                </div>
              </div>
              
              {/* Valid Till Badge */}
              {product.offerValidTill && (
                <div className="absolute top-3 right-3 z-10">
                  <div className="bg-white/90 backdrop-blur-sm text-gray-600 text-[10px] font-medium px-2 py-1 rounded-full">
                    Valid till: {new Date(product.offerValidTill).toLocaleDateString()}
                  </div>
                </div>
              )}
              
              {/* Product Image */}
              <div className="h-48 overflow-hidden bg-gray-100">
                <img 
                  src={product.image || '/placeholder.png'} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.target.src = '/placeholder.png'; }}
                />
              </div>
              
              <div className="p-5">
                <h3 className="text-lg font-['Outfit'] font-black text-gray-900 mb-1 line-clamp-1">
                  {product.name}
                </h3>
                
                {/* Price with Offer */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-bold text-pink-600">
                    ₹{product.offerPrice?.toFixed(0) || product.price}
                  </span>
                  {product.offerPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      ₹{product.price}
                    </span>
                  )}
                </div>
                
                {/* Offer Description */}
                {product.offerDescription && (
                  <p className="text-xs text-green-600 font-medium mb-2">
                    🎉 {product.offerDescription}
                  </p>
                )}
                
                <p className="text-gray-500 text-xs mb-3 line-clamp-2">
                  {product.description}
                </p>
                
                {/* Shop Now Button */}
                <button 
                  className="w-full bg-gradient-to-r from-pink-600 to-rose-500 text-white py-2 rounded-lg font-bold text-sm hover:shadow-lg transition-all mt-2"
                >
                  Shop Now →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OffersPage;