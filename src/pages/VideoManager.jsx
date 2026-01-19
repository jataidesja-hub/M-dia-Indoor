import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Plus,
    Search,
    Filter,
    Trash2,
    Edit2,
    Play,
    Calendar,
    Clock
} from 'lucide-react';
import './VideoManager.css';

const VideoManager = () => {
    const [videos, setVideos] = useState([
        { id: 1, title: 'Propaganda Coca-Cola', client: 'Coca-Cola', duration: '30s', status: 'Ativo', lastUpdate: '12/01/2026' },
        { id: 2, title: 'Ofertas Supermercado', client: 'Super Premium', duration: '15s', status: 'Pausado', lastUpdate: '15/01/2026' },
        { id: 3, title: 'Institucional Prefeitura', client: 'Gov Municipal', duration: '60s', status: 'Ativo', lastUpdate: '18/01/2026' },
    ]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="manager-container"
        >
            <header className="manager-header">
                <h1>Gerenciamento de Vídeos</h1>
                <button className="btn-primary">
                    <Plus size={20} />
                    <span>Novo Vídeo</span>
                </button>
            </header>

            <div className="filters-bar glass">
                <div className="search-box">
                    <Search size={18} className="search-icon" />
                    <input type="text" placeholder="Buscar por título ou cliente..." />
                </div>
                <div className="filter-actions">
                    <button className="btn-secondary">
                        <Filter size={18} />
                        <span>Filtros</span>
                    </button>
                </div>
            </div>

            <div className="table-container glass">
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>Vídeo</th>
                            <th>Cliente</th>
                            <th>Duração</th>
                            <th>Adesão</th>
                            <th>Status</th>
                            <th className="text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {videos.map((v) => (
                            <tr key={v.id}>
                                <td>
                                    <div className="video-cell">
                                        <div className="video-thumb">
                                            <Play size={12} fill="white" />
                                        </div>
                                        <span>{v.title}</span>
                                    </div>
                                </td>
                                <td>{v.client}</td>
                                <td>{v.duration}</td>
                                <td>{v.lastUpdate}</td>
                                <td>
                                    <span className={`badge ${v.status === 'Ativo' ? 'success' : 'warning'}`}>
                                        {v.status}
                                    </span>
                                </td>
                                <td className="text-right">
                                    <div className="action-buttons">
                                        <button className="icon-btn edit"><Edit2 size={16} /></button>
                                        <button className="icon-btn delete"><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default VideoManager;
