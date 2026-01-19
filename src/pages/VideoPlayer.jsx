import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, Loader2, Play, LogOut, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getVideo } from '../utils/db';
import './VideoPlayer.css';

const VideoPlayer = () => {
    const [playlist, setPlaylist] = useState([]);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [currentBlobUrl, setCurrentBlobUrl] = useState('');
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef(null);
    const navigate = useNavigate();
    const driverName = localStorage.getItem('currentUserName') || 'Motorista';

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

    const handleLogout = () => {
        const driverId = localStorage.getItem('currentUserId');
        if (driverId) {
            const drivers = JSON.parse(localStorage.getItem('drivers') || '[]');
            const updatedDrivers = drivers.map(d =>
                d.id.toString() === driverId.toString() ? { ...d, status: 'Offline' } : d
            );
            localStorage.setItem('drivers', JSON.stringify(updatedDrivers));
        }
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userRole');
        localStorage.removeItem('currentUserId');
        localStorage.removeItem('currentUserName');
        navigate('/');
    };

    useEffect(() => {
        const loadVideo = async () => {
            if (playlist.length === 0) return;

            const currentVideo = playlist[currentVideoIndex];
            setError(false);
            setIsLoading(true);

            if (currentBlobUrl) {
                URL.revokeObjectURL(currentBlobUrl);
            }

            let finalUrl = '';

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

            if (currentVideo.videoType === 'local') {
                try {
                    const videoFile = await getVideo(currentVideo.id);
                    if (videoFile) {
                        finalUrl = URL.createObjectURL(videoFile);
                    } else {
                        throw new Error('Arquivo local não encontrado. Certifique-se de que o vídeo foi enviado NESTE aparelho.');
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
                    setError(false);
                } catch (err) {
                    console.log("Autoplay blocked or failed. Waiting for interaction.");
                    // Keep loading or show silent play button
                }
            };
            playVideo();
        }
    }, [currentBlobUrl]);

    // Force play on click anywhere if it's stuck loading
    const forcePlay = () => {
        if (videoRef.current) {
            videoRef.current.play().catch(console.error);
            setIsLoading(false);
        }
    };

    if (playlist.length === 0) {
        return (
            <div className="player-fullscreen placeholder-screen">
                <div className="player-status glass">
                    <AlertCircle size={48} color="var(--primary)" />
                    <h2>Aguardando Grade</h2>
                    <p>O administrador ainda não configurou os vídeos.</p>
                    <button className="logout-mini" onClick={handleLogout}>
                        <LogOut size={16} /> Sair
                    </button>
                </div>
            </div>
        );
    }

    const currentVideo = playlist[currentVideoIndex];

    return (
        <div className="player-fullscreen" style={{ background: 'black' }} onClick={forcePlay}>
            <video
                ref={videoRef}
                key={currentVideo.id + currentVideoIndex}
                src={currentBlobUrl}
                onEnded={handleVideoEnd}
                onPlaying={() => {
                    setIsLoading(false);
                    setError(false);
                }}
                onWaiting={() => setIsLoading(true)}
                muted={isMuted}
                autoPlay
                playsInline
                className="full-video"
                onError={(e) => {
                    console.error("Erro no hardware de vídeo ou link quebrado.");
                    setError(true);
                    setIsLoading(false);
                    // Auto-skip after error
                    setTimeout(handleVideoEnd, 3000);
                }}
            />

            {isLoading && !error && (
                <div className="player-loader">
                    <Loader2 className="animate-spin" size={48} />
                    <p>Preparando Vídeo...</p>
                    <button className="manual-play-btn" onClick={forcePlay}>
                        <Play size={16} /> Toque se não iniciar
                    </button>
                </div>
            )}

            {error && (
                <div className="player-error">
                    <AlertCircle size={48} color="var(--danger)" />
                    <h2>Mídia Não Disponível</h2>
                    <p>O arquivo local ou link está inacessível neste momento.</p>
                    <div className="error-suggestion glass">
                        <p><strong>Dica:</strong> Se selecionou "Arquivo Local", o vídeo deve ser enviado no tablet que vai exibir.</p>
                    </div>
                    <button className="btn-retry" onClick={handleVideoEnd}>
                        Próximo Vídeo <RefreshCw size={16} />
                    </button>
                </div>
            )}

            <div className="player-overlay">
                <div className="brand-dot"></div>
                <span className="live-tag">ON-AIR: {currentVideo.videoName}</span>
                <button className="logout-corner" onClick={(e) => { e.stopPropagation(); handleLogout(); }}>
                    <LogOut size={16} /> Desconectar
                </button>
            </div>

            <div className="client-brand">
                <span className="advertiser-name">{currentVideo.name}</span>
                <div className="driver-info">Logado: {driverName}</div>
            </div>
        </div>
    );
};

export default VideoPlayer;
