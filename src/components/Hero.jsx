// src/components/Hero.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBannersByType } from '../firebase';

const Hero = () => {
    const [banners, setBanners] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHeroBanners();
    }, []);

    const fetchHeroBanners = async () => {
        try {
            const heroBanners = await getBannersByType('hero');
            if (heroBanners && heroBanners.length > 0) {
                setBanners(heroBanners);
            } else {
                // Fallback images
                setBanners([
                    { id: 1, image: "/premium_cake_hero_1777274022400.png" },
                    { id: 2, image: "/custom_category.png" },
                    { id: 3, image: "/wedding_category.png" }
                ]);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    // Auto move every 4 seconds
    useEffect(() => {
        if (banners.length <= 1) return;
        
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % banners.length);
        }, 4000);
        
        return () => clearInterval(interval);
    }, [banners.length]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    };

    if (loading) {
        return (
            <section className="relative min-h-screen flex items-center justify-center bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
            </section>
        );
    }

    if (banners.length === 0) return null;

    const currentBanner = banners[currentIndex];

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <div 
                    className="absolute inset-0 transition-opacity duration-700"
                    style={{
                        backgroundImage: `url(${currentBanner?.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                />
                <div className="absolute inset-0 bg-black/50"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full py-20">
                <div className="max-w-2xl text-white">
                    <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-8">
                        <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">
                            Artisanal Bakery Since 2010
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-['Outfit'] font-black text-white leading-tight mb-6">
                        Baking Dreams{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-pink-100">
                            Into Reality
                        </span>
                    </h1>

                    <p className="text-base md:text-lg text-white/90 leading-relaxed mb-10 max-w-xl">
                        Every cake tells a story. We use only the finest organic ingredients and decades of artisanal expertise to make your celebrations unforgettable.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link to="/all-products" className="bg-pink-600 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-pink-700 transition-all shadow-xl transform hover:scale-105">
                            Order Now →
                        </Link>
                        <Link to="/contact" className="border-2 border-white/50 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-white/10 hover:border-white transition-all">
                            Contact Us
                        </Link>
                    </div>

                    <div className="mt-12 flex items-center space-x-8 border-t border-white/20 pt-8">
                        <div>
                            <p className="text-2xl md:text-3xl font-black text-white">15k+</p>
                            <p className="text-xs text-white/70 font-medium">Happy Clients</p>
                        </div>
                        <div className="h-6 w-px bg-white/20"></div>
                        <div>
                            <p className="text-2xl md:text-3xl font-black text-white">120+</p>
                            <p className="text-xs text-white/70 font-medium">Cake Flavors</p>
                        </div>
                        <div className="h-6 w-px bg-white/20"></div>
                        <div>
                            <p className="text-2xl md:text-3xl font-black text-white">24/7</p>
                            <p className="text-xs text-white/70 font-medium">Customer Support</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Left Arrow */}
            {banners.length > 1 && (
                <button 
                    onClick={prevSlide} 
                    className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/40 hover:scale-110 transition-all z-20"
                >
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            )}

            {/* Right Arrow */}
            {banners.length > 1 && (
                <button 
                    onClick={nextSlide} 
                    className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/40 hover:scale-110 transition-all z-20"
                >
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            )}

            {/* Dots */}
            {banners.length > 1 && (
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`transition-all duration-300 rounded-full ${
                                currentIndex === index
                                    ? 'w-8 h-2 bg-white'
                                    : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                            }`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default Hero;