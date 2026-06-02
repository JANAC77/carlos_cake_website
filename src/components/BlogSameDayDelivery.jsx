// src/components/BlogSameDayDelivery.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import FAQAccordion from './FAQAccordion';
import { Calendar, Clock, ArrowLeft, CheckCircle2, MessageCircle, ExternalLink, Flame } from 'lucide-react';

const BlogSameDayDelivery = () => {
  const navigate = useNavigate();

  // Dynamic SEO Metadata
  useSEO({
    title: "Bangalore’s Best Same-Day Cake Delivery Online",
    description: "Order delicious cakes online in Bangalore with fast same-day delivery. Fresh flavors, custom designs, and doorstep delivery for every celebration"
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
    { id: 'intro', label: 'Best Same-Day Cake Delivery Online' },
    { id: 'vanilla', label: 'Fresh Vanilla Cakes for Every Celebration' },
    { id: 'marble', label: 'Marble Cakes with Rich Chocolate Swirls' },
    { id: 'red-velvet', label: 'Premium Red Velvet Cakes' },
    { id: 'vanilla-almond', label: 'Vanilla Almond Cakes with Nutty Taste' },
    { id: 'ordering', label: 'Easy Ordering via Swiggy, Zomato & WhatsApp' },
    { id: 'why-us', label: 'Why Customers Prefer Carlos Cake Cafe' },
    { id: 'faqs', label: 'Frequently Asked Questions' }
  ];

  const faqs = [
    {
      question: "Which is the best cake delivery service in Bangalore?",
      answer: "Many customers prefer Carlos Cake Cafe for fresh cakes, same-day delivery, premium flavors, and easy online ordering support through Swiggy, WhatsApp, and Zomato."
    },
    {
      question: "Do you provide same-day cake delivery services in Bangalore?",
      answer: "Yes, same-day cake delivery is available for multiple cake flavors and celebration requirements across Bangalore."
    },
    {
      question: "Can customers order cakes through WhatsApp?",
      answer: "Yes, customers can easily place cake orders through WhatsApp (+91 81477 51838) for quick support and fast delivery assistance."
    },
    {
      question: "Which cake flavours are most popular?",
      answer: "Vanilla, Marble, Red Velvet, and Vanilla Almond cakes are among the most preferred cake flavors for celebrations."
    },
    {
      question: "Why do customers choose Carlos Cake Cafe?",
      answer: "Customers prefer Carlos Cake Cafe for fresh cake quality, premium flavors, fast delivery service, hygienic preparation, and easy online ordering experience."
    }
  ];

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
            src="/same_day_delivery_blog.jpg"
            alt="Bangalore's Best Same-Day Cake Delivery"
            className="w-full h-[320px] md:h-[450px] object-cover transform hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-20 text-white">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <span className="bg-pink-600/90 text-white text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-full">
                Delivery Guide
              </span>
              <div className="flex items-center text-xs text-white/80 space-x-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> June 2026
                </span>
                <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> 5 Min Read
                </span>
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-['Outfit'] font-black uppercase tracking-tight max-w-4xl leading-tight">
              Bangalore’s Best Same-Day Cake Delivery Service Online
            </h1>
          </div>
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Intro */}
            <section id="intro" className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 leading-relaxed text-gray-700">
              <h2 className="text-2xl md:text-3xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tight mb-6 flex items-center gap-2">
                <span className="w-1.5 h-8 bg-pink-500 rounded-full"></span>
                Delivered Fresh, Right On Time
              </h2>
              <p className="mb-4 font-medium text-base">
                Special occasions become more memorable when delicious cakes arrive fresh and on time. Whether it is a birthday celebration, anniversary surprise, office party, or family gathering, online cake delivery services make everything simple and convenient.
              </p>
              <p className="font-medium text-base">
                Bangalore customers today prefer fast delivery, premium flavours, and hassle-free online ordering through trusted platforms like Swiggy, WhatsApp, and Zomato. We focus on maintaining soft cake texture, premium ingredients, and fast customer support for every single order.
              </p>
            </section>

            {/* Flavor Showcases */}
            <div className="space-y-8">
              <h2 className="text-3xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tight mb-2 px-2">
                Explore Popular Celebration Flavors
              </h2>

              {/* Vanilla Cakes */}
              <section id="vanilla" className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                  <h3 className="text-xl md:text-2xl font-['Outfit'] font-black text-gray-900 uppercase tracking-wider group-hover:text-pink-600 transition-colors">
                    1. Fresh Vanilla Cakes
                  </h3>
                  <span className="mt-2 md:mt-0 text-[10px] font-black uppercase tracking-widest bg-amber-50 text-amber-700 px-3 py-1 rounded-full border border-amber-100 self-start">
                    Classic Favorite
                  </span>
                </div>
                <div className="relative rounded-2xl overflow-hidden mb-6 shadow-md border border-gray-100 max-w-3xl">
                  <img
                    src="/vanilla_cake_blog.jpg"
                    alt="Fresh Vanilla Cakes for Every Celebration"
                    className="w-full h-[200px] md:h-[350px] object-cover transform hover:scale-[1.02] transition-transform duration-500"
                  />
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed font-medium">
                  Vanilla cakes continue to remain one of the most loved choices for all age groups because of their soft texture, creamy layers, and balanced sweetness. From simple family celebrations to corporate events, vanilla cakes suit every occasion perfectly.
                </p>
                <div className="bg-pink-50/20 p-5 rounded-2xl border border-pink-100/50 mb-6">
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-800 mb-3">Why it stands out:</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm font-semibold text-gray-600">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pink-500 flex-shrink-0" /> Soft & moist sponge layers</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pink-500 flex-shrink-0" /> Rich vanilla bean whip</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pink-500 flex-shrink-0" /> Balanced, non-cloying sweetness</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pink-500 flex-shrink-0" /> Exquisite clean presentation</li>
                  </ul>
                </div>
                <button
                  onClick={() => window.open('https://wa.me/918147751838?text=Hi! I would like to order a fresh Vanilla Cake.', '_blank')}
                  className="w-full sm:w-auto bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" /> Order Vanilla Cake
                </button>
              </section>

              {/* Marble Cakes */}
              <section id="marble" className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                  <h3 className="text-xl md:text-2xl font-['Outfit'] font-black text-gray-900 uppercase tracking-wider group-hover:text-pink-600 transition-colors">
                    2. Chocolate Swirl Marble Cakes
                  </h3>
                  <span className="mt-2 md:mt-0 text-[10px] font-black uppercase tracking-widest bg-amber-50 text-amber-700 px-3 py-1 rounded-full border border-amber-100 self-start">
                    Duo Twist
                  </span>
                </div>
                <div className="relative rounded-2xl overflow-hidden mb-6 shadow-md border border-gray-100 max-w-3xl">
                  <img
                    src="/marble_cake_blog.jpg"
                    alt="Marble Cakes with Rich Chocolate Swirls"
                    className="w-full h-[200px] md:h-[350px] object-cover transform hover:scale-[1.02] transition-transform duration-500"
                  />
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed font-medium">
                  Marble cakes combine delicious vanilla flavour with rich chocolate swirls, creating a perfect balance for customers who enjoy both tastes together. Their moist texture and attractive design make them ideal for birthdays, casual celebrations, and office gatherings.
                </p>
                <div className="bg-pink-50/20 p-5 rounded-2xl border border-pink-100/50 mb-6">
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-800 mb-3">Why it stands out:</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm font-semibold text-gray-600">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pink-500 flex-shrink-0" /> Intertwined vanilla & rich cocoa</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pink-500 flex-shrink-0" /> Gorgeous marbled visual appeal</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pink-500 flex-shrink-0" /> Highly popular with kids & adults</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pink-500 flex-shrink-0" /> Perfect pairing for tea & coffee</li>
                  </ul>
                </div>
                <button
                  onClick={() => window.open('https://wa.me/918147751838?text=Hi! I would like to order a Chocolate Swirl Marble Cake.', '_blank')}
                  className="w-full sm:w-auto bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" /> Order Marble Cake
                </button>
              </section>

              {/* Red Velvet Cakes */}
              <section id="red-velvet" className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                  <h3 className="text-xl md:text-2xl font-['Outfit'] font-black text-gray-900 uppercase tracking-wider group-hover:text-pink-600 transition-colors">
                    3. Premium Red Velvet Cakes
                  </h3>
                  <span className="mt-2 md:mt-0 text-[10px] font-black uppercase tracking-widest bg-pink-50 text-pink-700 px-3 py-1 rounded-full border border-pink-100 self-start">
                    Romantic & Luxurious
                  </span>
                </div>
                <div className="relative rounded-2xl overflow-hidden mb-6 shadow-md border border-gray-100 max-w-3xl">
                  <img
                    src="/red_velvet_cake_blog.jpg"
                    alt="Premium Red Velvet Cakes for Luxurious Celebrations"
                    className="w-full h-[200px] md:h-[350px] object-cover transform hover:scale-[1.02] transition-transform duration-500"
                  />
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed font-medium">
                  Red velvet cakes are one of the most popular premium cake choices for anniversaries, romantic occasions, and luxury celebrations. Their soft velvet sponge, creamy cheese frosting, and vibrant red crumbs make every special moment elegant and memorable.
                </p>
                <div className="bg-pink-50/20 p-5 rounded-2xl border border-pink-100/50 mb-6">
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-800 mb-3">Why it stands out:</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm font-semibold text-gray-600">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pink-500 flex-shrink-0" /> Luxurious red cocoa crumb sponge</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pink-500 flex-shrink-0" /> Heavenly cream cheese frosting</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pink-500 flex-shrink-0" /> Stunning visual aesthetics</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pink-500 flex-shrink-0" /> Best-seller for romantic surprises</li>
                  </ul>
                </div>
                <button
                  onClick={() => window.open('https://wa.me/918147751838?text=Hi! I would like to order a Premium Red Velvet Cake.', '_blank')}
                  className="w-full sm:w-auto bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" /> Order Red Velvet Cake
                </button>
              </section>

              {/* Vanilla Almond Cakes */}
              <section id="vanilla-almond" className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                  <h3 className="text-xl md:text-2xl font-['Outfit'] font-black text-gray-900 uppercase tracking-wider group-hover:text-pink-600 transition-colors">
                    4. Vanilla Almond Cakes
                  </h3>
                  <span className="mt-2 md:mt-0 text-[10px] font-black uppercase tracking-widest bg-amber-50 text-amber-700 px-3 py-1 rounded-full border border-amber-100 self-start">
                    Nutty Elegance
                  </span>
                </div>
                <div className="relative rounded-2xl overflow-hidden mb-6 shadow-md border border-gray-100 max-w-3xl">
                  <img
                    src="/vanilla_almond_cake_blog.jpg"
                    alt="Vanilla Almond Cakes with Delicious Nutty Taste"
                    className="w-full h-[200px] md:h-[350px] object-cover transform hover:scale-[1.02] transition-transform duration-500"
                  />
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed font-medium">
                  Vanilla almond cakes bring together smooth vanilla sweetness and rich, crunchy toasted almond flakes. Their creamy frosting and soft, nut-infused layers make them perfect for customers who prefer premium cake varieties with a textured, luxurious taste.
                </p>
                <div className="bg-pink-50/20 p-5 rounded-2xl border border-pink-100/50 mb-6">
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-800 mb-3">Why it stands out:</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm font-semibold text-gray-600">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pink-500 flex-shrink-0" /> Crunchy premium sliced almonds</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pink-500 flex-shrink-0" /> Nutty vanilla cream layers</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pink-500 flex-shrink-0" /> Refined, sophisticated taste</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pink-500 flex-shrink-0" /> Popular for family elders' birthdays</li>
                  </ul>
                </div>
                <button
                  onClick={() => window.open('https://wa.me/918147751838?text=Hi! I would like to order a Vanilla Almond Cake.', '_blank')}
                  className="w-full sm:w-auto bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" /> Order Vanilla Almond Cake
                </button>
              </section>
            </div>

            {/* Ordering Platforms */}
            <section id="ordering" className="bg-[#1A1616] text-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-72 h-72 bg-rose-gold/5 rounded-full blur-[100px] pointer-events-none"></div>
              
              <h2 className="text-2xl md:text-3xl font-['Outfit'] font-black uppercase tracking-tight mb-4 text-rose-gold">
                Hassle-Free Cake Ordering
              </h2>
              <p className="text-gray-300 mb-8 font-medium text-sm md:text-base leading-relaxed">
                Modern customers prefer quick and simple ordering methods for celebrations. Ordering cakes online through Swiggy, WhatsApp, and Zomato allows you to browse flavors, compare options, and receive cakes with fast doorstep delivery across Bangalore locations.
              </p>

              <div className="relative rounded-2xl overflow-hidden mb-8 shadow-lg border border-white/10 max-w-3xl">
                <img
                  src="/easy_ordering_blog.jpg"
                  alt="Easy Cake Ordering Through Swiggy, WhatsApp, and Zomato"
                  className="w-full h-[200px] md:h-[350px] object-cover transform hover:scale-[1.02] transition-transform duration-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Zomato */}
                <a
                  href="https://www.zomato.com/bangalore/carlos-cake-cafe-bellandur-bangalore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-red-500 hover:bg-red-500/10 transition-all duration-300 group cursor-pointer text-center"
                >
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="font-extrabold text-sm uppercase tracking-tighter">Z</span>
                  </div>
                  <span className="font-['Outfit'] font-black uppercase tracking-wider text-xs mb-2">Order on Zomato</span>
                  <span className="text-[10px] text-gray-400 font-semibold group-hover:text-red-400 flex items-center gap-1">
                    Order Now <ExternalLink className="w-3 h-3" />
                  </span>
                </a>

                {/* Swiggy */}
                <a
                  href="https://www.swiggy.com/city/bangalore/carlos-cake-cafe-bellandur-gate-sarjapur-road-rest58184"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-orange-500 hover:bg-orange-500/10 transition-all duration-300 group cursor-pointer text-center"
                >
                  <div className="w-12 h-12 bg-[#FC8019] rounded-full flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="font-extrabold text-sm uppercase tracking-tighter">S</span>
                  </div>
                  <span className="font-['Outfit'] font-black uppercase tracking-wider text-xs mb-2">Order on Swiggy</span>
                  <span className="text-[10px] text-gray-400 font-semibold group-hover:text-orange-400 flex items-center gap-1">
                    Order Now <ExternalLink className="w-3 h-3" />
                  </span>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/918147751838"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-green-500 hover:bg-green-500/10 transition-all duration-300 group cursor-pointer text-center"
                >
                  <div className="w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="font-extrabold text-sm uppercase tracking-tighter">W</span>
                  </div>
                  <span className="font-['Outfit'] font-black uppercase tracking-wider text-xs mb-2">Chat & Order</span>
                  <span className="text-[10px] text-gray-400 font-semibold group-hover:text-green-400 flex items-center gap-1">
                    Chat Now <ExternalLink className="w-3 h-3" />
                  </span>
                </a>
              </div>
            </section>

            {/* Why Customers Choose Us */}
            <section id="why-us" className="bg-gradient-to-br from-pink-50/50 to-rose-50/30 p-8 md:p-12 rounded-[2.5rem] border border-pink-100/50">
              <h2 className="text-2xl md:text-3xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tight mb-8">
                Why Customers Prefer Carlos Cake Cafe
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  "Freshly baked cakes prepared daily from scratch",
                  "Guaranteed same-day cake delivery across Bangalore locations",
                  "Premium flavors with soft, creamy, and moist textures",
                  "Hygienic baking processes and premium protective packaging",
                  "Hassle-free ordering through Swiggy, WhatsApp, and Zomato",
                  "Express door-to-door delivery with extreme care",
                  "Cakes suitable for birthdays, anniversaries, and corporate events",
                  "Friendly and prompt customer support for custom requirements"
                ].map((reason, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm font-semibold text-gray-700 leading-normal">
                    <CheckCircle2 className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQs */}
            <section id="faqs" className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tight text-center">
                Frequently Asked Questions
              </h2>
              <FAQAccordion faqs={faqs} />
            </section>

            {/* Bottom CTA Banner */}
            <div className="bg-gradient-to-r from-rose-gold to-[#E11D48] text-white p-8 md:p-12 rounded-[2.5rem] text-center shadow-xl border border-white/5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 max-w-xl mx-auto">
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.25em] bg-white/20 px-3 py-1 rounded-full mb-4">
                  <Flame className="w-3.5 h-3.5 animate-pulse" /> Bangalore Special Same-Day Service
                </span>
                <h3 className="text-2xl md:text-4xl font-['Outfit'] font-black uppercase tracking-tight mb-4">
                  Freshly Baked Cakes Delivered Across Bangalore
                </h3>
                <p className="text-white/90 text-sm font-semibold mb-8">
                  Looking for the best cake delivery online in Bangalore with same day service? Order freshly baked cakes now from Carlos Cake Cafe.
                </p>
                <button
                  onClick={() => navigate('/all-products')}
                  className="bg-white text-pink-600 px-8 py-3.5 rounded-full font-black uppercase tracking-widest text-xs shadow-md hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                  Browse Menu & Order
                </button>
              </div>
            </div>

          </div>

          {/* Sidebar (Table of Contents & Quick Order Box) */}
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

              {/* Quick Contact Widget inside Sidebar */}
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-5 rounded-2xl border border-pink-100/50 text-center">
                <h4 className="font-['Outfit'] font-black uppercase text-xs text-gray-800 mb-2">Need a custom design?</h4>
                <p className="text-gray-500 text-[11px] font-semibold mb-4 leading-normal">
                  Chat with our expert bakers directly on WhatsApp to customize your flavors, shapes, or weight!
                </p>
                <a
                  href="https://wa.me/918147751838?text=Hi! I am looking for a customized cake delivery in Bangalore."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20B859] text-white py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default BlogSameDayDelivery;
