// src/components/BlogChocolateCake.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import FAQAccordion from './FAQAccordion';
import { Calendar, Clock, ArrowLeft, CheckCircle2, MessageCircle, ExternalLink, Sparkles, Check, X } from 'lucide-react';

const BlogChocolateCake = () => {
  const navigate = useNavigate();

  // Dynamic SEO Metadata
  useSEO({
    title: "Best Chocolate Cake Online in Bengaluru | Same-Day Delivery",
    description: "Order the best chocolate cake online in Bengaluru with same-day delivery. Fresh, rich, and delicious cakes for birthdays, parties, and celebrations!"
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleScrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const tableOfContents = [
    { id: 'intro', label: 'Best Chocolate Cake in Bengaluru' },
    { id: 'popularity', label: 'Why Chocolate Cakes are Popular' },
    { id: 'factors', label: 'Key Factors for Cake Shops' },
    { id: 'comparison', label: 'Cake Shop Comparison Table' },
    { id: 'varieties', label: 'Popular Chocolate Cake Varieties' },
    { id: 'why-us', label: 'Why Choose Carlos Cake Cafe' },
    { id: 'faqs', label: 'Frequently Asked Questions' }
  ];

  const comparisonData = [
    {
      feature: "Same-Day Delivery",
      carlos: { text: "Yes", status: "yes" },
      iyengar: { text: "Limited Locations", status: "warn" },
      liliyum: { text: "Limited Availability", status: "warn" }
    },
    {
      feature: "Custom Cakes",
      carlos: { text: "Extensive Options", status: "yes" },
      iyengar: { text: "Basic Customization", status: "warn" },
      liliyum: { text: "Premium Customization", status: "yes" }
    },
    {
      feature: "Chocolate Cake Variety",
      carlos: { text: "Wide Range", status: "yes" },
      iyengar: { text: "Moderate", status: "info" },
      liliyum: { text: "Moderate", status: "info" }
    },
    {
      feature: "Online Ordering",
      carlos: { text: "Swiggy, WhatsApp, Zomato", status: "yes" },
      iyengar: { text: "Selected Platforms", status: "info" },
      liliyum: { text: "Selected Platforms", status: "info" }
    },
    {
      feature: "Celebration Cakes",
      carlos: { text: "Birthdays, Anniversaries, Corporate", status: "yes" },
      iyengar: { text: "Birthdays", status: "info" },
      liliyum: { text: "Premium Events", status: "yes" }
    }
  ];

  const faqs = [
    {
      question: "Do you offer same-day chocolate cake delivery in Bengaluru?",
      answer: "Yes, same-day delivery is available for many chocolate cake varieties, subject to location and order timing."
    },
    {
      question: "Can I order chocolate cakes through WhatsApp?",
      answer: "Yes, customers can place orders through WhatsApp (+91 81477 51838) for convenient and quick ordering."
    },
    {
      question: "Are tiered chocolate cakes available for special events?",
      answer: "Yes, customized tiered cakes are available for weddings, birthdays, corporate events, and other celebrations."
    },
    {
      question: "Do you provide delivery through Swiggy and Zomato?",
      answer: "Yes, customers can order cakes through Swiggy and Zomato depending on service availability in their area."
    },
    {
      question: "What chocolate cake flavors are popular?",
      answer: "Popular choices include Dutch Truffle, Classic Chocolate Cake, Butterscotch Chocolate Cake, and customized chocolate celebration cakes."
    },
    {
      question: "Can I customize a birthday chocolate cake?",
      answer: "Yes, customization options are available for cake designs, messages, themes, and sizes."
    }
  ];

  const getStatusColor = (status) => {
    if (status === 'yes') return 'bg-green-50 text-green-700 border border-green-200';
    if (status === 'warn') return 'bg-amber-50 text-amber-700 border border-amber-200';
    return 'bg-slate-50 text-slate-700 border border-slate-200';
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-500 hover:text-pink-600 transition-colors mb-6 group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          <span className="font-['Outfit'] font-black uppercase tracking-widest text-xs">Back</span>
        </button>

        {/* Hero Section */}
        <div className="relative rounded-[2.5rem] overflow-hidden mb-12 shadow-xl border border-gray-100">
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent z-10"></div>
          <img
            src="/best_chocolate_cake_blog.jpg"
            alt="Best Chocolate Cake Online in Bengaluru"
            className="w-full h-[320px] md:h-[450px] object-cover transform hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-20 text-white">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <span className="bg-rose-600/90 text-white text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-full">
                Gourmet Selection
              </span>
              <div className="flex items-center text-xs text-white/80 space-x-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> June 2026
                </span>
                <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> 6 Min Read
                </span>
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-['Outfit'] font-black uppercase tracking-tight max-w-4xl leading-tight">
              Best Chocolate Cake Online in Bengaluru with Same-Day Delivery
            </h1>
          </div>
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Introduction */}
            <section id="intro" className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 leading-relaxed text-gray-700">
              <h2 className="text-2xl md:text-3xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tight mb-6 flex items-center gap-2">
                <span className="w-1.5 h-8 bg-pink-500 rounded-full"></span>
                Indulge in Rich Chocolaty Goodness
              </h2>
              <p className="mb-4 font-medium text-base">
                Chocolate cakes remain one of the most loved desserts for birthdays, anniversaries, office celebrations, and special occasions. With the growing demand for convenient online ordering, many bakeries now offer fresh cakes delivered directly to your doorstep.
              </p>
              <p className="font-medium text-base">
                Whether you are planning a surprise celebration or a last-minute party, finding the right bakery can make a significant difference in taste, quality, and delivery experience. At Carlos Cake Cafe, we prepare each chocolate masterpiece with rich premium cocoa and fresh layers of frosting.
              </p>
            </section>

            {/* Why Online Chocolate Cake Delivery Is Popular */}
            <section id="popularity" className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
              <h3 className="text-xl md:text-2xl font-['Outfit'] font-black text-gray-900 uppercase tracking-wide">
                Why Online Chocolate Cake Delivery Is Popular in Bengaluru
              </h3>
              <div className="relative rounded-2xl overflow-hidden shadow-md border border-gray-100 max-w-3xl">
                <img
                  src="/why_online_delivery_popular_blog.jpg"
                  alt="Why Online Chocolate Cake Delivery Is Popular in Bengaluru"
                  className="w-full h-[200px] md:h-[350px] object-cover transform hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
              <p className="text-gray-600 leading-relaxed font-semibold text-sm">
                Customers today prefer online cake ordering because it saves time and offers a wide variety of flavors and customization options. Many bakeries provide same-day delivery through platforms like Swiggy, WhatsApp, and Zomato, making celebrations easier than ever.
              </p>
            </section>

            {/* Key Factors */}
            <section id="factors" className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xl md:text-2xl font-['Outfit'] font-black text-gray-900 uppercase tracking-wide mb-6">
                Key Factors Customers Look For in a Cake Shop
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Freshly baked daily sponge",
                  "Same-day delivery options across locations",
                  "Custom cake designs & themes",
                  "Premium gourmet ingredients",
                  "Easy online ordering interfaces",
                  "Affordable and value-based pricing"
                ].map((factor, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 font-semibold text-xs text-gray-700">
                    <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </span>
                    <span>{factor}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Comparison Table */}
            <section id="comparison" className="space-y-6">
              <div className="flex items-center gap-2 mb-2 px-2">
                <span className="w-1.5 h-8 bg-pink-500 rounded-full"></span>
                <h3 className="text-xl md:text-2xl font-['Outfit'] font-black text-gray-900 uppercase tracking-wide">
                  Comparing Popular Cake Shops in Bengaluru
                </h3>
              </div>
              
              <div className="overflow-x-auto rounded-3xl border border-gray-200/60 shadow-sm bg-white">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-slate-900 text-white border-b border-gray-800">
                      <th className="p-5 font-['Outfit'] font-black uppercase tracking-wider text-xs">Feature</th>
                      <th className="p-5 font-['Outfit'] font-black uppercase tracking-wider text-xs text-pink-400">Carlos Cake Cafe</th>
                      <th className="p-5 font-['Outfit'] font-black uppercase tracking-wider text-xs text-slate-300">Iyengar's Oven Fresh</th>
                      <th className="p-5 font-['Outfit'] font-black uppercase tracking-wider text-xs text-slate-300">Liliyum Patisserie</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {comparisonData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-5 font-bold text-xs text-gray-800 uppercase tracking-wide">{row.feature}</td>
                        <td className="p-5">
                          <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(row.carlos.status)}`}>
                            {row.carlos.text}
                          </span>
                        </td>
                        <td className="p-5">
                          <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(row.iyengar.status)}`}>
                            {row.iyengar.text}
                          </span>
                        </td>
                        <td className="p-5">
                          <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(row.liliyum.status)}`}>
                            {row.liliyum.text}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500 italic px-2 font-medium">
                *Comparison based on customer reviews and published availability options in 2026.
              </p>
            </section>

            {/* Chocolate Varieties */}
            <div id="varieties" className="space-y-8">
              <div className="px-2">
                <h3 className="text-2xl md:text-3xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tight mb-2">
                  Popular Chocolate Cake Varieties
                </h3>
                <p className="text-gray-500 font-semibold text-xs md:text-sm">
                  We offer a wide assortment of freshly baked chocolate cakes crafted by professional pastry chefs.
                </p>
              </div>

              <div className="relative rounded-3xl overflow-hidden shadow-md border border-gray-100 max-w-3xl mx-2">
                <img
                  src="/best_chocolate_cake_blog.jpg"
                  alt="Best Chocolate Cake Online in Bengaluru with Same-Day Delivery"
                  className="w-full h-[200px] md:h-[350px] object-cover transform hover:scale-[1.02] transition-transform duration-500"
                />
              </div>

              {/* Varieties Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Dutch Truffle */}
                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 hover:border-pink-200 transition-all flex flex-col justify-between group">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-['Outfit'] font-black uppercase text-base text-gray-900 group-hover:text-pink-600 transition-colors tracking-wide">
                        Dutch Truffle Cakes
                      </h4>
                      <span className="text-[9px] font-black uppercase tracking-widest bg-pink-50 text-pink-700 px-2 py-0.5 rounded border border-pink-100">
                        Signature
                      </span>
                    </div>
                    <div className="relative rounded-2xl overflow-hidden mb-4 shadow-sm border border-gray-100">
                      <img
                        src="/dutch_truffle_cake_blog.jpg"
                        alt="Dutch Truffle Cakes with Premium Chocolate Taste"
                        className="w-full h-[180px] object-cover transform hover:scale-[1.02] transition-transform duration-500"
                      />
                    </div>
                    <p className="text-gray-500 text-xs font-semibold leading-relaxed mb-6">
                      Known for their rich chocolate layers and smooth, decadent truffle glaze. Carlos Cake Cafe focuses on premium cocoa ingredients and perfectly balanced sweetness for chocolate purists.
                    </p>
                  </div>
                  <button
                    onClick={() => window.open('https://wa.me/918147751838?text=Hi! I would like to order a Dutch Truffle Cake.', '_blank')}
                    className="w-full bg-slate-900 hover:bg-pink-600 text-white py-2.5 rounded-xl font-bold uppercase tracking-wider text-[10px] transition-colors cursor-pointer"
                  >
                    Order Dutch Truffle
                  </button>
                </div>

                {/* Butterscotch Chocolate */}
                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 hover:border-pink-200 transition-all flex flex-col justify-between group">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-['Outfit'] font-black uppercase text-base text-gray-900 group-hover:text-pink-600 transition-colors tracking-wide">
                        Butterscotch Chocolate
                      </h4>
                      <span className="text-[9px] font-black uppercase tracking-widest bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-100">
                        Crunchy Swirl
                      </span>
                    </div>
                    <div className="relative rounded-2xl overflow-hidden mb-4 shadow-sm border border-gray-100">
                      <img
                        src="/butterscotch_chocolate_cake_blog.jpg"
                        alt="Rich Butterscotch Chocolate Cake Combinations"
                        className="w-full h-[180px] object-cover transform hover:scale-[1.02] transition-transform duration-500"
                      />
                    </div>
                    <p className="text-gray-500 text-xs font-semibold leading-relaxed mb-6">
                      A delightful balance of rich cocoa flavors and crunch caramel butterscotch pieces. Freshly baked combinations that bring out the best of caramel sweetness and cocoa richness.
                    </p>
                  </div>
                  <button
                    onClick={() => window.open('https://wa.me/918147751838?text=Hi! I would like to order a Butterscotch Chocolate combination cake.', '_blank')}
                    className="w-full bg-slate-900 hover:bg-pink-600 text-white py-2.5 rounded-xl font-bold uppercase tracking-wider text-[10px] transition-colors cursor-pointer"
                  >
                    Order Butterscotch Choc
                  </button>
                </div>

                {/* Elegant Tiered Cakes */}
                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 hover:border-pink-200 transition-all flex flex-col justify-between group">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-['Outfit'] font-black uppercase text-base text-gray-900 group-hover:text-pink-600 transition-colors tracking-wide">
                        Elegant Tiered Cakes
                      </h4>
                      <span className="text-[9px] font-black uppercase tracking-widest bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-100">
                        Grand Occasions
                      </span>
                    </div>
                    <div className="relative rounded-2xl overflow-hidden mb-4 shadow-sm border border-gray-100">
                      <img
                        src="/elegant_tiered_cake_blog.jpg"
                        alt="Elegant Tiered Cakes for Grand Celebrations"
                        className="w-full h-[180px] object-cover transform hover:scale-[1.02] transition-transform duration-500"
                      />
                    </div>
                    <p className="text-gray-500 text-xs font-semibold leading-relaxed mb-6">
                      Perfect for weddings, anniversaries, and grand birthday events. Custom design support is available to personalize layers, sizes, themes, and chocolate styles according to requirements.
                    </p>
                  </div>
                  <button
                    onClick={() => window.open('https://wa.me/918147751838?text=Hi! I am interested in ordering a customized Tiered Chocolate Cake.', '_blank')}
                    className="w-full bg-slate-900 hover:bg-pink-600 text-white py-2.5 rounded-xl font-bold uppercase tracking-wider text-[10px] transition-colors cursor-pointer"
                  >
                    Customize Tiered Cake
                  </button>
                </div>

                {/* Classic Chocolate Cakes */}
                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 hover:border-pink-200 transition-all flex flex-col justify-between group">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-['Outfit'] font-black uppercase text-base text-gray-900 group-hover:text-pink-600 transition-colors tracking-wide">
                        Classic Chocolate Cakes
                      </h4>
                      <span className="text-[9px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100">
                        All-Time Fav
                      </span>
                    </div>
                    <div className="relative rounded-2xl overflow-hidden mb-4 shadow-sm border border-gray-100">
                      <img
                        src="/classic_chocolate_cake_blog.jpg"
                        alt="Classic Chocolate Cakes for Every Occasion"
                        className="w-full h-[180px] object-cover transform hover:scale-[1.02] transition-transform duration-500"
                      />
                    </div>
                    <p className="text-gray-500 text-xs font-semibold leading-relaxed mb-6">
                      Simple, soft, and moist chocolate sponge with a delicious fudge filling. A year-round crowd-pleaser for school events, office farewell parties, and casual weekend treats.
                    </p>
                  </div>
                  <button
                    onClick={() => window.open('https://wa.me/918147751838?text=Hi! I would like to order a Classic Chocolate Cake.', '_blank')}
                    className="w-full bg-slate-900 hover:bg-pink-600 text-white py-2.5 rounded-xl font-bold uppercase tracking-wider text-[10px] transition-colors cursor-pointer"
                  >
                    Order Classic Chocolate
                  </button>
                </div>

              </div>
            </div>

            {/* Why Customers Choose Us */}
            <section id="why-us" className="bg-gradient-to-br from-pink-50/50 to-rose-50/30 p-8 md:p-12 rounded-[2.5rem] border border-pink-100/50">
              <h2 className="text-2xl md:text-3xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tight mb-8">
                Why Many Customers Choose Carlos Cake Cafe
              </h2>
              <div className="relative rounded-2xl overflow-hidden mb-8 shadow-md border border-gray-100 max-w-3xl">
                <img
                  src="/why_choose_carlos_cake_blog.jpg"
                  alt="Why Many Customers Choose Carlos Cake Cafe"
                  className="w-full h-[200px] md:h-[350px] object-cover transform hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  "Freshly baked cakes prepared daily from premium cocoa",
                  "Reliable same-day delivery across Bengaluru locations",
                  "Extensive choice of chocolate cake variations",
                  "Customized birthday & anniversary layouts",
                  "Direct online ordering via Swiggy, WhatsApp, and Zomato",
                  "Attractive presentations that add visual value to events",
                  "Hygienic prep methods and safe transit box packaging"
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm font-semibold text-gray-700 leading-normal">
                    <CheckCircle2 className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQs */}
            <section id="faqs" className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tight text-center">
                Frequently Asked Questions (FAQs)
              </h2>
              <FAQAccordion faqs={faqs} />
            </section>

            {/* Order Today Block */}
            <div className="bg-[#1A1616] text-white p-8 md:p-16 rounded-[2.5rem] text-center shadow-xl border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-80 h-80 bg-rose-gold/5 rounded-full blur-[100px] pointer-events-none"></div>
              <div className="relative z-10 max-w-xl mx-auto">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-rose-gold mb-4">
                  <Sparkles className="w-3.5 h-3.5" /> Gourmet Chocolate Experience
                </span>
                <h3 className="text-2xl md:text-4xl font-['Outfit'] font-black uppercase tracking-tight mb-4">
                  Order Your Favorite Chocolate Cake Today
                </h3>
                <p className="text-gray-300 text-sm font-semibold mb-8">
                  Experience fresh rich flavors, premium ingredients, beautiful designs, and reliable same-day delivery in Bengaluru.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() => navigate('/all-products')}
                    className="bg-gradient-to-r from-rose-gold to-[#E11D48] text-white px-8 py-3.5 rounded-full font-black uppercase tracking-widest text-xs shadow-md hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer"
                  >
                    Explore Cake Menu
                  </button>
                  <a
                    href="https://wa.me/918147751838?text=Hi! I would like to order a chocolate cake today."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-3.5 rounded-full font-black uppercase tracking-widest text-xs shadow-md transition-all duration-300 flex items-center gap-2 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-green-400" /> WhatsApp Quick Order
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Table of Contents */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-28">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 px-2">
                Table of Contents
              </h3>
              <nav className="space-y-1">
                {tableOfContents.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleScrollToSection(item.id)}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-gray-600 hover:text-pink-600 hover:bg-pink-50/50 rounded-xl transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <span>{item.label}</span>
                    <span className="text-[10px] text-gray-300 group-hover:text-pink-400 transition-colors">→</span>
                  </button>
                ))}
              </nav>

              <hr className="my-6 border-gray-100" />

              {/* Delivery info widget */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-2xl border border-amber-100/50 text-center">
                <h4 className="font-['Outfit'] font-black uppercase text-xs text-amber-800 mb-2">⚡ Same-Day Delivery</h4>
                <p className="text-gray-500 text-[11px] font-semibold mb-4 leading-normal">
                  Order by 6:00 PM for guaranteed same-day delivery across Bengaluru locations! Freshness and taste guaranteed.
                </p>
                <div className="flex gap-2">
                  <a
                    href="https://www.swiggy.com/city/bangalore/carlos-cake-cafe-bellandur-gate-sarjapur-road-rest58184"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-[#FC8019] hover:bg-[#e47213] text-white py-2 rounded-lg font-bold text-[10px] uppercase tracking-wider text-center"
                  >
                    Swiggy
                  </a>
                  <a
                    href="https://www.zomato.com/bangalore/carlos-cake-cafe-bellandur-bangalore"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-[#E23744] hover:bg-[#cb2f3a] text-white py-2 rounded-lg font-bold text-[10px] uppercase tracking-wider text-center"
                  >
                    Zomato
                  </a>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default BlogChocolateCake;
