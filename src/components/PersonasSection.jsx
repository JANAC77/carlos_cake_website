const personas = [
  {
    id: 1,
    title: 'Cakes For',
    target: 'Kids',
    image: '/custom_category.png',
    bg: 'bg-orange-50'
  },
  {
    id: 2,
    title: 'Cakes For',
    target: 'HER',
    image: '/wedding_category.png',
    bg: 'bg-pink-50'
  },
  {
    id: 3,
    title: 'Cakes For',
    target: 'HIM',
    image: '/chocolate_truffle_cake_1777274037721.png',
    bg: 'bg-gray-50'
  }
];

const PersonasSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="mb-16">
          <h2 className="text-3xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tight mb-2">Choose Their Cake</h2>
          <p className="text-gray-400 font-medium text-sm md:text-base tracking-wide">Made to match their personality</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {personas.map((persona) => (
            <div key={persona.id} className="group cursor-pointer">
              {/* Image Container */}
              <div className={`relative aspect-[4/3] ${persona.bg} overflow-hidden rounded-[2.5rem] shadow-lg group-hover:shadow-2xl transition-all duration-700 mb-8`}>
                <img 
                  src={persona.image} 
                  alt={persona.target} 
                  className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-110"
                />
              </div>
              
              {/* Text Under Photo */}
              <div className="text-center">
                <h3 className="text-gray-500 font-['Outfit'] font-bold text-sm uppercase tracking-widest mb-1">
                  {persona.title}
                </h3>
                <span className="text-gray-900 font-['Outfit'] font-black text-4xl uppercase tracking-tighter group-hover:text-pink-600 transition-colors">
                  {persona.target}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PersonasSection;
