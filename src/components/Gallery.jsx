const galleryImages = [
  { id: 1, title: 'Wedding Masterpiece', category: 'Wedding', image: '/wedding_category.png' },
  { id: 2, title: 'Fruit Delight', category: 'Fresh Fruit', image: '/cupcakes_category.png' },
  { id: 3, title: 'Chocolate Heaven', category: 'Chocolate', image: '/chocolate_truffle_cake_1777274037721.png' },
  { id: 4, title: 'Custom Kids Cake', category: 'Kids', image: '/custom_category.png' },
  { id: 5, title: 'Berry Chantilly', category: 'Signature', image: '/berry_chantilly_cake_1777274053963.png' },
  { id: 6, title: 'Dessert Table', category: 'Events', image: '/dessert_table_display.png' },
];

const Gallery = () => {
  return (
    <div className="bg-white min-h-screen pt-40 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-24">
          <h2 className="text-pink-600 font-['Outfit'] font-black uppercase tracking-[0.3em] text-xs mb-4">Our Portfolio</h2>
          <h1 className="text-5xl md:text-7xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tighter mb-8 leading-none">
            The Gallery of <br /> Sweet Creations
          </h1>
          <p className="text-gray-500 font-medium tracking-widest uppercase text-sm">Visual inspiration for your next celebration</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryImages.map((img) => (
            <div key={img.id} className="group relative aspect-[4/5] overflow-hidden rounded-[3rem] bg-gray-100 cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-700">
              <img 
                src={img.image} 
                alt={img.title} 
                className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-10">
                <span className="text-pink-500 font-black uppercase tracking-[0.2em] text-[10px] mb-2">{img.category}</span>
                <h3 className="text-2xl font-['Outfit'] font-black text-white uppercase tracking-tight">{img.title}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 text-center">
          <div className="inline-flex flex-col items-center">
             <p className="text-gray-400 font-medium mb-6">Need a custom design for your event?</p>
             <button className="bg-gray-900 text-white px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest text-sm hover:bg-pink-600 transition-all shadow-xl active:scale-95">
               Contact Our Designers
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
