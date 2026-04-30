const OurStory = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="pt-40 pb-24 bg-gray-50/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-pink-100/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-pink-600 font-['Outfit'] font-black uppercase tracking-[0.3em] text-xs mb-6">Established 2010</h2>
            <h1 className="text-5xl md:text-7xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tighter mb-10 leading-none">
              Welcome To <br /> Carlos Cake Cafe
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed font-medium italic mb-12">
              "Designing beautiful and innovative cakes that match your personality and the modern era."
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            <div className="space-y-12">
              <div className="space-y-6">
                <h3 className="text-3xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tight">Our Legacy in Bangalore</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Carlos Cake Café has emerged as a ‘Popular Icon’ in the field of baking with an unmatched reputation in the market. We are always leading our way by designing beautiful and innovative cakes and other treats. According to modern era, we follow the trends; we baked goods according to all groups and people. 
                </p>
                <p className="text-gray-600 leading-relaxed text-lg">
                  We are the most famous Cake Shop in Bangalore as we committed to the top class production and offer friendly customer service that makes you more comfortable in sharing your views and needs. In addition to this, we offer Online Cake Delivery as well. You can give your order on call or online and your order will reach at your doorstep as quickly as possible.
                </p>
              </div>

              <div className="bg-pink-50 p-10 rounded-[3rem] border border-pink-100">
                <h4 className="text-xl font-['Outfit'] font-black text-pink-600 uppercase tracking-widest mb-6">Why Choose Carlos?</h4>
                <p className="text-gray-700 leading-relaxed italic font-medium">
                  "Our secret of success lies in the meticulous care of our customers. We understand your feelings and the occasion for which you are ordering, ensuring perfect timing, shape, size, and design."
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 bg-gray-100 rounded-[4rem] -rotate-2"></div>
              <img 
                src="/custom_category.png" 
                alt="Carlos Cake Specialties" 
                className="relative z-10 w-full rounded-[3rem] shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Specialties Grid */}
      <section className="py-24 bg-gray-900 text-white overflow-hidden relative">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-600/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-['Outfit'] font-black uppercase tracking-tighter mb-6">Our Signature Flavors</h2>
            <p className="text-gray-400 font-medium tracking-widest uppercase text-sm">Crafted with passion and the finest ingredients</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Chocolate Truffle', desc: 'Carlos cake choco truffle' },
              { name: 'Chocolate Mocha', desc: 'Carlos cake chocolate mocha' },
              { name: 'Mix Fruit', desc: 'Carlos cake black forest' },
              { name: 'Butter Scotch', desc: 'Carlos cake cafe butter scotch' },
              { name: 'Customized Cake', desc: 'Lovingly crafted for your needs' },
              { name: 'Choco-Almond Cake', desc: 'The perfect nutty blend' }
            ].map((flavor, index) => (
              <div key={index} className="bg-gray-800/50 p-8 rounded-[2.5rem] border border-gray-700 hover:border-pink-500 transition-all group">
                <h4 className="text-2xl font-['Outfit'] font-black text-white group-hover:text-pink-500 transition-colors mb-2 uppercase tracking-tight">
                  {flavor.name}
                </h4>
                <p className="text-gray-500 font-medium uppercase tracking-widest text-[10px]">
                  {flavor.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
             <button className="bg-pink-600 text-white px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest text-sm hover:bg-white hover:text-gray-900 transition-all duration-500">
               View Full Menu
             </button>
          </div>
        </div>
      </section>

      {/* Quality Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center space-y-10">
            <h3 className="text-3xl md:text-5xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tighter">
              Quality, Health & Hygiene
            </h3>
            <p className="text-gray-600 leading-relaxed text-lg font-medium">
              We are not only deliver delicious, mouth-watering cakes and other desserts; we take care of nutritional value, hygiene and health as well. Thus, you can stay fit and healthy. We use only top quality ingredients, resulting in extremely delicious and yummy cakes.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-10">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-600 mx-auto">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h5 className="font-['Outfit'] font-black uppercase tracking-tight">100% Hygienic</h5>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-600 mx-auto">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h5 className="font-['Outfit'] font-black uppercase tracking-tight">Fastest Delivery</h5>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-600 mx-auto">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 16v2m3-6v6m3-8v8m-7 0h11a2 2 0 002-2v-5a2 2 0 00-2-2H5a2 2 0 00-2 2v5a2 2 0 002 2z" />
                  </svg>
                </div>
                <h5 className="font-['Outfit'] font-black uppercase tracking-tight">Artisanal Design</h5>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <h3 className="text-2xl font-['Outfit'] font-black text-gray-900 uppercase tracking-widest mb-12">Serving Your Neighborhood</h3>
          <div className="flex flex-wrap justify-center gap-6">
            {['Sarjapur Road', 'Bellandur', 'Marathahalli', 'Bangalore Central'].map((loc) => (
              <div key={loc} className="bg-white px-10 py-6 rounded-2xl shadow-sm border border-gray-100 font-['Outfit'] font-black uppercase tracking-widest text-sm text-gray-700">
                {loc}
              </div>
            ))}
          </div>
          <p className="mt-16 text-gray-500 font-medium max-w-2xl mx-auto">
            Order Cake Online for free home delivery from CARLOS CAKE CAFE near you. We value your precious time and money.
          </p>
        </div>
      </section>
    </div>
  );
};

export default OurStory;
