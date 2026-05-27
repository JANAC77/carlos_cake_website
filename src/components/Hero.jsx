// src/components/Hero.jsx - Redesigned with premium text gradients & glassmorphism
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
                    { id: 1, image: "/cropped_banner_wide1.png", title: "Freshly Baked Cakes", description: "Hand-crafted with love, delivered straight to your door." },
                    { id: 2, image: "/cropped_banner_wide2.png", title: "Signature Flavors", description: "Indulge in our collection of award-winning cakes and delicacies." }
                ]);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    // Auto move every 5 seconds
    useEffect(() => {
        if (banners.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % banners.length);
        }, 5000);

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
            <section className="relative h-[250px] sm:h-[350px] md:h-[450px] flex items-center justify-center bg-gray-50 max-w-7xl mx-auto rounded-[32px] overflow-hidden my-6">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-rose-gold border-t-transparent"></div>
            </section>
        );
    }

    if (banners.length === 0) return null;

    const currentBanner = banners[currentIndex];

    return (
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 mb-8">
            <div className="relative h-[220px] sm:h-[320px] md:h-[420px] lg:h-[460px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl group border border-white/10">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src={currentBanner?.image} 
                        alt={currentBanner?.title}
                        className="w-full h-full object-cover block transition-transform duration-[2000ms] ease-out group-hover:scale-105"
                        onError={(e) => { e.target.src = '/placeholder.png'; }}
                    />
                    {/* Radial dark gradient for superior contrast */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent z-1"></div>
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 h-full flex items-center px-6 sm:px-12 md:px-16 lg:px-24">
                    <div className="max-w-xl text-white">
                        {/* Glassmorphic Badge */}
                        <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 mb-4 shadow-sm animate-fade-in">
                            <span className="w-2 h-2 rounded-full bg-rose-gold animate-pulse"></span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/95">Signature Bakehouse</span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-['Outfit'] font-black text-white mb-3 tracking-tight drop-shadow-md">
                            {currentBanner?.title === "Freshly Baked Cakes" ? (
                                <>
                                    Freshly <span className="text-transparent bg-gradient-to-r from-rose-gold via-[#FF758F] to-champagne-gold-light bg-clip-text">Baked</span> Cakes
                                </>
                            ) : (
                                currentBanner?.title || "Freshly Baked Cakes"
                            )}
                        </h2>

                        <p className="text-xs sm:text-sm md:text-base text-white/80 font-medium mb-6 line-clamp-2 sm:line-clamp-3 leading-relaxed drop-shadow-sm max-w-md">
                            {currentBanner?.description || currentBanner?.subtitle || "Hand-crafted with love, delivered straight to your door."}
                        </p>

                        <div className="flex flex-wrap gap-4 items-center">
                            <Link 
                                to={currentBanner?.ctaLink || "/all-products"} 
                                className="btn-premium bg-gradient-to-r from-rose-gold to-champagne-gold hover:from-rose-gold-hover hover:to-champagne-gold shadow-premium-glow hover:shadow-[0_12px_24px_rgba(244,63,94,0.35)] hover:-translate-y-0.5 text-white px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-2xl font-bold uppercase tracking-wider text-[10px] sm:text-xs transition-all duration-300 transform active:scale-95 cursor-pointer"
                            >
                                Browse Collections
                            </Link>
                            
                            <Link
                                to="/menu"
                                className="hidden sm:inline-block bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/25 hover:border-white/40 text-white px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-2xl font-bold uppercase tracking-wider text-[10px] sm:text-xs transition-all duration-300 transform active:scale-95 cursor-pointer"
                            >
                                View Menu
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Left Arrow - Redesigned with glassmorphic circles */}
                {banners.length > 1 && (
                    <button 
                        onClick={prevSlide} 
                        className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center hover:scale-105 transition-all z-20 text-white/95 cursor-pointer shadow-lg opacity-0 group-hover:opacity-100"
                        aria-label="Previous slide"
                    >
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                )}

                {/* Right Arrow - Redesigned with glassmorphic circles */}
                {banners.length > 1 && (
                    <button 
                        onClick={nextSlide} 
                        className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center hover:scale-105 transition-all z-20 text-white/95 cursor-pointer shadow-lg opacity-0 group-hover:opacity-100"
                        aria-label="Next slide"
                    >
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                )}

                {/* Slider bar indicators */}
                {banners.length > 1 && (
                    <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
                        {banners.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`transition-all duration-500 rounded-full cursor-pointer h-1.5 ${currentIndex === index
                                    ? 'w-10 bg-gradient-to-r from-rose-gold to-champagne-gold shadow-md'
                                    : 'w-2 bg-white/40 hover:bg-white/70'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Hero;