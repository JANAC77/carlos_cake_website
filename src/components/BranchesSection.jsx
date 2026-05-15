const branches = [
  { id: 1, name: 'Munekolal', phone: '+91 81477 51838' },
  { id: 2, name: 'Marathahalli', phone: '+91 91080 80444' },
  { id: 3, name: 'Bellandur', phone: '+91 81477 51838' },
  { id: 4, name: 'Sarjapur Road', phone: '+91 98809 44843' },
  { id: 5, name: 'Electronic City', phone: '+91 63663 85588' },
];

const BranchesSection = () => {
  return (
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10">
        <div className="absolute top-1/2 left-10 w-48 h-48 bg-pink-200 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-1/4 right-10 w-64 h-64 bg-pink-100 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <h2 className="text-pink-600 font-['Outfit'] font-black uppercase tracking-[0.2em] text-[10px] mb-3 flex items-center">
              <span className="w-8 h-px bg-pink-500 mr-3"></span>
              Our Presence
            </h2>
            <h3 className="text-3xl md:text-4xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tighter leading-none">
              Visit Our <span className="text-pink-600">Sweet Spots</span>
            </h3>
          </div>
          <p className="text-gray-500 font-medium max-w-xs text-xs leading-relaxed">
            Find your nearest Carlos Cake Café and experience the magic of artisanal baking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((branch) => (
            <div 
              key={branch.id} 
              className="group relative bg-white p-6 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-100 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(236,72,153,0.08)] hover:-translate-y-2 overflow-hidden"
            >
              {/* Background Accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-pink-50 rounded-full translate-x-12 -translate-y-12 group-hover:scale-125 transition-transform duration-700"></div>

              <div className="relative z-10">
                <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:bg-pink-600 transition-colors duration-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>

                <h4 className="text-xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tight mb-2">
                  {branch.name}
                </h4>
                
                <div className="space-y-2 mb-8">
                  <div className="flex items-center space-x-2 text-red-600 font-bold tracking-widest text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{branch.phone}</span>
                  </div>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Open: 9am — 10pm</p>
                </div>

                <div className="flex items-center space-x-3">
                  <button className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-pink-600 transition-all active:scale-95">
                    Directions
                  </button>
                  <button className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center hover:bg-green-600 hover:text-white transition-all active:scale-95">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.222-4.032c1.503.893 3.129 1.364 4.791 1.365 5.279 0 9.571-4.292 9.573-9.571 0-2.559-1.011-4.965-2.847-6.802-1.837-1.837-4.242-2.847-6.801-2.847-5.278 0-9.57 4.293-9.572 9.572-.001 1.769.479 3.471 1.388 4.978l-1.082 3.951 4.051-1.062z" />
                    </svg>
                  </button>
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
