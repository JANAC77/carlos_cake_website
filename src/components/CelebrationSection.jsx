const CelebrationSection = () => {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="relative flex flex-col lg:flex-row items-center">
          {/* Content Box */}
          <div className="lg:absolute lg:left-0 z-20 bg-[#F5F3EF] p-10 lg:p-14 rounded-[2.5rem] shadow-xl max-w-xl transform lg:-translate-x-8 mb-12 lg:mb-0">
            <h2 className="text-3xl md:text-4xl font-['Outfit'] font-black text-gray-900 mb-1 uppercase tracking-tight">Life is worth</h2>
            <h3 className="text-5xl md:text-6xl font-['Outfit'] font-black text-pink-600 mb-6 leading-none uppercase tracking-tighter">celebrating!</h3>
            
            <p className="text-base font-bold text-gray-800 mb-4">At Carlos Cakes, we want to celebrate with you!</p>
            
            <p className="text-gray-600 leading-relaxed text-sm font-medium font-['Outfit']">
              Whether you are wanting something sweet for your wedding, a birthday, a co-worker's retirement, or your child's graduation we can customize any cake, cookies, and cupcakes to match your events.
            </p>
          </div>

          {/* Image Section */}
          <div className="w-full lg:w-2/3 lg:ml-auto rounded-[2.5rem] overflow-hidden shadow-xl z-10">
            <img 
              src="/dessert_table_display.png" 
              alt="Dessert Table Display" 
              className="w-full h-full object-cover min-h-[400px] max-h-[500px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CelebrationSection;
