import { useState, useEffect, useRef } from 'react';
import { getCategories } from '../firebase';

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
    }, 3000);

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
      <section className="py-16 bg-white overflow-hidden">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-pink-500 border-t-transparent"></div>
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

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
        <p className="text-gray-500 font-['Outfit'] font-black uppercase tracking-[0.2em] text-[10px] mb-4">Categories</p>
        <p className="text-gray-400 font-medium text-xs md:text-sm tracking-widest uppercase">
          Irresistible delights to elevate any celebration.
        </p>
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-6">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

        <div className="overflow-hidden">
          <div
            className={`flex ${isTransitionEnabled ? 'transition-transform duration-700 ease-in-out' : ''}`}
            style={{ transform: `translateX(-${currentIndex * getItemWidth()}%)` }}
          >
            {displayCategories.map((cat, index) => (
              <div
                key={`${cat.id}-${index}`}
                className="flex-shrink-0 w-1/2 md:w-1/4 lg:w-1/6 px-4 group cursor-pointer"
              >
                <div className="relative mb-6">
                  <div className="aspect-square rounded-full overflow-hidden bg-gray-50 border-4 border-white shadow-md group-hover:shadow-xl group-hover:scale-105 transition-all duration-500">
                    <img
                      src={cat.image || '/custom_category.png'}
                      alt={cat.name}
                      className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-110"
                    />
                  </div>
                </div>
                <h4 className="text-center text-sm md:text-base font-['Outfit'] font-bold text-gray-800 group-hover:text-pink-600 transition-colors uppercase tracking-tight">
                  {cat.name}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;