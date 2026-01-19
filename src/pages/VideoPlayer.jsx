import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import './VideoPlayer.css';

const VideoPlayer = () => {
    const [playlist, setPlaylist] = useState([]);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const videoRef = useRef(null);

    const getDirectVideoUrl = (url, retry = 0) => {
        if (!url) return '';

        // Handle Google Drive
        if (url.includes('drive.google.com')) {
            let fileId = '';
            const match = url.match(/\/file\/d\/([^\/]+)/) || url.match(/id=([^&]+)/);
            if (match && match[1]) {
                fileId = match[1];
                // Method 1: standard uc
                if (retry === 0) return `https://docs.google.com/uc?export=download&id=${fileId}`;
                // Method 2: drive.usercontent (newer)
                return `https://drive.usercontent.google.com/download?id=${fileId}&export=download&authuser=0`;
            }
        }

        // Handle Dropbox
        if (url.includes('dropbox.com')) {
            return url.replace('dl=0', 'dl=1').replace('www.dropbox.com', 'dl.dropboxusercontent.com');
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
            setError(false);
            setIsLoading(true);
            setRetryCount(0);
            setCurrentVideoIndex((prev) => (prev + 1) % playlist.length);
        }
    };

    const handleRetry = () => {
        if (retryCount < 1) {
            setRetryCount(retryCount + 1);
            setError(false);
            setIsLoading(true);
        } else {
            handleVideoEnd(); // Skip if second method also fails
        }
    };

    useEffect(() => {
        if (videoRef.current && playlist.length > 0) {
            const playVideo = async () => {
                try {
                    setError(false);
                    videoRef.current.load();
                    await videoRef.current.play();
                    setIsLoading(false);
                } catch (err) {
                    console.log("Play failed, waiting for data...");
                }
            };
            playVideo();
        }
    }, [currentVideoIndex, playlist, retryCount]);

    if (playlist.length === 0) {
        return (
            <div className="player-fullscreen placeholder-screen">
                <div className="player-status glass">
                    <AlertCircle size={48} color="var(--primary)" />
                    <h2>Aguardando Playlist</h2>
                    <p>Adicione vídeos no Painel ADM.</p>
                </div>
            </div>
        );
    }

    const currentVideo = playlist[currentVideoIndex];
    const videoUrl = getDirectVideoUrl(currentVideo.videoUrl, retryCount);

    return (
        <div className="player-fullscreen" style={{ background: 'black' }}>
            <video
                ref={videoRef}
                key={currentVideo.id + currentVideoIndex + retryCount}
                src={videoUrl}
                onEnded={handleVideoEnd}
                onPlaying={() => setIsLoading(false)}
                onLoadStart={() => setIsLoading(true)}
                muted
                autoPlay
                playsInline
                className="full-video"
                style={{
                    width: '100vw',
                    height: '100vh',
                    objectFit: 'cover',
                    display: error ? 'none' : 'block'
                }}
                onError={(e) => {
                    console.error("Erro no vídeo:", currentVideo.videoName);
                    if (retryCount < 1) {
                        handleRetry();
                    } else {
                        setError(true);
                        setIsLoading(false);
                        setTimeout(handleVideoEnd, 3000);
                    }
                }}
            />

            {isLoading && !error && (
                <div className="player-loader">
                    <Loader2 className="animate-spin" size={48} />
                    <p>Carregando Mídia...</p>
                    <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>Tentativa {retryCount + 1}</span>
                </div>
            )}

            {error && (
                <div className="player-error">
                    <AlertCircle size={48} color="var(--danger)" />
                    <h2>Não foi possível carregar</h2>
                    <p>O Google Drive bloqueou o acesso a este arquivo.</p>
                    <div className="error-suggestion glass">
                        <p><strong>Dica:</strong> Seus vídeos são pequenos, tente usar o <strong>Dropbox</strong> ou <strong>Discord</strong> como hospedagem. O Google Drive é instável para players automáticos.</p>
                    </div>
                    <button className="btn-retry" onClick={handleVideoEnd}>
                        <RefreshCw size={16} /> Tentar Próximo
                    </button>
                </div>
            )}

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
