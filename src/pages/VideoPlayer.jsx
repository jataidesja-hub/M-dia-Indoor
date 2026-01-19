import React, { useState, useEffect, useRef } from 'react';
import './VideoPlayer.css';

const VideoPlayer = () => {
    const [playlist, setPlaylist] = useState([]);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
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

    useEffect(() => {
        if (videoRef.current && playlist.length > 0) {
            videoRef.current.play().catch(error => {
                console.log("Autoplay prevented. User interaction might be needed.");
            });
        }
    }, [currentVideoIndex, playlist]);

    if (playlist.length === 0) {
        return (
            <div className="player-fullscreen placeholder-screen">
                <div className="player-status glass">
                    <h2>Nenhum vídeo na playlist</h2>
                    <p>Aguardando configuração do administrador...</p>
                </div>
            </div>
        );
    }

    // Use a fallback URL if the videoFile is just a mock name or handle local blobs
    // For this demo, we'll assume there's a base URL or it's a mock
    const currentVideo = playlist[currentVideoIndex];
    // Since we don't have a real file server, we'll use the URL if it's there or a placeholder
    const videoUrl = currentVideo.url || 'https://assets.mixkit.co/videos/preview/mixkit-city-traffic-at-night-seen-from-above-41005-large.mp4';

    return (
        <div className="player-fullscreen">
            <video
                ref={videoRef}
                key={currentVideo.id} // Force re-render on video change
                src={videoUrl}
                onEnded={handleVideoEnd}
                muted
                autoPlay
                playsInline
                className="full-video"
            />

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
