import { useState, useEffect } from 'react';
import { getCategories, getSubCategories } from '../firebase';

const Menu = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenuData();
  }, []);

  const fetchMenuData = async () => {
    const cats = await getCategories();

    // Get subcategories for each category
    const categoriesWithSubs = await Promise.all(
      cats.map(async (category) => {
        const subs = await getSubCategories(category.id);
        return { ...category, subCategories: subs };
      })
    );

    setCategories(categoriesWithSubs);
    setLoading(false);
  };

  if (loading) {
    return (
      <section className="py-24 bg-white min-h-screen pt-32">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-white min-h-screen pt-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-20">
          <h2 className="text-pink-600 font-['Outfit'] font-black uppercase tracking-[0.2em] text-sm mb-4">The Collection</h2>
          <h3 className="text-4xl md:text-6xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tighter">Our Sweet Menu</h3>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">Freshly baked with love and premium ingredients</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {categories.map((category) => (
            <div key={category.id}>
              <h4 className="text-2xl font-['Outfit'] font-black text-pink-600 mb-8 uppercase border-b-2 border-pink-100 pb-4">
                {category.name}
              </h4>
              {category.subCategories && category.subCategories.length > 0 ? (
                category.subCategories.map((sub) => (
                  <div key={sub.id} className="mb-8">
                    <h5 className="text-lg font-bold text-gray-800 mb-3">{sub.name}</h5>
                    <p className="text-gray-500 text-sm mb-2">{sub.description}</p>
                    {sub.price && (
                      <span className="text-pink-600 font-bold">{sub.price}</span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Coming soon...</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-24 p-12 bg-pink-50 rounded-[3rem] text-center">
          <h4 className="text-2xl font-['Outfit'] font-black text-gray-900 mb-4 uppercase">Looking for something unique?</h4>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">We specialize in custom creations for weddings, birthdays, and special events.</p>
          <button className="bg-pink-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-gray-900 transition-all shadow-lg shadow-pink-200">
            Request Custom Quote
          </button>
        </div>
      </div>
    </section>
  );
};

export default Menu;