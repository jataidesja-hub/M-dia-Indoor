import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle } from 'lucide-react';
import './VideoPlayer.css';

const VideoPlayer = () => {
    const [playlist, setPlaylist] = useState([]);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const videoRef = useRef(null);

    // Function to convert Google Drive share links to direct download links
    const getDirectVideoUrl = (url) => {
        if (!url) return '';

        // Handle Google Drive Links
        if (url.includes('drive.google.com')) {
            let fileId = '';
            const match = url.match(/\/file\/d\/([^\/]+)/) || url.match(/id=([^&]+)/);
            if (match && match[1]) {
                fileId = match[1];
                return `https://docs.google.com/uc?export=download&id=${fileId}`;
            }
        }
        return url;
    };

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
            const playVideo = async () => {
                try {
                    videoRef.current.load();
                    await videoRef.current.play();
                } catch (error) {
                    console.log("Autoplay failed, trying again in 1s...");
                    setTimeout(playVideo, 1000);
                }
            };
            playVideo();
        }
    }, [currentVideoIndex, playlist]);

    if (playlist.length === 0) {
        return (
            <div className="player-fullscreen placeholder-screen">
                <div className="player-status glass">
                    <AlertCircle size={48} color="var(--primary)" />
                    <h2>Aguardando Playlist</h2>
                    <p>Configure os vídeos no painel administrativo.</p>
                </div>
            </div>
        );
    }

    const currentVideo = playlist[currentVideoIndex];
    const videoUrl = getDirectVideoUrl(currentVideo.videoUrl);

    return (
        <div className="player-fullscreen" style={{ background: 'black' }}>
            <video
                ref={videoRef}
                key={currentVideo.id + currentVideoIndex}
                src={videoUrl}
                onEnded={handleVideoEnd}
                muted
                autoPlay
                playsInline
                className="full-video"
                style={{ width: '100vw', height: '100vh', objectFit: 'cover' }}
                onError={(e) => {
                    console.error("Video error, skipping...", e);
                    setTimeout(handleVideoEnd, 2000);
                }}
            />

            <div className="player-overlay">
                <div className="brand-dot"></div>
                <span className="live-tag">REPRODUZINDO: {currentVideo.videoName}</span>
            </div>

            <div className="client-brand">
                {currentVideo.name}
            </div>
        </div>
    );
};

export default VideoPlayer;
