// src/components/BranchesSection.jsx - Redesigned with location card effects
const branches = [
  { id: 1, name: 'Munekolal', phone: '+91 81477 51838' },
  { id: 2, name: 'Marathahalli', phone: '+91 91080 80444' },
  { id: 3, name: 'Bellandur', phone: '+91 81477 51838' },
  { id: 4, name: 'Sarjapur Road', phone: '+91 81477 51838 ' },
  { id: 5, name: 'Electronic City', phone: '+91 63663 85588' },
];

const BranchesSection = () => {
  return (
    <section className="py-20 bg-cream-base relative overflow-hidden">
      {/* Decorative ambient blurred blobs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-10 w-64 h-64 bg-rose-gold/5 rounded-full blur-[90px]"></div>
        <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-champagne-gold/5 rounded-full blur-[110px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="text-rose-gold font-['Outfit'] font-black uppercase tracking-[0.2em] text-[10px] mb-3 flex items-center">
              <span className="w-8 h-px bg-rose-gold mr-3"></span>
              Our Presence
            </h2>
            <h3 className="text-3xl md:text-4xl font-['Outfit'] font-black text-obsidian-dark uppercase tracking-tighter leading-none">
              Visit Our <span className="text-gradient-rose-gold font-black">Sweet Spots</span>
            </h3>
          </div>
          <p className="text-gray-500 font-medium max-w-xs text-xs leading-relaxed">
            Find your nearest Carlos Cake Cafe and experience the magic of artisanal baking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {branches.map((branch) => (
            <div
              key={branch.id}
              className="group relative bg-white p-6 rounded-3xl shadow-[0_12px_32px_rgba(0,0,0,0.03)] border border-gray-100 transition-all duration-500 hover:shadow-[0_20px_45px_rgba(244,63,94,0.08)] hover:-translate-y-2 hover:border-rose-gold/25 overflow-hidden"
            >
              {/* Background Accent Gradient Circle */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-tr from-rose-gold/5 to-champagne-gold/5 rounded-full translate-x-12 -translate-y-12 group-hover:scale-125 transition-transform duration-700"></div>

              <div className="relative z-10">
                {/* Glowing Location Pin Marker */}
                <div className="w-12 h-12 bg-obsidian-dark rounded-2xl flex items-center justify-center text-white mb-6 group-hover:bg-rose-gold group-hover:shadow-premium-glow transition-all duration-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>

                <h4 className="text-xl font-['Outfit'] font-black text-obsidian-dark uppercase tracking-tight mb-2">
                  {branch.name}
                </h4>

                <div className="space-y-2 mb-8">
                  <div className="flex items-center space-x-2 text-rose-gold font-bold tracking-wider text-sm">
                    <svg className="w-4 h-4 text-rose-gold/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{branch.phone}</span>
                  </div>
                  <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest">Hours: 9:00 AM — 10:00 PM</p>
                </div>

                <div className="flex items-center space-x-3">
                  <button className="flex-1 bg-obsidian-dark text-white py-3 rounded-xl font-bold uppercase tracking-wider text-[9px] hover:bg-rose-gold hover:shadow-premium-glow transition-all duration-300 transform active:scale-95 cursor-pointer">
                    Get Directions
                  </button>
                  
                  {/* WhatsApp button */}
                  <a 
                    href={`https://wa.me/${branch.phone.replace(/\s+/g, '').replace('+', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all duration-300 transform active:scale-95 shadow-sm"
                    aria-label="Contact branch on WhatsApp"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.222-4.032c1.503.893 3.129 1.364 4.791 1.365 5.279 0 9.571-4.292 9.573-9.571 0-2.559-1.011-4.965-2.847-6.802-1.837-1.837-4.242-2.847-6.801-2.847-5.278 0-9.57 4.293-9.572 9.572-.001 1.769.479 3.471 1.388 4.978l-1.082 3.951 4.051-1.062z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BranchesSection;
