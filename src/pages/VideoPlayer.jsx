import React, { useState, useEffect, useRef } from 'react';
import { Play, Maximize, VolumeX, AlertCircle } from 'lucide-react';
import './VideoPlayer.css';

const VideoPlayer = () => {
    const [playlist, setPlaylist] = useState([]);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [needsInteraction, setNeedsInteraction] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {
        const savedPlaylist = localStorage.getItem('playlist');
        if (savedPlaylist) {
            setPlaylist(JSON.parse(savedPlaylist));
        }
    }, []);

    const handleVideoEnd = () => {
        if (playlist.length > 0) {
            setCurrentVideoIndex((prev) => (prev + 1) % playlist.length);
        }
    };

    const startPlayback = () => {
        if (videoRef.current) {
            videoRef.current.play()
                .then(() => {
                    setIsPlaying(true);
                    setNeedsInteraction(false);
                })
                .catch(err => {
                    console.error("Playback failed:", err);
                    setNeedsInteraction(true);
                });
        }
    };

    useEffect(() => {
        if (playlist.length > 0) {
            // Short delay to ensure video element is ready
            const timer = setTimeout(() => {
                startPlayback();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [currentVideoIndex, playlist]);

    if (playlist.length === 0) {
        return (
            <div className="player-fullscreen placeholder-screen">
                <div className="player-status glass">
                    <AlertCircle size={48} color="var(--primary)" />
                    <h2>Playlist Vazia</h2>
                    <p>Configure a ordem de exibição no Painel Administrativo.</p>
                </div>
            </div>
        );
    }

    const currentVideo = playlist[currentVideoIndex];
    // Use the URL from the video object, fallback to placeholder IF none exists
    const videoUrl = currentVideo.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-city-traffic-at-night-seen-from-above-41005-large.mp4';

    return (
        <div className="player-fullscreen">
            <video
                ref={videoRef}
                key={currentVideo.id + videoUrl}
                src={videoUrl}
                onEnded={handleVideoEnd}
                muted
                autoPlay
                playsInline
                className="full-video"
                onError={(e) => {
                    console.error("Video error:", e);
                    // Auto-skip if video fails
                    setTimeout(handleVideoEnd, 3000);
                }}
            />

            {needsInteraction && (
                <div className="interaction-overlay glass" onClick={startPlayback}>
                    <Play size={64} fill="white" />
                    <p>Toque para Iniciar a Reprodução</p>
                </div>
            )}

            <div className="player-overlay">
                <div className="brand-dot"></div>
                <span className="live-tag">EXIBINDO: {currentVideo.videoName}</span>
            </div>

            <div className="client-brand">
                Anunciante: {currentVideo.name}
            </div>
        </div>
    );
};

export default VideoPlayer;
