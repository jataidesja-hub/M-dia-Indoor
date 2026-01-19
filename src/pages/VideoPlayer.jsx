import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, Loader2, Play } from 'lucide-react';
import { getVideo } from '../utils/db';
import './VideoPlayer.css';

const VideoPlayer = () => {
    const [playlist, setPlaylist] = useState([]);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [currentBlobUrl, setCurrentBlobUrl] = useState('');
    const videoRef = useRef(null);

    const getDirectVideoUrl = (url) => {
        if (!url) return '';
        if (url.includes('drive.google.com')) {
            let fileId = '';
            const match = url.match(/\/file\/d\/([^\/]+)/) || url.match(/id=([^&]+)/);
            if (match && match[1]) {
                fileId = match[1];
                return `https://docs.google.com/uc?id=${fileId}&export=download`;
            }
        }
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
            setCurrentVideoIndex((prev) => (prev + 1) % playlist.length);
        }
    };

    useEffect(() => {
        const loadVideo = async () => {
            if (playlist.length === 0) return;

            const currentVideo = playlist[currentVideoIndex];
            setError(false);
            setIsLoading(true);

            // Clean up old blob URL if any
            if (currentBlobUrl) {
                URL.revokeObjectURL(currentBlobUrl);
            }

            let finalUrl = '';

            if (currentVideo.videoType === 'local') {
                try {
                    const videoFile = await getVideo(currentVideo.id);
                    if (videoFile) {
                        finalUrl = URL.createObjectURL(videoFile);
                    } else {
                        throw new Error('Arquivo local não encontrado');
                    }
                } catch (err) {
                    console.error("Local load failed:", err);
                    setError(true);
                    setIsLoading(false);
                    return;
                }
            } else {
                finalUrl = getDirectVideoUrl(currentVideo.videoUrl);
            }

            setCurrentBlobUrl(finalUrl);
        };

        loadVideo();
    }, [currentVideoIndex, playlist]);

    useEffect(() => {
        if (videoRef.current && currentBlobUrl) {
            const playVideo = async () => {
                try {
                    videoRef.current.load();
                    await videoRef.current.play();
                    setIsLoading(false);
                } catch (err) {
                    console.log("Auto-play failed, usually browser restriction.");
                }
            };
            playVideo();
        }
    }, [currentBlobUrl]);

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

    return (
        <div className="player-fullscreen" style={{ background: 'black' }}>
            <video
                ref={videoRef}
                key={currentVideo.id + currentVideoIndex}
                src={currentBlobUrl}
                onEnded={handleVideoEnd}
                onPlaying={() => setIsLoading(false)}
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
                    console.error("Erro no carregamento:", currentVideo.videoName);
                    setError(true);
                    setIsLoading(false);
                    setTimeout(handleVideoEnd, 3000);
                }}
            />

            {isLoading && !error && (
                <div className="player-loader">
                    <Loader2 className="animate-spin" size={48} />
                    <p>Carregando {currentVideo.videoType === 'local' ? 'do Disco' : 'da Nuvem'}...</p>
                </div>
            )}

            {error && (
                <div className="player-error">
                    <AlertCircle size={48} color="var(--danger)" />
                    <h2>Mídia Não Encontrada</h2>
                    <p>O arquivo local ou link do vídeo está inacessível.</p>
                    <div className="error-suggestion glass">
                        <p><strong>Dica:</strong> Se selecionou "Arquivo Local", o vídeo deve ter sido enviado NESTE tablet.</p>
                    </div>
                    <button className="btn-retry" onClick={handleVideoEnd}>Próximo Vídeos</button>
                </div>
            )}

            <div className="player-overlay">
                <div className="brand-dot"></div>
                <span className="live-tag">TELA ATIVA: {currentVideo.videoName}</span>
            </div>

            <div className="client-brand">
                {currentVideo.name}
            </div>
        </div>
    );
};

export default VideoPlayer;
