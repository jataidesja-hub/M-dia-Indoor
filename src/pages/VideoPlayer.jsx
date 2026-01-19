import React, { useState, useEffect, useRef } from 'react';
import './VideoPlayer.css';

const VideoPlayer = () => {
    const [currentVideo, setCurrentVideo] = useState(0);
    const videoRef = useRef(null);

    // Mock playlist
    const playlist = [
        { id: 1, url: 'https://assets.mixkit.co/videos/preview/mixkit-city-traffic-at-night-seen-from-above-41005-large.mp4' },
        { id: 2, url: 'https://assets.mixkit.co/videos/preview/mixkit-modern-architecture-building-with-glass-facade-41008-large.mp4' }
    ];

    const handleVideoEnd = () => {
        setCurrentVideo((prev) => (prev + 1) % playlist.length);
    };

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(error => {
                console.log("Autoplay prevented. User interaction might be needed.");
            });
        }
    }, [currentVideo]);

    return (
        <div className="player-fullscreen">
            <video
                ref={videoRef}
                src={playlist[currentVideo].url}
                onEnded={handleVideoEnd}
                muted
                playsInline
                className="full-video"
            />

            {/* Overlay for Tablet Info or Branding (Optional/Subtle) */}
            <div className="player-overlay">
                <div className="brand-dot"></div>
                <span className="live-tag">LIVE</span>
            </div>
        </div>
    );
};

export default VideoPlayer;
