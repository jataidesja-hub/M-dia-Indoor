import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Plus,
    Search,
    Filter,
    Trash2,
    Edit2,
    Play,
    Save,
    X
} from 'lucide-react';
import Modal from '../components/Modal';
import './VideoManager.css';

const VideoManager = () => {
    const [videos, setVideos] = useState([
        { id: 1, title: 'Propaganda Coca-Cola', client: 'Coca-Cola', duration: '30s', status: 'Ativo', lastUpdate: '12/01/2026' },
        { id: 2, title: 'Ofertas Supermercado', client: 'Super Premium', duration: '15s', status: 'Pausado', lastUpdate: '15/01/2026' },
        { id: 3, title: 'Institucional Prefeitura', client: 'Gov Municipal', duration: '60s', status: 'Ativo', lastUpdate: '18/01/2026' },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVideo, setEditingVideo] = useState(null);
    const [formData, setFormData] = useState({ title: '', client: '', duration: '', status: 'Ativo' });

    const handleOpenModal = (video = null) => {
        if (video) {
            setEditingVideo(video);
            setFormData({ title: video.title, client: video.client, duration: video.duration, status: video.status });
        } else {
            setEditingVideo(null);
            setFormData({ title: '', client: '', duration: '', status: 'Ativo' });
        }
        setIsModalOpen(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (editingVideo) {
            setVideos(videos.map(v => v.id === editingVideo.id ? { ...v, ...formData } : v));
        } else {
            setVideos([...videos, { id: Date.now(), ...formData, lastUpdate: new Date().toLocaleDateString('pt-BR') }]);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('Tem certeza que deseja excluir este vídeo?')) {
            setVideos(videos.filter(v => v.id !== id));
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="manager-container">
            <header className="manager-header">
                <h1>Gerenciamento de Vídeos</h1>
                <button className="btn-primary" onClick={() => handleOpenModal()}>
                    <Plus size={20} />
                    <span>Novo Vídeo</span>
                </button>
            </header>

            <div className="filters-bar glass">
                <div className="search-box">
                    <Search size={18} className="search-icon" />
                    <input type="text" placeholder="Buscar por título ou cliente..." />
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
                                        <div className="video-thumb"><Play size={12} fill="white" /></div>
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
                                        <button className="icon-btn edit" onClick={() => handleOpenModal(v)}><Edit2 size={16} /></button>
                                        <button className="icon-btn delete" onClick={() => handleDelete(v.id)}><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingVideo ? "Editar Vídeo" : "Adicionar Novo Vídeo"}
            >
                <form onSubmit={handleSave}>
                    <div className="form-group">
                        <label>Título do Vídeo</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Cliente</label>
                        <input
                            type="text"
                            required
                            value={formData.client}
                            onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Duração (e.g. 30s)</label>
                        <input
                            type="text"
                            required
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Status</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                            <option value="Ativo">Ativo</option>
                            <option value="Pausado">Pausado</option>
                        </select>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                        <button type="submit" className="btn-primary">Salvar Alterações</button>
                    </div>
                </form>
            </Modal>
        </motion.div>
    );
};

export default VideoManager;
