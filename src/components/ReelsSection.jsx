// src/components/ReelsSection.jsx - Redesigned with premium dark glass cards
import { useState, useEffect, useRef } from 'react';
import { Play, Volume2, VolumeX, Flame } from 'lucide-react';

const ReelsSection = () => {
    const [reels, setReels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredReelId, setHoveredReelId] = useState(null);

    const API_BASE_URL = 'https://carlos-cake-admin.onrender.com';

    useEffect(() => {
        const fetchReels = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/videos`);
                const data = await response.json();
                if (data.success) {
                    // Filter for vertical reels only
                    const filtered = data.videos.filter(v => v.type === 'reel');
                    const sanitized = filtered.map(v => ({
                        ...v,
                        url: v.url && v.url.startsWith('true/')
                            ? v.url.replace('true/', 'https://carlos-cake-admin.onrender.com/')
                            : v.url
                    }));
                    setReels(sanitized);
                }
            } catch (error) {
                console.error("Error fetching reels:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReels();
    }, [API_BASE_URL]);

    // Individual video element controller with private local sound toggle
    const VideoCard = ({ video }) => {
        const videoRef = useRef(null);
        const isHovered = hoveredReelId === video.id;
        const [isLocalMuted, setIsLocalMuted] = useState(true);

        useEffect(() => {
            if (videoRef.current) {
                if (isHovered) {
                    videoRef.current.play().catch(err => console.log("Play interrupted:", err));
                } else {
                    videoRef.current.pause();
                    videoRef.current.currentTime = 0;
                }
            }
        }, [isHovered]);

        const toggleMute = (e) => {
            e.stopPropagation(); // Stop hovering triggers or card actions
            setIsLocalMuted(!isLocalMuted);
        };

        return (
            <div
                className="flex-shrink-0 w-[250px] sm:w-[260px] glass-panel-dark border border-white/5 rounded-[2.5rem] overflow-hidden group flex flex-col hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(244,63,94,0.18)] transition-all duration-500 ease-out snap-start relative bg-[#1A1616]"
                onMouseEnter={() => setHoveredReelId(video.id)}
                onMouseLeave={() => {
                    setHoveredReelId(null);
                    setIsLocalMuted(true); // Automatically mute when leaving card
                }}
            >
                {/* Premium 9:16 Video Box */}
                <div className="relative aspect-[9/16] bg-black/40 overflow-hidden rounded-[2rem] m-3 shadow-inner">
                    <video
                        ref={videoRef}
                        src={video.url}
                        className="w-full h-full object-cover"
                        loop
                        muted={isLocalMuted}
                        playsInline
                    />

                    {/* High-contrast centered overlay text */}
                    {video.overlayText && (
                        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 text-center pointer-events-none z-10 px-2">
                            <p className="text-white text-sm md:text-base font-['Outfit'] font-black uppercase tracking-wider drop-shadow-[0_4px_10px_rgba(0,0,0,0.95)] whitespace-pre-line leading-tight scale-95 group-hover:scale-100 transition duration-500">
                                {video.overlayText}
                            </p>
                        </div>
                    )}

                    {/* Radial dark gradient for absolute readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70 opacity-80 group-hover:opacity-95 transition duration-500 pointer-events-none" />

                    {/* Floating Individual Sound Button */}
                    {isHovered && (
                        <button
                            onClick={toggleMute}
                            className="absolute top-4 right-4 bg-black/60 backdrop-blur-md hover:bg-rose-gold border border-white/20 text-white p-2.5 rounded-full z-20 transition duration-300 transform active:scale-95 shadow-md cursor-pointer"
                            title={isLocalMuted ? "Unmute sound" : "Mute sound"}
                        >
                            {isLocalMuted ? (
                                <VolumeX className="w-3.5 h-3.5 text-white" />
                            ) : (
                                <Volume2 className="w-3.5 h-3.5 text-white animate-pulse" />
                            )}
                        </button>
                    )}

                    {/* Centered Play Indicator */}
                    {!isHovered && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-lg scale-90 group-hover:scale-100 opacity-90 group-hover:opacity-100 transition duration-500">
                                <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Rich Captions Area */}
                <div className="px-5 pb-5 pt-1.5 flex-1 flex flex-col justify-between">
                    <div>
                        <h3 className="font-['Outfit'] font-black text-white text-xs uppercase tracking-wider group-hover:text-rose-gold transition-colors duration-300">
                            {video.title || 'Cake Delicacy'}
                        </h3>
                        <p className="text-[10px] text-gray-400 mt-1 line-clamp-2 leading-relaxed font-semibold">
                            {video.description || 'Carlos Café artisanal handmade recipe.'}
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) return null;
    if (reels.length === 0) return null;

    return (
        <section className="py-20 bg-gradient-to-b from-white to-[#1C1917] overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-1.5 text-rose-gold font-['Outfit'] font-black uppercase tracking-widest text-[10px]">
                            <Flame className="w-4 h-4 text-rose-gold fill-rose-gold animate-pulse" />
                            <span>Instagram Hits</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-['Outfit'] font-black text-white uppercase tracking-tighter mt-3 leading-none">
                            Carlos Cafe <span className="text-transparent bg-gradient-to-r from-rose-gold via-[#FF758F] to-champagne-gold-light bg-clip-text">Reels</span>
                        </h2>
                        <p className="text-gray-400 text-xs mt-2 font-semibold tracking-wide">
                            Hover over any card to autoplay. Click the sound icon to hear individual audio!
                        </p>
                    </div>
                </div>

                {/* Smooth Horizontal Carousel */}
                <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar snap-x px-2 -mx-2">
                    {reels.map((video) => (
                        <VideoCard key={video.id} video={video} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ReelsSection;
