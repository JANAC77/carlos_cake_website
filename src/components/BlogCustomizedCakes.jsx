// src/components/BlogCustomizedCakes.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import FAQAccordion from './FAQAccordion';
import { Calendar, Clock, ArrowLeft, CheckCircle2, MessageCircle, ExternalLink, Flame } from 'lucide-react';

const BlogCustomizedCakes = () => {
  const navigate = useNavigate();

  // Dynamic SEO Metadata
  useSEO({
    title: "Order Customized Designer Cakes Online Bengaluru",
    description: "Order customized birthday designer cakes online in Bengaluru with express delivery. Choose creative designs, delicious flavour , and timely service."
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
    { id: 'intro', label: 'Introduction' },
    { id: 'why-popular', label: 'Why Designer Birthday Cakes Are Popular' },
    { id: 'cupcakes', label: 'Cup Cake Delights for Every Occasion' },
    { id: 'vanilla', label: 'Classic Vanilla Cakes for Timeless Celebrations' },
    { id: 'blueberry', label: 'Refreshing Blueberry Cakes for Fruit Lovers' },
    { id: 'butterscotch', label: 'Rich Butterscotch Cakes for Every Celebration' },
    { id: 'hazelnut', label: 'Hazelnut Chocolate Truffle Cakes' },
    { id: 'comparison', label: 'Comparing Popular Cake Shops in Bengaluru' },
    { id: 'why-us', label: 'Why Choose Carlos Cake Cafe' },
    { id: 'same-day', label: 'Benefits of Same-Day Cake Delivery' },
    { id: 'easy-ordering', label: 'Easy Ordering Through Swiggy, WhatsApp & Zomato' },
    { id: 'faqs', label: 'Frequently Asked Questions' },
    { id: 'order-today', label: 'Order Your Designer Birthday Cake Today' }
  ];

  const faqs = [
    {
      question: "Can I order a designer birthday cake online in Bengaluru?",
      answer: "Customers can conveniently place orders for personalized designer birthday cakes online, with the added benefit of same-day delivery options available."
    },
    {
      question: "Does Carlos Cake Cafe provide same-day cake delivery?",
      answer: "Yes, same-day delivery is available for selected cake designs and locations across Bengaluru."
    },
    {
      question: "Which cake flavors are available?",
      answer: "Popular flavors include Cup Cakes, Vanilla, Blueberry, Butterscotch, and Hazelnut Chocolate Truffle."
    },
    {
      question: "Can I customize my birthday cake design?",
      answer: "Yes, personalized themes, messages, and custom cake designs are available."
    },
    {
      question: "How can I place an order?",
      answer: "Customers can conveniently place their orders through Swiggy, WhatsApp, or Zomato, ensuring a smooth, fast, and user-friendly purchasing experience."
    },
    {
      question: "Are custom-designed cakes a good choice for children's birthday celebrations?",
      answer: "Absolutely. Customized cartoon, superhero, and theme-based cakes are available for children's birthday celebrations."
    }
  ];

  const comparisonData = [
    {
      feature: "Designer Birthday Cakes",
      carlos: "✔ Extensive customization options",
      iyengars: "Limited customization",
      liliyum: "Premium designer options"
    },
    {
      feature: "Same-Day Delivery",
      carlos: "✔ Available across Bengaluru",
      iyengars: "Available at selected locations",
      liliyum: "Available for select orders"
    },
    {
      feature: "Custom Theme Cakes",
      carlos: "✔ Yes",
      iyengars: "Limited",
      liliyum: "Yes"
    },
    {
      feature: "Kids Birthday Cakes",
      carlos: "Wide variety of themes",
      iyengars: "Basic options",
      liliyum: "Premium options"
    },
    {
      feature: "Flavor Variety",
      carlos: "Choose from Cup Cakes, Vanilla, Blueberry, Butterscotch, Hazelnut Chocolate Truffle, and many other delicious options.",
      iyengars: "Standard flavors",
      liliyum: "Gourmet flavors"
    },
    {
      feature: "Online Ordering",
      carlos: "Swiggy, WhatsApp, Zomato",
      iyengars: "Limited platform availability",
      liliyum: "Website and delivery partners"
    },
    {
      feature: "Personalized Cake Messages",
      carlos: "Available",
      iyengars: "Available",
      liliyum: "Available"
    },
    {
      feature: "Last-Minute Birthday Orders",
      carlos: "Same-day support",
      iyengars: "Limited availability",
      liliyum: "Subject to design complexity"
    },
    {
      feature: "Value for Money",
      carlos: "Strong balance of quality and pricing",
      iyengars: "Budget-friendly",
      liliyum: "Premium pricing"
    },
    {
      feature: "Suitable For",
      carlos: "Kids' birthdays, family celebrations, office parties, custom events",
      iyengars: "Everyday celebrations",
      liliyum: "Luxury celebrations"
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
            src="/customized_birthday_cakes_guide.jpg"
            alt="Order Customized Birthday Designer Cakes Online in Bengaluru"
            className="w-full h-[320px] md:h-[450px] object-cover transform hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-20 text-white">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <span className="bg-pink-600/90 text-white text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-full">
                Designer Cake Guide
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
              Order Customized Birthday Designer Cakes Online in Bengaluru with Express Delivery
            </h1>
          </div>
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Intro */}
            <section id="intro" className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 leading-relaxed text-gray-700 font-medium">
              <h2 className="text-2xl md:text-3xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tight mb-6 flex items-center gap-2">
                <span className="w-1.5 h-8 bg-pink-500 rounded-full"></span>
                Introduction
              </h2>
              <p className="mb-4 text-base">
                Birthday celebrations become more memorable when a beautifully crafted designer cake becomes the highlight of the event. Whether you are planning a surprise party, a family gathering, or a grand birthday celebration, ordering cakes online offers convenience, variety, and fast delivery across Bengaluru.
              </p>
              <p className="text-base">
                Customers can explore a wide range of creative cake designs, select their preferred flavors, and enjoy fresh same-day cake delivery directly to their doorstep for a convenient celebration experience.
              </p>
            </section>

            {/* Why Designer Birthday Cakes Are Popular */}
            <section id="why-popular" className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 font-medium leading-relaxed text-gray-700 group">
              <h2 className="text-2xl md:text-3xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tight mb-6 flex items-center gap-2 group-hover:text-pink-600 transition-colors">
                <span className="w-1.5 h-8 bg-pink-500 rounded-full"></span>
                Why Designer Birthday Cakes Are Popular
              </h2>
              <div className="relative rounded-2xl overflow-hidden mb-6 shadow-md border border-gray-100 max-w-3xl">
                <img
                  src="/designer_cakes_popular_guide.jpg"
                  alt="Why Designer Birthday Cakes Are Popular"
                  className="w-full h-[200px] md:h-[350px] object-cover transform hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
              <p className="mb-4">
                Designer cakes have become an essential part of modern birthday celebrations. Unlike traditional cakes, they can be customized to match themes, hobbies, favorite characters, or special occasions. Personalized cakes help create unforgettable celebration experiences, making birthdays, anniversaries, and special occasions more unique, memorable, and meaningful.
              </p>
              <p>
                As demand continues to grow, many customers searching for <span className="font-extrabold text-pink-600">Design cake birthday Bengaluru</span> options prefer bakeries that offer customization, fresh ingredients, and reliable delivery services.
              </p>
            </section>

            {/* Cup Cake Delights */}
            <section id="cupcakes" className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 group">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <h3 className="text-xl md:text-2xl font-['Outfit'] font-black text-gray-900 uppercase tracking-wider group-hover:text-pink-600 transition-colors">
                  Cup Cake Delights for Every Occasion
                </h3>
                <span className="mt-2 md:mt-0 text-[10px] font-black uppercase tracking-widest bg-pink-50 text-pink-700 px-3 py-1 rounded-full border border-pink-100 self-start">
                  Party Favors
                </span>
              </div>
              <div className="relative rounded-2xl overflow-hidden mb-6 shadow-md border border-gray-100 max-w-3xl">
                <img
                  src="/cupcake_delights_guide.jpg"
                  alt="Cup Cake Delights for Every Occasion"
                  className="w-full h-[200px] md:h-[350px] object-cover transform hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
              <p className="text-gray-600 leading-relaxed font-medium mb-4">
                Cup cakes are an excellent choice for birthday parties, office celebrations, school events, and family gatherings. Their individual serving portions make them easy to distribute while adding variety to dessert tables.
              </p>
              <p className="text-gray-600 leading-relaxed font-medium">
                Many customers exploring <span className="font-extrabold text-pink-600">Design cake birthday Bengaluru</span> options choose customized cupcakes alongside their birthday cake to create a stylish, visually appealing, and well-coordinated celebration setup.
              </p>
            </section>

            {/* Classic Vanilla */}
            <section id="vanilla" className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 group">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <h3 className="text-xl md:text-2xl font-['Outfit'] font-black text-gray-900 uppercase tracking-wider group-hover:text-pink-600 transition-colors">
                  Classic Vanilla Cakes for Timeless Celebrations
                </h3>
                <span className="mt-2 md:mt-0 text-[10px] font-black uppercase tracking-widest bg-amber-50 text-amber-700 px-3 py-1 rounded-full border border-amber-100 self-start">
                  Timeless Classic
                </span>
              </div>
              <div className="relative rounded-2xl overflow-hidden mb-6 shadow-md border border-gray-100 max-w-3xl">
                <img
                  src="/classic_vanilla_guide.jpg"
                  alt="Classic Vanilla Cakes for Timeless Celebrations"
                  className="w-full h-[200px] md:h-[350px] object-cover transform hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
              <p className="text-gray-600 leading-relaxed font-medium mb-4">
                Vanilla cakes continue to be one of the most popular birthday cake flavors because of their soft texture and universally loved taste. They serve as the perfect base for customized decorations, themed designs, and personalized messages.
              </p>
              <p className="text-gray-600 leading-relaxed font-medium">
                When exploring <span className="font-extrabold text-pink-600">Design cake birthday Bengaluru</span> services, vanilla cakes remain a top choice for both children and adults due to their versatility and elegant presentation.
              </p>
            </section>

            {/* Refreshing Blueberry */}
            <section id="blueberry" className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 group">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <h3 className="text-xl md:text-2xl font-['Outfit'] font-black text-gray-900 uppercase tracking-wider group-hover:text-pink-600 transition-colors">
                  Refreshing Blueberry Cakes for Fruit Lovers
                </h3>
                <span className="mt-2 md:mt-0 text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100 self-start">
                  Fruity Twist
                </span>
              </div>
              <div className="relative rounded-2xl overflow-hidden mb-6 shadow-md border border-gray-100 max-w-3xl">
                <img
                  src="/blueberry_guide.jpg"
                  alt="Refreshing Blueberry Cakes for Fruit Lovers"
                  className="w-full h-[200px] md:h-[350px] object-cover transform hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
              <p className="text-gray-600 leading-relaxed font-medium mb-4">
                Blueberry cakes offer a refreshing balance of sweetness and fruit flavor. Their vibrant appearance and creamy texture make them ideal for customers looking for something different from traditional cake flavors.
              </p>
              <p className="text-gray-600 leading-relaxed font-medium">
                The growing popularity of <span className="font-extrabold text-pink-600">Design cake birthday Bengaluru</span> options has also increased interest in blueberry cakes among customers who prefer fruity and premium dessert experiences.
              </p>
            </section>

            {/* Rich Butterscotch */}
            <section id="butterscotch" className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 group">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <h3 className="text-xl md:text-2xl font-['Outfit'] font-black text-gray-900 uppercase tracking-wider group-hover:text-pink-600 transition-colors">
                  Rich Butterscotch Cakes for Every Celebration
                </h3>
                <span className="mt-2 md:mt-0 text-[10px] font-black uppercase tracking-widest bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full border border-yellow-100 self-start">
                  Indulgent Crunch
                </span>
              </div>
              <div className="relative rounded-2xl overflow-hidden mb-6 shadow-md border border-gray-100 max-w-3xl">
                <img
                  src="/butterscotch_guide.jpg"
                  alt="Rich Butterscotch Cakes for Every Celebration"
                  className="w-full h-[200px] md:h-[350px] object-cover transform hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
              <p className="text-gray-600 leading-relaxed font-medium mb-4">
                Butterscotch cakes remain a favorite among cake lovers thanks to their delicious caramel notes and crunchy toppings. Their rich and indulgent taste makes them a perfect addition to birthdays, anniversaries, and cherished family celebrations.
              </p>
              <p className="text-gray-600 leading-relaxed font-medium">
                Customers searching for <span className="font-extrabold text-pink-600">Design cake birthday Bengaluru</span> services frequently choose butterscotch cakes because they combine great taste with visually appealing designs.
              </p>
            </section>

            {/* Hazelnut Chocolate Truffle */}
            <section id="hazelnut" className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 group">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <h3 className="text-xl md:text-2xl font-['Outfit'] font-black text-gray-900 uppercase tracking-wider group-hover:text-pink-600 transition-colors">
                  Hazelnut Chocolate Truffle Cakes for Premium Celebrations
                </h3>
                <span className="mt-2 md:mt-0 text-[10px] font-black uppercase tracking-widest bg-purple-50 text-purple-700 px-3 py-1 rounded-full border border-purple-100 self-start">
                  Luxurious Richness
                </span>
              </div>
              <div className="relative rounded-2xl overflow-hidden mb-6 shadow-md border border-gray-100 max-w-3xl">
                <img
                  src="/hazelnut_chocolate_truffle_guide.jpg"
                  alt="Hazelnut Chocolate Truffle Cakes for Premium Celebrations"
                  className="w-full h-[200px] md:h-[350px] object-cover transform hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
              <p className="text-gray-600 leading-relaxed font-medium mb-4">
                Hazelnut Chocolate Truffle cakes offer a luxurious combination of rich chocolate layers and roasted hazelnut flavors. These cakes are often selected for milestone birthdays and special celebrations where customers want something extra special.
              </p>
              <p className="text-gray-600 leading-relaxed font-medium">
                Many customers exploring premium <span className="font-extrabold text-pink-600">Design cake birthday Bengaluru</span> options prefer Hazelnut Chocolate Truffle cakes for their rich chocolate flavor, smooth texture, and luxurious dessert experience.
              </p>
            </section>

            {/* Comparison Section */}
            <section id="comparison" className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
                <span className="w-1.5 h-8 bg-pink-500 rounded-full"></span>
                Comparing Popular Cake Shops in Bengaluru
              </h2>
              
              <div className="overflow-x-auto rounded-[2rem] border border-gray-100 shadow-sm bg-white p-2">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-slate-50 rounded-2xl">
                    <tr>
                      <th scope="col" className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-gray-400">Feature</th>
                      <th scope="col" className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-pink-600 bg-pink-50/50 rounded-t-xl">Carlos Cake Cafe</th>
                      <th scope="col" className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-gray-500">Iyengars Oven Fresh</th>
                      <th scope="col" className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-gray-500">Liliyum Patisserie</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs md:text-sm font-semibold text-gray-600">
                    {comparisonData.map((row, index) => (
                      <tr key={index} className="hover:bg-slate-50/30 transition-colors">
                        <td className="px-5 py-4 font-extrabold text-gray-900 max-w-[150px]">{row.feature}</td>
                        <td className="px-5 py-4 text-pink-600 bg-pink-50/20 font-bold">{row.carlos}</td>
                        <td className="px-5 py-4 text-gray-500 font-medium">{row.iyengars}</td>
                        <td className="px-5 py-4 text-gray-500 font-medium">{row.liliyum}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Why Choose Us */}
            <section id="why-us" className="bg-gradient-to-br from-pink-50/50 to-rose-50/30 p-8 md:p-12 rounded-[2.5rem] border border-pink-100/50 group">
              <h2 className="text-2xl md:text-3xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tight mb-8 group-hover:text-pink-600 transition-colors">
                Why Many Customers Choose Carlos Cake Cafe
              </h2>
              <div className="relative rounded-2xl overflow-hidden mb-6 shadow-md border border-gray-100 max-w-3xl">
                <img
                  src="/why_choose_carlos_guide.jpg"
                  alt="Why Many Customers Choose Carlos Cake Cafe"
                  className="w-full h-[200px] md:h-[350px] object-cover transform hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
              <p className="text-gray-600 leading-relaxed font-medium mb-6">
                While several bakeries operate across Bengaluru, Carlos Cake Cafe stands out because of its focus on designer cakes, customization options, fresh ingredients, and same-day delivery services.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  "Wide range of designer birthday cake themes",
                  "Same-day cake delivery across Bengaluru",
                  "Freshly baked cakes prepared to order",
                  "Multiple flavor options including Vanilla, Blueberry, Butterscotch, Cup Cakes, and Hazelnut Chocolate Truffle",
                  "Easy ordering through Swiggy, WhatsApp, and Zomato",
                  "Personalized cake designs for kids and adults",
                  "Reliable customer support for custom cake requirements"
                ].map((reason, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm font-semibold text-gray-700 leading-normal">
                    <CheckCircle2 className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
              <p className="text-gray-600 leading-relaxed font-medium mt-6">
                Many people searching for <span className="font-extrabold text-pink-600">Design cake birthday Bengaluru</span> services prefer Carlos Cake Cafe due to its creative designs, affordable rates, and reliable customer experience.
              </p>
            </section>

            {/* Benefits of Same-Day Delivery */}
            <section id="same-day" className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 group">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <h3 className="text-xl md:text-2xl font-['Outfit'] font-black text-gray-900 uppercase tracking-wider group-hover:text-pink-600 transition-colors">
                  Benefits of Same-Day Cake Delivery
                </h3>
                <span className="mt-2 md:mt-0 text-[10px] font-black uppercase tracking-widest bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-100 self-start">
                  Fast Shipping
                </span>
              </div>
              <div className="relative rounded-2xl overflow-hidden mb-6 shadow-md border border-gray-100 max-w-3xl">
                <img
                  src="/same_day_delivery_guide.jpg"
                  alt="Benefits of Same-Day Cake Delivery"
                  className="w-full h-[200px] md:h-[350px] object-cover transform hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
              <p className="text-gray-600 leading-relaxed font-medium mb-4">
                For last-minute events, same-day delivery has become an essential service for many customers. It helps ensure that birthdays and special occasions continue without unnecessary stress.
              </p>
              <p className="text-gray-600 leading-relaxed font-medium">
                Whether customers need a customized cake urgently or want to surprise someone special, <span className="font-extrabold text-pink-600">Design cake birthday Bengaluru</span> services with same-day delivery provide convenience and peace of mind.
              </p>
            </section>

            {/* Easy Ordering */}
            <section id="easy-ordering" className="bg-[#1A1616] text-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-72 h-72 bg-rose-gold/5 rounded-full blur-[100px] pointer-events-none"></div>
              
              <h2 className="text-2xl md:text-3xl font-['Outfit'] font-black uppercase tracking-tight mb-4 text-rose-gold">
                Easy Ordering Through Swiggy, WhatsApp, and Zomato
              </h2>
              <p className="text-gray-300 mb-8 font-medium text-sm md:text-base leading-relaxed">
                Ordering designer birthday cakes has never been easier. Customers can browse cake designs, select flavors, customize cakes, and place orders through these platforms for quick access to <span className="font-extrabold text-rose-gold">Design cake birthday Bengaluru</span> options while ensuring a seamless ordering experience and reliable doorstep delivery.
              </p>

              <div className="relative rounded-2xl overflow-hidden mb-8 shadow-lg border border-white/10 max-w-3xl">
                <img
                  src="/easy_ordering_guide.jpg"
                  alt="Easy Ordering Through Swiggy, WhatsApp, and Zomato"
                  className="w-full h-[200px] md:h-[350px] object-cover transform hover:scale-[1.02] transition-transform duration-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <a
                  href="https://www.swiggy.com/city/bangalore/carlos-cake-cafe-bellandur-gate-sarjapur-road-rest58184"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-orange-500 hover:bg-orange-500/10 transition-all duration-300 group cursor-pointer text-center"
                >
                  <div className="w-12 h-12 bg-[#FC8019] rounded-full flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300 font-black">S</div>
                  <span className="font-['Outfit'] font-black uppercase tracking-wider text-xs mb-2">Swiggy</span>
                  <span className="text-[10px] text-gray-400 font-semibold group-hover:text-orange-400 flex items-center gap-1">Order Now <ExternalLink className="w-3 h-3" /></span>
                </a>

                <a
                  href="https://wa.me/918147751838"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-green-500 hover:bg-green-500/10 transition-all duration-300 group cursor-pointer text-center"
                >
                  <div className="w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300 font-black">W</div>
                  <span className="font-['Outfit'] font-black uppercase tracking-wider text-xs mb-2">WhatsApp</span>
                  <span className="text-[10px] text-gray-400 font-semibold group-hover:text-green-400 flex items-center gap-1">Chat & Order <ExternalLink className="w-3 h-3" /></span>
                </a>

                <a
                  href="https://www.zomato.com/bangalore/carlos-cake-cafe-bellandur-bangalore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-red-500 hover:bg-red-500/10 transition-all duration-300 group cursor-pointer text-center"
                >
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300 font-black">Z</div>
                  <span className="font-['Outfit'] font-black uppercase tracking-wider text-xs mb-2">Zomato</span>
                  <span className="text-[10px] text-gray-400 font-semibold group-hover:text-red-400 flex items-center gap-1">Order Now <ExternalLink className="w-3 h-3" /></span>
                </a>
              </div>
            </section>

            {/* FAQs */}
            <section id="faqs" className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tight text-center">
                Frequently Asked Questions
              </h2>
              <FAQAccordion faqs={faqs} />
            </section>

            {/* Order Your Designer Birthday Cake Today */}
            <section id="order-today" className="bg-gradient-to-r from-rose-gold to-[#E11D48] text-white p-8 md:p-12 rounded-[2.5rem] text-center shadow-xl border border-white/5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 max-w-xl mx-auto">
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.25em] bg-white/20 px-3 py-1 rounded-full mb-4">
                  <Flame className="w-3.5 h-3.5 animate-pulse" /> Express Birthday Delivery
                </span>
                <h3 className="text-2xl md:text-4xl font-['Outfit'] font-black uppercase tracking-tight mb-4">
                  Order Your Designer Birthday Cake Today
                </h3>
                <p className="text-white/90 text-sm font-semibold mb-8">
                  Whether you are planning a surprise birthday party or organizing a grand celebration, Carlos Cake Cafe offers a wide selection of freshly baked designer cakes with same-day delivery across Bengaluru.
                </p>
                
                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() => navigate('/all-products')}
                    className="bg-white text-pink-600 px-6 py-3 rounded-xl font-extrabold uppercase tracking-wider text-xs shadow-md hover:scale-105 transition-all cursor-pointer"
                  >
                    Order Now
                  </button>
                  <a
                    href="https://www.swiggy.com/city/bangalore/carlos-cake-cafe-bellandur-gate-sarjapur-road-rest58184"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#FC8019] text-white px-6 py-3 rounded-xl font-extrabold uppercase tracking-wider text-xs shadow-md hover:scale-105 transition-all cursor-pointer flex items-center gap-1"
                  >
                    Swiggy
                  </a>
                  <a
                    href="https://wa.me/918147751838"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#25D366] text-white px-6 py-3 rounded-xl font-extrabold uppercase tracking-wider text-xs shadow-md hover:scale-105 transition-all cursor-pointer flex items-center gap-1"
                  >
                    WhatsApp
                  </a>
                  <a
                    href="https://www.zomato.com/bangalore/carlos-cake-cafe-bellandur-bangalore"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-red-600 text-white px-6 py-3 rounded-xl font-extrabold uppercase tracking-wider text-xs shadow-md hover:scale-105 transition-all cursor-pointer flex items-center gap-1"
                  >
                    Zomato
                  </a>
                </div>
              </div>
            </section>

            {/* Conclusion */}
            <section id="conclusion" className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 font-medium leading-relaxed text-gray-700">
              <h2 className="text-2xl md:text-3xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tight mb-6 flex items-center gap-2">
                <span className="w-1.5 h-8 bg-pink-500 rounded-full"></span>
                Conclusion
              </h2>
              <p className="mb-4">
                Designer birthday cakes add creativity, excitement, and personalization to every celebration. From Cup Cakes and Vanilla Cakes to Blueberry, Butterscotch, and Hazelnut Chocolate Truffle creations, customers have plenty of options to choose from.
              </p>
              <p>
                With customization services, same-day delivery, and convenient ordering through Swiggy, WhatsApp, and Zomato, Carlos Cake Cafe continues to be a preferred choice for birthday cake lovers across Bengaluru.
              </p>
            </section>

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

              {/* Quick WhatsApp Widget */}
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

export default BlogCustomizedCakes;
