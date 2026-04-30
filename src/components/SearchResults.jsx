import ProductCard from './ProductCard';

const SearchResults = ({ results, query, onProductClick, onAddToCart, onClose }) => {
    return (
        <div className="min-h-screen bg-white pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                {/* Header */}
                <div className="mb-12">
                    <button
                        onClick={onClose}
                        className="flex items-center space-x-2 text-gray-500 hover:text-pink-600 transition-colors mb-6 group"
                    >
                        <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="font-black uppercase tracking-widest text-xs">Back to Home</span>
                    </button>

                    <h1 className="text-3xl md:text-4xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tighter">
                        Search Results
                    </h1>
                    {query && (
                        <p className="text-gray-500 mt-2">
                            Found {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
                        </p>
                    )}
                </div>

                {/* Results Grid */}
                {results.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {results.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onClick={onProductClick}
                                onAddToCart={onAddToCart}
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
                        <h3 className="text-2xl font-['Outfit'] font-black text-gray-900 mb-2">No Results Found</h3>
                        <p className="text-gray-500 mb-8">
                            We couldn't find any products matching "{query}"
                        </p>
                        <button
                            onClick={onClose}
                            className="bg-pink-600 text-white px-8 py-3 rounded-full font-black uppercase tracking-widest text-xs hover:bg-gray-900 transition-all"
                        >
                            Browse All Cakes
                        </button>
                    </div>
                )}

                {/* Search Tips */}
                {results.length > 0 && (
                    <div className="mt-16 p-6 bg-gray-50 rounded-2xl text-center">
                        <p className="text-gray-500 text-sm">
                            💡 Can't find what you're looking for? <button className="text-pink-600 font-bold hover:underline">Request a custom cake</button>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchResults;