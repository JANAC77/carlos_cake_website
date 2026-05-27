// src/components/CategorySection.jsx - Redesigned with gradient ring bubbles
import { useState, useEffect } from 'react';
import { getCategories } from '../firebase';
import { Link } from 'react-router-dom';

const CategorySection = () => {
  const [categories, setCategories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const data = await getCategories();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    if (categories.length === 0) return;

    const timer = setInterval(() => {
      setIsTransitionEnabled(true);
      setCurrentIndex((prev) => prev + 1);
    }, 3500);

    return () => clearInterval(timer);
  }, [categories.length]);

  useEffect(() => {
    if (currentIndex >= categories.length * 2) {
      const timeout = setTimeout(() => {
        setIsTransitionEnabled(false);
        setCurrentIndex(currentIndex % categories.length);
      }, 700);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, categories.length]);

  if (loading) {
    return (
      <section className="py-16 bg-cream-base overflow-hidden">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-rose-gold border-t-transparent"></div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  const displayCategories = [...categories, ...categories, ...categories];

  const getItemWidth = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 100 / 6;
      if (window.innerWidth >= 768) return 100 / 4;
      return 100 / 2;
    }
    return 100 / 6;
  };

  const getCategoryPath = (categoryName) => {
    const name = categoryName.toLowerCase();
    if (name.includes('birthday')) return '/category/birthday-cakes';
    if (name.includes('wedding')) return '/category/wedding-cakes';
    if (name.includes('custom')) return '/category/custom-cakes';
    if (name.includes('cupcake')) return '/category/cupcakes';
    if (name.includes('chocolate')) return '/category/chocolate-cakes';
    if (name.includes('fruit')) return '/category/fruit-cakes';
    return `/category/${name.replace(/\s+/g, '-')}`;
  };

  return (
    <section className="py-16 bg-cream-base overflow-hidden relative">
      {/* Decorative ambient color blobs */}
      <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-rose-gold/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="w-6 h-px bg-rose-gold"></span>
          <p className="text-rose-gold font-['Outfit'] font-black uppercase tracking-[0.25em] text-[10px]">Categories</p>
          <span className="w-6 h-px bg-rose-gold"></span>
        </div>
        <h3 className="text-3xl md:text-4xl font-['Outfit'] font-black text-obsidian-dark uppercase tracking-tight leading-none mb-3">
          Browse Our <span className="text-gradient-rose-gold font-black">Sweet Varieties</span>
        </h3>
        <p className="text-gray-500 font-medium text-xs tracking-wider max-w-md mx-auto">
          From decadent chocolates to light fruits, find the perfect slice for your celebration.
        </p>
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Soft edge fade overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-cream-base to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-cream-base to-transparent z-10 pointer-events-none"></div>

        <div className="overflow-hidden">
          <div
            className={`flex ${isTransitionEnabled ? 'transition-transform duration-700 ease-in-out' : ''}`}
            style={{ transform: `translateX(-${currentIndex * getItemWidth()}%)` }}
          >
            {displayCategories.map((cat, index) => (
              <Link
                key={`${cat.id}-${index}`}
                to={getCategoryPath(cat.name)}
                className="flex-shrink-0 w-1/2 md:w-1/4 lg:w-1/6 px-3 group cursor-pointer"
              >
                <div className="relative mb-4 flex justify-center">
                  {/* Category Circle with Dual Ring Gradient Borders */}
                  <div className="relative p-1 rounded-full bg-gradient-to-tr from-rose-gold/20 to-champagne-gold/20 group-hover:from-rose-gold group-hover:to-champagne-gold transition-all duration-500 shadow-md group-hover:shadow-xl group-hover:scale-105">
                    <div className="aspect-square w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden bg-white p-0.5">
                      <img
                        src={cat.image || '/custom_category.png'}
                        alt={cat.name}
                        className="w-full h-full rounded-full object-cover transform transition-transform duration-1000 group-hover:scale-110"
                      />
                    </div>
                  </div>
                </div>
                <h4 className="text-center text-xs md:text-sm font-['Outfit'] font-black text-gray-700 group-hover:text-rose-gold transition-colors uppercase tracking-wider mt-2">
                  {cat.name}
                </h4>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;