// src/components/Hero.jsx
const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden bg-white">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-pink-100/50 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-50/50 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="relative z-10 text-center lg:text-left order-2 lg:order-1">
            <div className="inline-flex items-center space-x-2 bg-pink-50 px-4 py-2 rounded-full mb-8 mx-auto lg:mx-0">
              <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-widest text-pink-600">Artisanal Bakery Since 2010</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-['Outfit'] font-black text-gray-900 leading-tight mb-6">
              Baking <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-pink-400">Dreams</span> <br />
              Into Reality
            </h1>

            <p className="text-base md:text-lg text-gray-500 leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0">
              Every cake tells a story. We use only the finest organic ingredients and decades of artisanal expertise to make your celebrations unforgettable.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5">
              <button className="group relative bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold text-base overflow-hidden transition-all hover:shadow-2xl hover:shadow-gray-200">
                <span className="relative z-10">Start Your Order</span>
                <div className="absolute inset-0 bg-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
              </button>
              <button className="flex items-center space-x-2 text-gray-900 font-bold text-base hover:text-pink-600 transition-colors group">
                <div className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center group-hover:border-pink-200 transition-colors">
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>View Gallery</span>
              </button>
            </div>

            <div className="mt-12 flex items-center justify-center lg:justify-start space-x-8 border-t border-gray-100 pt-8">
              <div>
                <p className="text-2xl md:text-3xl font-black text-gray-900">15k+</p>
                <p className="text-xs text-gray-400 font-medium">Happy Clients</p>
              </div>
              <div className="h-6 w-px bg-gray-200"></div>
              <div>
                <p className="text-2xl md:text-3xl font-black text-gray-900">120+</p>
                <p className="text-xs text-gray-400 font-medium">Cake Flavors</p>
              </div>
              <div className="h-6 w-px bg-gray-200"></div>
              <div>
                <p className="text-2xl md:text-3xl font-black text-gray-900">24/7</p>
                <p className="text-xs text-gray-400 font-medium">Customer Support</p>
              </div>
            </div>
          </div>

          {/* Right Image - Using available custom_category.png */}
          <div className="relative order-1 lg:order-2">
            <div className="absolute -inset-4 bg-pink-100/30 rounded-[3rem] blur-2xl transform rotate-3"></div>
            <div className="relative group">
              <img
                src="/premium_cake_hero_1777274022400.png"
                alt="Premium Cake"
                className="relative z-10 w-full h-auto rounded-[2rem] lg:rounded-[3rem] shadow-2xl transform group-hover:scale-[1.02] transition-transform duration-700 ease-out"
              />
              {/* Floating Badge */}
              <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl px-4 py-3 z-20 hidden md:block">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-black uppercase tracking-wider">Freshly Baked Daily</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;