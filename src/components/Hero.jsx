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
                    { id: 1, image: "/cropped_banner_wide1.png" },
                    { id: 2, image: "/cropped_banner_wide2.png" }
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
        <section className="relative max-w-7xl mx-auto px-6 lg:px-12 mt-2 mb-6">
            <div className="relative aspect-[16/7] md:aspect-[1024/250] w-full rounded-[32px] overflow-hidden shadow-lg group">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <div 
                        className="absolute inset-0 transition-all duration-700 ease-in-out transform hover:scale-102"
                        style={{
                            backgroundImage: `url(${currentBanner?.image})`,
                            backgroundSize: '100% 100%',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                        }}
                    />
                    {/* Semi-transparent dark overlay for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex items-center px-8 sm:px-12 md:px-16 lg:px-20">
                    <div className="max-w-xl text-white">
                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-['Outfit'] font-black text-white mb-2 drop-shadow-md">
                            {currentBanner?.title || "Slide 1 Heading"}
                        </h2>

                        <p className="text-[10px] sm:text-xs md:text-sm text-white/90 font-medium mb-4 line-clamp-2 sm:line-clamp-3 leading-relaxed drop-shadow-sm max-w-md">
                            {currentBanner?.description || currentBanner?.subtitle || "Lorem ipsum dolor sit amet. We delivered best cake and our love with the cake."}
                        </p>

                        <Link 
                            to={currentBanner?.ctaLink || "/all-products"} 
                            className="inline-block border border-white hover:bg-white hover:text-gray-900 text-white px-4 py-1.5 sm:px-6 sm:py-2.5 rounded-xl font-bold tracking-wider text-xs sm:text-sm transition-all duration-300 transform active:scale-95 shadow-md cursor-pointer"
                        >
                            Click Here
                        </Link>
                    </div>
                </div>

                {/* Left Arrow */}
                {banners.length > 1 && (
                    <button 
                        onClick={prevSlide} 
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/40 hover:scale-110 transition-all z-20 text-white/80 hover:text-white cursor-pointer"
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
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/40 hover:scale-110 transition-all z-20 text-white/80 hover:text-white cursor-pointer"
                    >
                        <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                )}

                {/* Dots */}
                {banners.length > 1 && (
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-20">
                        {banners.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`transition-all duration-300 rounded-full ${currentIndex === index
                                    ? 'w-6 h-1.5 bg-white'
                                    : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/85'
                                    }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Hero;