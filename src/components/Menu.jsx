// customer-website/src/components/Menu.jsx
import { useState, useEffect } from 'react';
import { getMenuCategories, getMenuItems } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Menu = () => {
    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMenuData();
    }, []);

    const fetchMenuData = async () => {
        setLoading(true);
        setError(null);
        try {
            const cats = await getMenuCategories();
            console.log("Categories fetched:", cats);

            const activeCats = cats.filter(c => c.status === 'active');
            setCategories(activeCats);

            const menuItems = await getMenuItems();
            console.log("Menu items fetched:", menuItems);
            setItems(menuItems);

            if (activeCats.length > 0) {
                setSelectedCategory(activeCats[0].id);
            }
        } catch (error) {
            console.error("Error fetching menu:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const getItemsByCategory = (categoryId) => {
        return items.filter(item => item.categoryId === categoryId && item.status === 'active');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white pt-32 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white pt-32 flex flex-col justify-center items-center">
                <div className="text-6xl mb-4">🍰</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Menu</h2>
                <p className="text-gray-500 mb-6 text-center max-w-md">
                    {error === 'permission-denied' ? 'Please check your internet connection and try again.' : 'Something went wrong. Please try again later.'}
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-pink-600 text-white px-6 py-3 rounded-full font-bold hover:bg-gray-900 transition"
                >
                    Refresh Page
                </button>
            </div>
        );
    }

    return (
        <section className="py-24 bg-white min-h-screen pt-32">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="text-center mb-12">
                    <h2 className="text-pink-600 font-['Outfit'] font-black uppercase tracking-[0.2em] text-sm mb-4">
                        Our Collection
                    </h2>
                    <h3 className="text-4xl md:text-6xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tighter">
                        Sweet Menu
                    </h3>
                    <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
                        Freshly baked with love and premium ingredients
                    </p>
                </div>

                {/* Category Tabs */}
                {categories.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-6 py-3 rounded-full font-bold transition-all ${selectedCategory === category.id
                                    ? 'bg-pink-600 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                )}

                {/* Menu Items - TABLE LAYOUT */}
                {categories.map((category) => {
                    const categoryItems = getItemsByCategory(category.id);
                    if (selectedCategory !== category.id) return null;

                    return (
                        <div key={category.id} className="animate-fadeIn">
                            {category.description && (
                                <p className="text-center text-gray-500 mb-8">{category.description}</p>
                            )}
                            {/* Table Layout */}
                            <div className="w-full overflow-x-auto bg-white rounded-2xl shadow-lg border border-gray-100">
                                <table className="w-full min-w-[750px] md:min-w-0">
                                    <thead className="bg-gradient-to-r from-pink-50/50 to-rose-50/50 border-b border-gray-100">
                                        <tr>
                                            <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">Item</th>
                                            <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">Description</th>
                                            <th className="text-center px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">Weight</th>
                                            <th className="text-center px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">Price</th>
                                            <th className="text-center px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">Eggless</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {categoryItems.map((item, index) => (
                                            <tr
                                                key={item.id}
                                                onClick={() => navigate(`/product/${item.id}`)}
                                                className={`hover:bg-pink-50/20 transition-all duration-200 cursor-pointer ${
                                                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/20'
                                                }`}
                                            >
                                                {/* Item Name with Image */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-pink-50 flex-shrink-0 border border-pink-100/30">
                                                            {item.image ? (
                                                                <img
                                                                    src={item.image}
                                                                    alt={item.name}
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e) => { e.target.src = '/placeholder.png'; }}
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-xl">
                                                                    🍰
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="min-w-[130px]">
                                                            <p className="font-extrabold text-gray-900 group-hover:text-pink-600 transition-colors">{item.name}</p>
                                                            {item.isPopular && (
                                                                <span className="inline-block mt-1 text-[10px] bg-yellow-50 text-yellow-600 border border-yellow-100 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                                                    ⭐ Popular
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Description */}
                                                <td className="px-6 py-4">
                                                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed min-w-[200px]">
                                                        {item.description || '-'}
                                                    </p>
                                                </td>

                                                {/* Weight */}
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-2 justify-center items-center">
                                                        {item.weightOptions && item.weightOptions.length > 0 ? (
                                                            item.weightOptions.map((opt, idx) => (
                                                                <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-50 text-gray-700 border border-gray-200/50 min-h-[1.75rem] shadow-sm whitespace-nowrap min-w-[80px] justify-center">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                                                                    {opt.label || `${opt.weight} kg`}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-50 text-gray-700 border border-gray-200/50 min-h-[1.75rem] shadow-sm whitespace-nowrap min-w-[80px] justify-center">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                                                                {item.weight || '1 kg'}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Price */}
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-2 items-center justify-center">
                                                        {item.weightOptions && item.weightOptions.length > 0 ? (
                                                            item.weightOptions.map((opt, idx) => (
                                                                <span key={idx} className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-black bg-pink-50 text-pink-600 border border-pink-100 min-h-[1.75rem] shadow-sm whitespace-nowrap min-w-[70px]">
                                                                    ₹{opt.price}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-black bg-pink-50 text-pink-600 border border-pink-100 min-h-[1.75rem] shadow-sm whitespace-nowrap min-w-[70px]">
                                                                ₹{item.price}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Eggless Available */}
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1.5 justify-center items-center">
                                                        {item.egglessOption ? (
                                                            <>
                                                                <span className="inline-flex items-center gap-1 bg-green-50 text-green-600 border border-green-100 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                                                    <span className="text-green-500 font-extrabold text-sm">✓</span> Available
                                                                </span>
                                                                <span className="inline-flex items-center gap-1 text-[9px] text-green-700 bg-green-50/80 border border-green-100 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider mt-1">
                                                                    🌱 +₹{item.egglessExtra} eggless
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span className="text-gray-400 text-xs">-</span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* No Items Message */}
                            {categoryItems.length === 0 && (
                                <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                                    <p className="text-gray-500">No items in this category yet.</p>
                                </div>
                            )}
                        </div>
                    );
                })}

                {categories.length === 0 && !error && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🍽️</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Menu Coming Soon!</h3>
                        <p className="text-gray-500">We're preparing something delicious for you.</p>
                    </div>
                )}
            </div>

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
        </section>
    );
};

export default Menu;