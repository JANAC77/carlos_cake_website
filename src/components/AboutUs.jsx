// components/AboutUs.jsx
import { Link } from 'react-router-dom';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white pt-40 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tighter mb-6">
            About Carlos Cake Cafe
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Crafting sweet memories since 2010 with passion, quality, and love
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          <div>
            <h2 className="text-3xl font-['Outfit'] font-black text-gray-900 mb-6 uppercase tracking-tight">
              Our Sweet Journey
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Carlos Cake Cafe started with a simple dream - to create cakes that don't just taste delicious but also become the centerpiece of every celebration. What began as a small home bakery has now grown into a beloved dessert destination across Bangalore.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our journey has been sweetened by thousands of satisfied customers who trust us to make their special moments even more memorable. From intimate birthday parties to grand wedding celebrations, we've had the privilege of being part of countless happy occasions.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Today, we continue to innovate and elevate the art of cake making, using only the finest ingredients and most creative designs to bring your vision to life.
            </p>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-pink-100 rounded-[2rem] -rotate-3"></div>
            <img 
              src="/premium_cake_hero_1777274022400.png" 
              alt="Our Story" 
              className="relative z-10 w-full h-full object-cover rounded-2xl shadow-xl"
            />
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-gray-50 rounded-3xl p-12 mb-24">
          <h2 className="text-3xl font-['Outfit'] font-black text-center text-gray-900 uppercase tracking-tight mb-12">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Quality First</h3>
              <p className="text-gray-500 text-sm">Using only premium, fresh ingredients in every creation</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v13m0-13V6m0 2l4 4m-4-4l-4 4" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Innovation</h3>
              <p className="text-gray-500 text-sm">Constantly evolving with new flavors and designs</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Customer Love</h3>
              <p className="text-gray-500 text-sm">Every customer is treated like family</p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center">
          <h2 className="text-3xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tight mb-6">
            Meet Our Master Bakers
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto mb-12">
            Behind every delicious cake is a team of passionate artisans who pour their heart into every creation
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Carlos Rodriguez', role: 'Founder & Head Baker', image: '/chef_avatar.png' },
              { name: 'Priya Sharma', role: 'Lead Designer', image: '/chef_avatar_female.png' },
              { name: 'Rajesh Kumar', role: 'Master Decorator', image: '/chef_avatar.png' }
            ].map((chef, idx) => (
              <div key={idx} className="group">
                <div className="w-40 h-40 mx-auto bg-gray-200 rounded-full overflow-hidden mb-4 mx-auto group-hover:scale-105 transition-transform duration-500">
                  <div className="w-full h-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white text-4xl font-bold">
                    {chef.name.charAt(0)}
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 text-lg">{chef.name}</h3>
                <p className="text-pink-600 text-sm">{chef.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 bg-pink-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-['Outfit'] font-black uppercase tracking-tight mb-4">
            Ready to Celebrate With Us?
          </h2>
          <p className="mb-8 opacity-90">Order your dream cake today and make your celebration unforgettable</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/menu" className="bg-white text-pink-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-all">
              Explore Menu
            </Link>
            <Link to="/contact" className="border border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white/10 transition-all">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;