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
                className="flex-shrink-0 w-[260px] bg-white rounded-[32px] border border-gray-100 overflow-hidden group flex flex-col hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(244,63,94,0.12)] transition-all duration-500 ease-out snap-start relative"
                onMouseEnter={() => setHoveredReelId(video.id)}
                onMouseLeave={() => {
                    setHoveredReelId(null);
                    setIsLocalMuted(true); // Automatically mute when leaving card
                }}
            >
                {/* Premium 9:16 Video Box */}
                <div className="relative aspect-[9/16] bg-gray-950 overflow-hidden rounded-[24px] m-3 shadow-inner">
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
                            <p className="text-white text-base md:text-lg font-['Outfit'] font-black uppercase tracking-wider drop-shadow-[0_4px_10px_rgba(0,0,0,0.95)] whitespace-pre-line leading-tight scale-95 group-hover:scale-100 transition duration-500">
                                {video.overlayText}
                            </p>
                        </div>
                    )}

                    {/* Radial dark gradient for absolute readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 opacity-80 group-hover:opacity-90 transition duration-500 pointer-events-none" />

                    {/* Floating Individual Sound Button (visible only when hovering) */}
                    {isHovered && (
                        <button
                            onClick={toggleMute}
                            className="absolute top-4 right-4 bg-black/60 backdrop-blur-md hover:bg-pink-600 border border-white/20 text-white p-2.5 rounded-full z-20 transition duration-300 transform active:scale-95 shadow-md"
                            title={isLocalMuted ? "Unmute sound" : "Mute sound"}
                        >
                            {isLocalMuted ? (
                                <VolumeX className="w-4 h-4 text-white" />
                            ) : (
                                <Volume2 className="w-4 h-4 text-white animate-pulse" />
                            )}
                        </button>
                    )}

                    {/* Centered Play Indicator (Visible when not hovered) */}
                    {!isHovered && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-lg scale-90 group-hover:scale-100 opacity-90 group-hover:opacity-100 transition duration-500">
                                <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Rich Captions Area */}
                <div className="px-5 pb-5 pt-2 flex-1 flex flex-col justify-between">
                    <div>
                        <h3 className="font-['Outfit'] font-black text-gray-900 text-sm tracking-tight uppercase group-hover:text-pink-600 transition-colors duration-300">
                            {video.title || 'Cake Delicacy'}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed font-medium">
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
        <section className="py-20 bg-gradient-to-b from-gray-50/50 to-white overflow-hidden relative">
            {/* Inline CSS to perfectly hide scrollbars across browsers */}
            <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>

            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-1.5 text-pink-600 font-['Outfit'] font-black uppercase tracking-widest text-xs">
                            <Flame className="w-4 h-4 text-pink-500 fill-pink-500 animate-pulse" />
                            <span>Instagram Hits</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-['Outfit'] font-black text-gray-950 uppercase tracking-tighter mt-3 leading-none">
                            Carlos Cake Cafe Reels
                        </h2>
                        <p className="text-gray-500 text-sm mt-2 font-medium">Hover over any card to autoplay. Click the sound icon to hear individual audio!</p>
                    </div>
                </div>

                {/* Smooth Horizontal Carousel */}
                <div className="flex gap-8 overflow-x-auto pb-8 scrollbar-hide snap-x px-2 -mx-2">
                    {reels.map((video) => (
                        <VideoCard key={video.id} video={video} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ReelsSection;
