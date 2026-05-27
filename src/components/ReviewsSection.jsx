// src/components/ReviewsSection.jsx - Redesigned with premium testimonial glass cards
const reviews = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    role: 'Wedding Client',
    text: "The Royal Gold Wedding cake was not just a dessert, it was a masterpiece. Every guest was asking where we got it. Thank you, Carlos!",
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150'
  },
  {
    id: 2,
    name: 'David Chen',
    role: 'Birthday Celebration',
    text: "Ordered the Midnight Chocolate for my son's 10th birthday. It was rich, moist, and absolutely delicious. The best chocolate cake in the city!",
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150'
  },
  {
    id: 3,
    name: 'Emma Thompson',
    role: 'Regular Customer',
    text: "I come here every week for cupcakes. The variety and quality are consistently amazing. Highly recommend the Wild Berry Chantilly!",
    rating: 5,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150'
  }
];

const ReviewsSection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-cream-base relative overflow-hidden">
      {/* Decorative ambient blurred blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose-gold/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-champagne-gold/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-6 h-px bg-rose-gold"></span>
            <p className="text-rose-gold font-['Outfit'] font-black uppercase tracking-[0.25em] text-[10px]">Testimonials</p>
            <span className="w-6 h-px bg-rose-gold"></span>
          </div>
          <h3 className="text-3xl md:text-5xl font-['Outfit'] font-black text-obsidian-dark uppercase tracking-tighter">
            What Our <span className="text-gradient-rose-gold font-black">Sweet Clients</span> Say
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div 
              key={review.id} 
              className="glass-panel-light p-8 sm:p-10 rounded-[2.5rem] shadow-xl border border-white hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(244,63,94,0.06)] hover:border-rose-gold/15 transition-all duration-500 group flex flex-col justify-between"
            >
              <div>
                {/* Stars - Elegant Gold color */}
                <div className="flex space-x-1 mb-6 text-champagne-gold-light">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg key={i} className="w-4.5 h-4.5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-gray-600 text-base leading-relaxed mb-8 font-medium italic">
                  "{review.text}"
                </p>
              </div>

              {/* Author Row */}
              <div className="flex items-center space-x-4 border-t border-gray-100/55 pt-6">
                <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-md border border-white group-hover:scale-105 transition-transform duration-500 flex-shrink-0">
                  <img 
                    src={review.image} 
                    alt={review.name} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="font-['Outfit'] font-black text-obsidian-dark uppercase tracking-tight text-sm truncate">{review.name}</h4>
                  <p className="text-rose-gold text-[9px] font-black uppercase tracking-widest mt-0.5">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
