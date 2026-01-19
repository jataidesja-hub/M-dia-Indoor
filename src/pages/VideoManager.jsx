import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Plus,
    Search,
    Trash2,
    Play,
    ArrowUp,
    ArrowDown,
    ChevronRight,
    MonitorCheck
} from 'lucide-react';
import './VideoManager.css';

const VideoManager = () => {
    // Load clients to get their videos
    const [clients, setClients] = useState(() => {
        const saved = localStorage.getItem('clients');
        return saved ? JSON.parse(saved) : [];
    });

    // Playlist management
    const [playlist, setPlaylist] = useState(() => {
        const saved = localStorage.getItem('playlist');
        return saved ? JSON.parse(saved) : [];
    });

    // Filter clients to those that actually have videos
    const availableVideos = clients.filter(c => c.videoName && c.status === 'Ativo');

    useEffect(() => {
        localStorage.setItem('playlist', JSON.stringify(playlist));
    }, [playlist]);

    const handleTogglePlaylist = (video) => {
        const isInPlaylist = playlist.find(p => p.id === video.id);
        if (isInPlaylist) {
            setPlaylist(playlist.filter(p => p.id !== video.id));
        } else {
            setPlaylist([...playlist, { ...video, order: playlist.length }]);
        }
    };

    const moveItem = (index, direction) => {
        const newPlaylist = [...playlist];
        const newIndex = index + direction;
        if (newIndex >= 0 && newIndex < newPlaylist.length) {
            const temp = newPlaylist[index];
            newPlaylist[index] = newPlaylist[newIndex];
            newPlaylist[newIndex] = temp;
            setPlaylist(newPlaylist);
        }
    };

    const handleRemoveFromPlaylist = (id) => {
        setPlaylist(playlist.filter(v => v.id !== id));
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="manager-container">
            <header className="manager-header">
                <div>
                    <h1>Grade de Programação</h1>
                    <p>Selecione e organize os vídeos dos clientes para exibição.</p>
                </div>
                <div className="current-status">
                    <MonitorCheck size={18} />
                    <span>{playlist.length} Vídeos na Playlist</span>
                </div>
            </header>

            <div className="dashboard-content-grid">
                {/* Available Videos from Clients */}
                <div className="content-card glass">
                    <h3>Vídeos Disponíveis (Clientes Ativos)</h3>
                    <div className="table-container no-border">
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>Cliente</th>
                                    <th>Vídeo</th>
                                    <th className="text-right">Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {availableVideos.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="text-center" style={{ padding: '2rem', color: 'var(--text-muted)' }}>
                                            Nenhum vídeo disponível. Cadastre clientes com vídeos ativos.
                                        </td>
                                    </tr>
                                ) : (
                                    availableVideos.map((v) => {
                                        const isInPlaylist = playlist.find(p => p.id === v.id);
                                        return (
                                            <tr key={v.id}>
                                                <td>{v.name}</td>
                                                <td className="video-cell-mini">
                                                    <Play size={12} />
                                                    {v.videoName}
                                                </td>
                                                <td className="text-right">
                                                    <button
                                                        className={`badge ${isInPlaylist ? 'warning' : 'success'}`}
                                                        onClick={() => handleTogglePlaylist(v)}
                                                        style={{ cursor: 'pointer', border: 'none' }}
                                                    >
                                                        {isInPlaylist ? 'Remover' : 'Adicionar'}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Current Playlist Ordering */}
                <div className="content-card glass">
                    <h3>Ordem de Exibição</h3>
                    <div className="playlist-order-list">
                        {playlist.length === 0 ? (
                            <div className="empty-playlist" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                Sua playlist está vazia.
                            </div>
                        ) : (
                            playlist.map((v, index) => (
                                <div key={v.id} className="playlist-item glass">
                                    <div className="order-number">{index + 1}</div>
                                    <div className="playlist-item-info">
                                        <p className="title">{v.videoName}</p>
                                        <p className="subtitle">{v.name}</p>
                                    </div>
                                    <div className="playlist-item-actions">
                                        <button
                                            className="order-btn"
                                            onClick={() => moveItem(index, -1)}
                                            disabled={index === 0}
                                        >
                                            <ArrowUp size={16} />
                                        </button>
                                        <button
                                            className="order-btn"
                                            onClick={() => moveItem(index, 1)}
                                            disabled={index === playlist.length - 1}
                                        >
                                            <ArrowDown size={16} />
                                        </button>
                                        <button
                                            className="icon-btn delete"
                                            onClick={() => handleRemoveFromPlaylist(v.id)}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default VideoManager;
