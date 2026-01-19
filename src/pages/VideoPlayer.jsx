import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, Loader2, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db, collections } from '../firebase';
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import './VideoPlayer.css';

const VideoPlayer = () => {
    const [playlist, setPlaylist] = useState([]);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const videoRef = useRef(null);
    const navigate = useNavigate();
    const driverName = localStorage.getItem('currentUserName') || 'Motorista';
    const driverId = localStorage.getItem('currentUserId');

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, 'global', 'playlist'), (snap) => {
            if (snap.exists()) {
                setPlaylist(snap.data().items || []);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleVideoEnd = () => {
        if (playlist.length > 0) {
            setError(false);
            setIsLoading(true);
            setCurrentVideoIndex((prev) => (prev + 1) % playlist.length);
        }
    };

    const handleLogout = async () => {
        if (driverId) {
            try {
                await updateDoc(doc(db, collections.DRIVERS, driverId), { status: 'Offline' });
            } catch (err) {
                console.error("Logout update failed", err);
            }
        }
        localStorage.clear();
        navigate('/');
    };

    useEffect(() => {
        if (videoRef.current && playlist.length > 0) {
            videoRef.current.load();
            videoRef.current.play().catch(() => {
                console.log("Autoplay blocked");
            });
        }
    }, [currentVideoIndex, playlist]);

    if (playlist.length === 0) {
        return (
            <div className="player-fullscreen placeholder-screen">
                <div className="player-status glass">
                    <AlertCircle size={48} color="var(--primary)" />
                    <h2>Aguardando Playlist</h2>
                    <p>Suba vídeos no painel ADM e adicione-os na grade.</p>
                    <button className="logout-mini" onClick={handleLogout}><LogOut size={16} /> Sair</button>
                </div>
            </div>
        );
    }

    const currentVideo = playlist[currentVideoIndex];

    return (
        <div className="player-fullscreen" style={{ background: 'black' }} onClick={() => videoRef.current?.play()}>
            <video
                ref={videoRef}
                key={currentVideo.id}
                src={currentVideo.videoUrl}
                onEnded={handleVideoEnd}
                onPlaying={() => setIsLoading(false)}
                muted
                autoPlay
                playsInline
                className="full-video"
                onError={() => {
                    setError(true);
                    setIsLoading(false);
                    setTimeout(handleVideoEnd, 3000);
                }}
            />

            {isLoading && !error && (
                <div className="player-loader">
                    <Loader2 className="animate-spin" size={48} />
                    <p>Carregando Mídia Cloud...</p>
                </div>
            )}

            <div className="player-overlay">
                <div className="brand-dot"></div>
                <span className="live-tag">ARQUIVO: {currentVideo.videoName}</span>
                <button className="logout-corner" onClick={handleLogout}><LogOut size={16} /></button>
            </div>

            <div className="client-brand">
                <span className="advertiser-name">{currentVideo.name}</span>
                <div className="driver-info">Logado: {driverName}</div>
            </div>
        </div>
    );
};

export default VideoPlayer;
