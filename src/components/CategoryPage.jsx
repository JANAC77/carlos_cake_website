// components/CategoryPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProducts, getCategories } from '../firebase';
import ProductCard from './ProductCard';
import { useSEO } from '../hooks/useSEO';
import { CategorySEOData } from './CategorySEOData';
import FAQAccordion from './FAQAccordion';

const CategoryPage = ({ categoryNameOverride, onProductClick, onAddToCart, onAddToWishlist, wishlist, cart, isLoggedIn }) => {
  const { categoryName: paramCategoryName } = useParams();
  const categoryName = categoryNameOverride || paramCategoryName;
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Normalize category name for SEO matching
  const seoKey = categoryName?.toLowerCase()
    .replace(/\s+/g, '-')
    // Strip trailing or helper parts of custom routes to find the base key
    .replace('-selection-carlos-cake-quick-delivery', '')
    .replace('-carlos-cake-fast-online-delivery', '')
    .replace('orderchocolate-cakes-online-bangalore-', '')
    .replace('design-cakes', 'designer-cakes')
    .replace('choclate-cakes', 'chocolate-cakes'); // handle spelling variants

  const seoInfo = CategorySEOData[seoKey];

  useEffect(() => {
    if (categoryName) {
      fetchCategoryAndProducts();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [categoryName]);

  const fetchCategoryAndProducts = async () => {
    setLoading(true);
    
    // Normalize URL category name parameter
    const cleanKey = categoryName?.toLowerCase()
      .replace(/\s+/g, '-')
      .replace('-selection-carlos-cake-quick-delivery', '')
      .replace('-carlos-cake-fast-online-delivery', '')
      .replace('orderchocolate-cakes-online-bangalore-', '')
      .replace('design-cakes', 'designer-cakes')
      .replace('choclate-cakes', 'chocolate-cakes');

    // Get all categories to find matching one
    const allCategories = await getCategories();
    
    // Find category by matching name (case insensitive with spelling variations)
    const matchedCategory = allCategories.find(cat => {
      const catName = cat.name?.toLowerCase().replace(/\s+/g, '-');
      if (!catName) return false;
      
      if (catName === cleanKey) return true;
      if (cleanKey === 'chocolate-cakes' && (catName === 'choclate-cakes' || catName === 'chocolate-cakes')) return true;
      if (cleanKey === 'designer-cakes' && (catName === 'design-cakes' || catName === 'designer-cakes')) return true;
      
      return catName.includes(cleanKey) || cleanKey.includes(catName);
    });
    
    setCategory(matchedCategory);
    
    const allProducts = await getProducts();
    let categoryProducts = [];

    if (matchedCategory) {
      // Get products for this category using ID or spelling variants
      categoryProducts = allProducts.filter(product => {
        if (product.categoryId === matchedCategory.id) return true;
        
        const prodCatName = (product.categoryName || product.category || '').toLowerCase();
        
        if (cleanKey === 'chocolate-cakes' && (prodCatName.includes('choclate') || prodCatName.includes('chocolate'))) return true;
        if (cleanKey === 'designer-cakes' && (prodCatName.includes('design') || prodCatName.includes('designer'))) return true;
        if (cleanKey === 'fresh-cream-cakes' && prodCatName.includes('fresh cream')) return true;

        return prodCatName.includes(matchedCategory.name?.toLowerCase()) || 
               matchedCategory.name?.toLowerCase().includes(prodCatName);
      });
    } else {
      // Fallback: try to filter by cleanKey spelling variations directly
      categoryProducts = allProducts.filter(product => {
        const prodCatName = (product.categoryName || product.category || '').toLowerCase();
        const prodTags = (product.tags || []).map(t => t.toLowerCase());

        const hasMatch = (term) => prodCatName.includes(term) || prodTags.some(t => t.includes(term));

        if (cleanKey === 'chocolate-cakes') return hasMatch('choclate') || hasMatch('chocolate');
        if (cleanKey === 'designer-cakes') return hasMatch('design') || hasMatch('designer');
        if (cleanKey === 'fresh-cream-cakes') return hasMatch('fresh cream') || hasMatch('fresh-cream');

        return false;
      });
    }
    
    setProducts(categoryProducts);
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

  const displayName = category?.name || (
    categoryNameOverride 
      ? categoryNameOverride.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      : decodeURIComponent(categoryName).replace(/-/g, ' ')
  );
  
  const description = getCategoryDescription(displayName);

  // Dynamically set metadata using useSEO hook
  useSEO({
    title: seoInfo ? seoInfo.seoTitle : `${displayName} | Carlos Cake`,
    description: seoInfo ? seoInfo.seoDescription : `Order delicious ${displayName} cakes online from Carlos Cake Bakery. Fast home delivery across Bangalore today.`
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

        {/* Rich SEO Copywriting Footer Section */}
        {seoInfo && (
          <div className="mt-24 pt-16 border-t border-gray-100 max-w-4xl mx-auto space-y-16">
            
            {/* About Category */}
            <div>
              <h2 className="text-2xl md:text-3xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tight mb-6">
                {seoInfo.aboutHeader}
              </h2>
              <div className="space-y-4 text-gray-600 text-sm md:text-base leading-relaxed font-semibold">
                {seoInfo.aboutText.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </div>

            {/* Flavours Section */}
            <div>
              <h2 className="text-2xl md:text-3xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tight mb-8">
                {seoInfo.flavoursHeader}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {seoInfo.flavours.map((flavour, idx) => (
                  <div key={idx} className="bg-white border border-gray-100 p-6 md:p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-pink-200 transition-all duration-300 group">
                    <h3 className="text-lg font-['Outfit'] font-black text-gray-900 uppercase tracking-wider mb-3 group-hover:text-pink-600 transition-colors">
                      {flavour.name}
                    </h3>
                    <p className="text-gray-500 text-xs md:text-sm font-medium leading-relaxed mb-6">
                      {flavour.desc}
                    </p>
                    <div className="space-y-2">
                      <h4 className="text-xs font-black uppercase text-gray-700 tracking-wider">Highlights:</h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-500 font-semibold">
                        {flavour.highlights.map((h, hIdx) => (
                          <li key={hIdx} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Why Choose Us */}
            <div className="bg-pink-50/30 rounded-[2.5rem] p-8 md:p-12 border border-pink-100/50">
              <h2 className="text-2xl md:text-3xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tight mb-8">
                {seoInfo.whyChooseHeader}
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {seoInfo.whyChoose.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3.5 text-xs md:text-sm text-gray-700 font-bold leading-normal">
                    <span className="w-5 h-5 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* FAQs Section */}
            <div>
              <h2 className="text-2xl md:text-3xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tight text-center mb-8">
                Frequently Asked Questions
              </h2>
              <FAQAccordion faqs={seoInfo.faqs} />
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-rose-gold to-[#E11D48] text-white p-8 md:p-16 rounded-[2.5rem] text-center shadow-xl relative overflow-hidden group border border-white/5">
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
              <h3 className="text-2xl md:text-4xl font-['Outfit'] font-black uppercase tracking-tight mb-4">
                {seoInfo.ctaHeader}
              </h3>
              <p className="text-white/90 text-sm md:text-base font-semibold mb-8 max-w-xl mx-auto">
                {seoInfo.ctaSub}
              </p>
              <button 
                onClick={() => navigate('/')} 
                className="bg-white text-pink-600 px-10 py-3.5 rounded-full font-black uppercase tracking-widest text-xs shadow-md hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer btn-premium"
              >
                {seoInfo.ctaButton}
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;