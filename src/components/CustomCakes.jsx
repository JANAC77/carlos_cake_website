const CustomCakes = () => {
  return (
    <section className="py-24 bg-white min-h-screen pt-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-pink-600 font-['Outfit'] font-black uppercase tracking-[0.2em] text-sm mb-4">Bespoke Creations</h2>
            <h3 className="text-4xl md:text-6xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tighter mb-8 leading-none">
              Your Vision, <br /> Our Craft
            </h3>
            <p className="text-gray-600 text-lg mb-10 leading-relaxed font-medium">
              From grand wedding centerpieces to intimate celebration cakes, we work closely with you to design a masterpiece that tastes as incredible as it looks.
            </p>
            
            <div className="space-y-6">
              {[
                { title: 'Personal Consultation', desc: 'Book a session to discuss flavors and sketches.' },
                { title: 'Tasting Samples', desc: 'Try our most popular flavor combinations.' },
                { title: 'Expert Artistry', desc: 'Every detail is handcrafted by our master decorators.' }
              ].map((step, i) => (
                <div key={i} className="flex items-start space-x-4 p-6 bg-pink-50/50 rounded-2xl hover:bg-pink-50 transition-colors">
                  <div className="w-10 h-10 bg-pink-600 text-white rounded-xl flex items-center justify-center font-black flex-shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{step.title}</h4>
                    <p className="text-gray-500 text-sm font-medium">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-10 lg:p-14 rounded-[3rem] shadow-2xl border border-pink-50">
            <h4 className="text-2xl font-['Outfit'] font-black text-gray-900 mb-8 uppercase tracking-tight">Request a Quote</h4>
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Your Name</label>
                  <input type="text" className="w-full bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-pink-600 rounded-xl px-4 py-3 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Event Date</label>
                  <input type="date" className="w-full bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-pink-600 rounded-xl px-4 py-3 transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Event Type</label>
                <select className="w-full bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-pink-600 rounded-xl px-4 py-3 transition-all">
                  <option>Wedding</option>
                  <option>Birthday</option>
                  <option>Corporate</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Message / Details</label>
                <textarea rows="4" className="w-full bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-pink-600 rounded-xl px-4 py-3 transition-all"></textarea>
              </div>
              <button className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-pink-600 transition-all shadow-xl">
                Send Request
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomCakes;
