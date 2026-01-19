import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import './VideoPlayer.css';

const VideoPlayer = () => {
    const [playlist, setPlaylist] = useState([]);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const videoRef = useRef(null);

    const getDirectVideoUrl = (url) => {
        if (!url) return '';
        if (url.includes('drive.google.com')) {
            let fileId = '';
            const match = url.match(/\/file\/d\/([^\/]+)/) || url.match(/id=([^&]+)/);
            if (match && match[1]) {
                fileId = match[1];
                // Try the most direct uc link
                return `https://docs.google.com/uc?id=${fileId}&export=download`;
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
            setError(false);
            setIsLoading(true);
            setCurrentVideoIndex((prev) => (prev + 1) % playlist.length);
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
                    console.log("Play failed, retrying...");
                    // No setIsLoading(false) here, keep loader if it's not playing
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
                    <h2>Aguardando Configuração</h2>
                    <p>Adicione vídeos no Painel ADM.</p>
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
                    setError(true);
                    setIsLoading(false);
                    // Pula para o próximo após 5 segundos se der erro
                    setTimeout(handleVideoEnd, 5000);
                }}
            />

            {isLoading && !error && (
                <div className="player-loader">
                    <Loader2 className="animate-spin" size={48} />
                    <p>Carregando Mídia...</p>
                </div>
            )}

            {error && (
                <div className="player-error">
                    <AlertCircle size={48} color="var(--danger)" />
                    <h2>Erro ao Carregar Vídeo</h2>
                    <p>O link do Google Drive pode estar bloqueado ou o arquivo é muito grande.</p>
                    <p className="small">Tentando próximo em instantes...</p>
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
