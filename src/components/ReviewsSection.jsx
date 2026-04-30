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
    <section className="py-24 bg-gray-50/50 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-100/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-pink-600 font-['Outfit'] font-black uppercase tracking-[0.3em] text-xs mb-4">Testimonials</h2>
          <h3 className="text-4xl md:text-5xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tighter">
            What Our Sweet <br /> Clients Say
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-10 rounded-[3rem] shadow-xl shadow-pink-100/20 border border-white hover:-translate-y-2 transition-all duration-500 group">
              {/* Stars */}
              <div className="flex space-x-1 mb-8 text-yellow-400">
                {[...Array(review.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-600 text-lg leading-relaxed mb-10 font-medium italic">
                "{review.text}"
              </p>

              {/* Author */}
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <img 
                    src={review.image} 
                    alt={review.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-['Outfit'] font-black text-gray-900 uppercase tracking-tight">{review.name}</h4>
                  <p className="text-pink-500 text-[10px] font-black uppercase tracking-[0.2em]">{review.role}</p>
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
