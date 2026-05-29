import React from 'react';
import FAQAccordion from './FAQAccordion';
import { Award, Truck, Sparkles, Smile } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomeSEOContent = () => {
  const navigate = useNavigate();

  const homeFaqs = [
    {
      question: "Do you offer online cake delivery in Bangalore?",
      answer: "Yes, Carlos Cake Cafe provides fast and reliable online cake delivery in Bangalore for birthdays, anniversaries, and special occasions."
    },
    {
      question: "What types of cakes are available at Carlos Cake Cafe?",
      answer: "We offer Fresh Cream Cakes, Designer Cakes, Chocolate Cakes, Tiered Cakes, Cup Cakes, and customised celebration cakes."
    },
    {
      question: "Which flavours are available in Fresh Cream Cakes?",
      answer: "Our Fresh Cream Cake collection includes Vanilla, Marble, and Red Velvet flavours made with smooth fresh cream and soft sponge layers."
    },
    {
      question: "What flavours are available in Designer Cakes?",
      answer: "Our Designer Cakes are available in Vanilla, Blueberry, Butterscotch, Hazelnut, Chocolate Truffle, and Cup Cake varieties."
    },
    {
      question: "What flavours are available in Chocolate Cakes?",
      answer: "Our Chocolate Cake collection includes Butterscotch, Dutch Truffle, Tiered Chocolate Cakes, and classic Chocolate Cake flavours."
    },
    {
      question: "Can I order cakes online for same-day delivery?",
      answer: "Yes, we offer online cake ordering with same-day delivery options based on availability and delivery location in Bangalore."
    },
    {
      question: "Do you provide customised cakes for special occasions?",
      answer: "Yes, we create customised cakes for birthdays, anniversaries, weddings, baby showers, corporate events, and other celebrations."
    },
    {
      question: "Are your cakes freshly baked?",
      answer: "Yes, all our cakes are freshly prepared using premium ingredients to ensure rich taste, freshness, and quality."
    },
    {
      question: "Do you offer eggless cake options?",
      answer: "Yes, we provide delicious eggless cake options in multiple flavours and designs for customers who prefer egg-free cakes."
    },
    {
      question: "Why choose Carlos Cake Cafe for online cake delivery?",
      answer: "Carlos Cake Cafe offers freshly baked cakes, premium flavours, attractive designs, and reliable online cake delivery service across Bangalore. Customers can also order easily through Swiggy, Zomato, and WhatsApp for quick and convenient cake delivery."
    }
  ];

  const features = [
    {
      icon: <Award className="w-6 h-6 text-pink-500" />,
      title: "Freshly Baked Daily",
      desc: "All our cakes are baked fresh on the day of delivery with premium ingredients."
    },
    {
      icon: <Sparkles className="w-6 h-6 text-amber-500" />,
      title: "Expert Craftsmanship",
      desc: "Beautifully designed custom cakes by expert bakers for every special theme."
    },
    {
      icon: <Truck className="w-6 h-6 text-pink-500" />,
      title: "Fast Doorstep Delivery",
      desc: "Timely delivery across Bangalore to ensure your cake arrives in perfect presentation."
    },
    {
      icon: <Smile className="w-6 h-6 text-amber-500" />,
      title: "Sweet Celebrations",
      desc: "Committed to spreading smiles and making every occasion sweeter and memorable."
    }
  ];

  return (
    <section className="py-20 bg-cream-base border-t border-gray-100 overflow-hidden relative">
      {/* Decorative ambient blobs */}
      <div className="absolute top-10 right-10 w-80 h-80 bg-pink-100/30 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-amber-100/30 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Why Choose Us Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-6 h-px bg-rose-gold"></span>
            <p className="text-rose-gold font-['Outfit'] font-black uppercase tracking-[0.25em] text-[10px]">Why Choose Us</p>
            <span className="w-6 h-px bg-rose-gold"></span>
          </div>
          <h2 className="text-3xl md:text-5xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tight mb-6">
            Freshly Baked Cakes with <span className="text-gradient-rose-gold font-black">Fast Online Cake Delivery</span> in Bangalore
          </h2>
          <p className="text-gray-600 text-sm md:text-base font-semibold leading-relaxed">
            At Carlos Cake Cafe, we are committed to delivering freshly baked, premium-quality cakes made with rich ingredients and expert craftsmanship. Every cake is designed to make your celebrations special, whether it’s a birthday, anniversary, or any occasion. With fast online cake delivery in Bangalore, we ensure your favorite cakes reach you fresh, on time, and with perfect presentation, making every moment sweeter and more memorable.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:scale-[1.02] hover:border-pink-200 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center mb-6 group-hover:bg-pink-100 transition-colors duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg font-['Outfit'] font-black text-gray-900 uppercase tracking-wider mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-xs md:text-sm font-medium leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-4xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tight">
              Frequently Asked <span className="text-gradient-rose-gold font-black">Questions</span>
            </h3>
            <p className="text-gray-500 text-xs md:text-sm font-semibold tracking-wide uppercase mt-2">
              Everything you need to know about our Bangalore cake delivery services
            </p>
          </div>
          <FAQAccordion faqs={homeFaqs} />
        </div>

        {/* Call to Action Banner */}
        <div className="bg-gradient-to-r from-[#1A1616] to-[#2E2828] rounded-[2.5rem] p-10 md:p-16 text-center relative overflow-hidden shadow-2xl border border-white/5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-gold/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-champagne-gold/10 rounded-full blur-[80px] pointer-events-none"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="text-rose-gold font-['Outfit'] font-black uppercase tracking-[0.25em] text-[10px] block mb-4">
              Freshly Baked Cakes Delivered to Your Doorstep
            </span>
            <h3 className="text-3xl md:text-5xl font-['Outfit'] font-black text-white uppercase tracking-tight mb-8">
              Order Now & Celebrate Every Moment with Carlos Cake
            </h3>
            <button 
              onClick={() => navigate('/all-products')}
              className="bg-gradient-to-r from-rose-gold to-[#E11D48] text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:shadow-premium-glow hover:scale-105 transition-all duration-300 btn-premium cursor-pointer"
            >
              Order Online Now
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HomeSEOContent;
