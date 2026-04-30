// src/components/ProductCard.jsx
const ProductCard = ({ product, onClick, onAddToCart, onAddToWishlist, wishlist = [] }) => {
  const isInWishlist = wishlist?.some(item => item.id === product.id);

  return (
    <div className="group relative bg-white rounded-[2.5rem] p-4 transition-all duration-500 hover:shadow-[0_40px_80px_-15px_rgba(255,182,193,0.3)] border border-transparent hover:border-pink-50">
      <div onClick={() => onClick && onClick(product)} className="cursor-pointer">
        <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-pink-50">
          <img
            src={product.image || '/placeholder.png'}
            alt={product.name}
            className="h-full w-full object-cover transform transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="absolute top-4 left-4 flex space-x-2">
            {product.category && (
              <span className="bg-white/90 backdrop-blur-md text-pink-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                {product.category}
              </span>
            )}
          </div>

          {/* Wishlist Heart Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToWishlist && onAddToWishlist(product);
            }}
            className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
          >
            <svg className={`w-4 h-4 transition-colors ${isInWishlist ? 'fill-pink-600 text-pink-600' : 'text-gray-500 hover:text-pink-600'}`} fill={isInWishlist ? "#EC4899" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        <div className="mt-4 px-2 pb-2">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-lg font-['Outfit'] font-bold text-gray-900 group-hover:text-pink-600 transition-colors line-clamp-1">
              {product.name}
            </h3>
            <span className="text-lg font-black text-gray-900">₹{product.price}</span>
          </div>
          <p className="text-gray-500 text-xs line-clamp-2 mb-3">{product.description}</p>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onAddToCart && onAddToCart(product);
        }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-gray-900 px-6 py-2 rounded-xl font-bold text-sm shadow-xl transform translate-y-10 group-hover:translate-y-0 transition-all duration-500 hover:bg-pink-600 hover:text-white w-[90%]"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard; 