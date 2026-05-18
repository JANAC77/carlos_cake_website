// src/components/SmallBannerSlider.jsx
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
                    { id: 1, image: "/cropped_banner1.png", title: "Sharing Happiness", subtitle: "Celebrating the journey of sharing happiness with you", ctaLink: "/contact" },
                    { id: 2, image: "/cropped_banner2.png", title: "Grand Opening", subtitle: "Buy 1 Get 1 Free - Grand Opening", ctaLink: "/menu" },
                    { id: 3, image: "/cropped_banner3.png", title: "Sharing Happiness", subtitle: "Celebrating the journey of sharing happiness with you", ctaLink: "/contact" }
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
        }, 4000);
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
            <div className="py-12 bg-gradient-to-r from-pink-50 to-white">
                <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-pink-500 border-t-transparent"></div>
                </div>
            </div>
        );
    }

    const visibleImages = getVisibleImages();

    return (
        <section className="pt-6 pb-2 bg-gradient-to-r from-pink-50 via-white to-rose-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                {/* Header Section */}

                <div className="relative group">
                    {/* Left Arrow */}
                    {banners.length > 3 && (
                        <button
                            onClick={prevSlide}
                            className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}

                    {/* Right Arrow */}
                    {banners.length > 3 && (
                        <button
                            onClick={nextSlide}
                            className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}

                    {/* 3 Images Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {visibleImages.map((banner, idx) => (
                            <Link
                                key={`${banner.id}-${currentIndex}-${idx}`}
                                to={banner.ctaLink || '/menu'}
                                className="group/card relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                            >
                                {/* Image Container */}
                                <div className="relative h-64 md:h-72 overflow-hidden bg-gradient-to-br from-pink-100 to-rose-100">
                                    <img
                                        src={banner.image}
                                        alt={banner.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                                        onError={(e) => { e.target.src = '/placeholder.png'; }}
                                    />

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>




                                </div>

                                {/* Shine Effect on Hover */}
                                <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 pointer-events-none">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover/card:-translate-x-full transition-transform duration-1000"></div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Dots Indicator */}
                    {banners.length > 3 && (
                        <div className="flex justify-center gap-3 mt-10">
                            {banners.map((_, idx) => {
                                const isActive = idx >= currentIndex && idx < currentIndex + 3;
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentIndex(idx)}
                                        className={`transition-all duration-300 rounded-full ${isActive
                                            ? 'w-8 h-2 bg-pink-500 shadow-md'
                                            : 'w-2 h-2 bg-gray-300 hover:bg-pink-400'
                                            }`}
                                        aria-label={`Go to slide ${idx + 1}`}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>


            </div>

            {/* Custom Styles */}
            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .group/card {
                    animation: fadeInUp 0.6s ease-out forwards;
                    animation-delay: calc(var(--delay, 0) * 0.1s);
                }
                .group/card:nth-child(1) { --delay: 1; }
                .group/card:nth-child(2) { --delay: 2; }
                .group/card:nth-child(3) { --delay: 3; }
            `}</style>
        </section>
    );
};

export default SmallBannerSlider;