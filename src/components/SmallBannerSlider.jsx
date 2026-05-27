// src/components/SmallBannerSlider.jsx - Redesigned with glass badges & hover layouts
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBannersByType } from '../firebase';

const SmallBannerSlider = () => {
    const [banners, setBanners] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSmallBanners();
    }, []);

    const fetchSmallBanners = async () => {
        try {
            const smallBanners = await getBannersByType('small');
            if (smallBanners && smallBanners.length > 0) {
                setBanners(smallBanners);
            } else {
                setBanners([
                    { id: 1, image: "/cropped_banner1.png", title: "Sharing Happiness", subtitle: "Handcrafted cakes for special moments", ctaLink: "/contact" },
                    { id: 2, image: "/cropped_banner2.png", title: "Grand Opening", subtitle: "Order now & receive special desserts", ctaLink: "/menu" },
                    { id: 3, image: "/cropped_banner3.png", title: "Signature Treats", subtitle: "Delightful pastries and fresh cupcakes", ctaLink: "/all-products" }
                ]);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (banners.length <= 3) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [banners.length]);

    const getVisibleImages = () => {
        if (banners.length <= 3) return banners;
        const visible = [];
        for (let i = 0; i < 3; i++) {
            const idx = (currentIndex + i) % banners.length;
            visible.push(banners[idx]);
        }
        return visible;
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
    };

    if (loading) {
        return (
            <div className="py-12 bg-cream-base flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-rose-gold border-t-transparent"></div>
            </div>
        );
    }

    const visibleImages = getVisibleImages();

    return (
        <section className="pt-6 pb-4 bg-gradient-to-b from-cream-base to-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative group">
                    {/* Left Arrow - Glassmorphic */}
                    {banners.length > 3 && (
                        <button
                            onClick={prevSlide}
                            className="absolute -left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/70 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center hover:bg-rose-gold hover:text-white border border-white/40 transition-all duration-300 opacity-0 group-hover:opacity-100 cursor-pointer"
                            aria-label="Previous slide"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}

                    {/* Right Arrow - Glassmorphic */}
                    {banners.length > 3 && (
                        <button
                            onClick={nextSlide}
                            className="absolute -right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/70 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center hover:bg-rose-gold hover:text-white border border-white/40 transition-all duration-300 opacity-0 group-hover:opacity-100 cursor-pointer"
                            aria-label="Next slide"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}

                    {/* 3 Images Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {visibleImages.map((banner, idx) => (
                            <Link
                                key={`${banner.id}-${currentIndex}-${idx}`}
                                to={banner.ctaLink || '/menu'}
                                className="group/card relative overflow-hidden rounded-[2rem] shadow-md hover:shadow-xl border border-white/40 transition-all duration-500 transform hover:-translate-y-1.5 flex flex-col bg-white"
                            >
                                {/* Image Container */}
                                <div className="relative h-56 sm:h-64 md:h-72 overflow-hidden">
                                    <img
                                        src={banner.image}
                                        alt={banner.title}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-105"
                                        onError={(e) => { e.target.src = '/placeholder.png'; }}
                                    />

                                    {/* Subtle Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent"></div>

                                    {/* Floating Glassmorphic Badge Overlay */}
                                    {banner.title && (
                                        <div className="absolute bottom-4 left-4 right-4 p-4 glass-panel-light rounded-2xl border border-white/40 shadow-lg transform translate-y-2 group-hover/card:translate-y-0 transition-all duration-500">
                                            <h4 className="text-xs font-['Outfit'] font-black uppercase text-rose-gold tracking-wider">{banner.title}</h4>
                                            <p className="text-[10px] text-gray-800 font-bold truncate mt-0.5">{banner.subtitle}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Hover shine highlight */}
                                <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 pointer-events-none">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-full group-hover/card:-translate-x-full transition-transform duration-1000"></div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Dots Indicator */}
                    {banners.length > 3 && (
                        <div className="flex justify-center gap-2 mt-8">
                            {banners.map((_, idx) => {
                                const isActive = idx >= currentIndex && idx < currentIndex + 3;
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentIndex(idx)}
                                        className={`transition-all duration-500 h-1.5 rounded-full cursor-pointer ${isActive
                                            ? 'w-8 bg-rose-gold shadow-sm'
                                            : 'w-2 bg-gray-200 hover:bg-gray-300'
                                            }`}
                                        aria-label={`Go to slide ${idx + 1}`}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default SmallBannerSlider;