// src/components/CelebrationSection.jsx - Redesigned with glass panels & elegant text
const CelebrationSection = () => {
  return (
    <section className="py-20 bg-white overflow-hidden relative">
      {/* Decorative ambient gradients */}
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-rose-gold/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex flex-col lg:flex-row items-center">
          {/* Glassmorphic Content Box */}
          <div className="lg:absolute lg:left-0 z-20 glass-panel-light p-8 sm:p-12 lg:p-16 rounded-[2.5rem] shadow-2xl max-w-xl transform lg:-translate-x-6 mb-8 lg:mb-0 border border-white">
            <div className="inline-flex items-center space-x-2 bg-rose-gold/10 px-3 py-1 rounded-full border border-rose-gold/25 mb-4">
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-gold">Custom Orders</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-['Outfit'] font-black text-obsidian-dark mb-1 uppercase tracking-tight">
              Life is worth
            </h2>
            <h3 className="text-5xl md:text-6xl font-['Outfit'] font-black text-rose-gold mb-6 leading-none uppercase tracking-tighter text-gradient-rose-gold">
              celebrating!
            </h3>
            
            <p className="text-base font-bold text-gray-800 mb-4">
              At Carlos Cakes, we want to celebrate with you!
            </p>
            
            <p className="text-gray-500 leading-relaxed text-sm font-semibold tracking-wide font-['Outfit']">
              Whether you are wanting something sweet for your wedding, a birthday, a co-worker's retirement, or your child's graduation, we can customize any cake, cookies, and cupcakes to match your events perfectly.
            </p>
          </div>

          {/* Image Section with Zoom Hover */}
          <div className="w-full lg:w-2/3 lg:ml-auto rounded-[2.5rem] overflow-hidden shadow-2xl z-10 group/img border border-gray-100">
            <img 
              src="/dessert_table_display.png" 
              alt="Dessert Table Display" 
              className="w-full h-full object-cover min-h-[350px] sm:min-h-[400px] max-h-[500px] transition-transform duration-[1500ms] group-hover/img:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CelebrationSection;
