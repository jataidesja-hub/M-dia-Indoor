import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Search, Edit2, Trash2, Link, Upload, Video as VideoIcon, Calendar, Info } from 'lucide-react';
import Modal from '../components/Modal';
import './VideoManager.css';

const ClientManager = () => {
    const [clients, setClients] = useState(() => {
        const saved = localStorage.getItem('clients');
        return saved ? JSON.parse(saved) : [
            { id: 1, name: 'Exemplo Coca-Cola', email: 'contato@coca.com', phone: '(11) 99999-0000', plan: 'Mensal', status: 'Ativo', videoName: 'propaganda_v1.mp4', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-city-traffic-at-night-seen-from-above-41005-large.mp4', startDate: '2026-01-01', endDate: '2026-01-31' },
        ];
    });

    useEffect(() => {
        localStorage.setItem('clients', JSON.stringify(clients));
    }, [clients]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        plan: 'Mensal',
        status: 'Ativo',
        videoUrl: '',
        videoName: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: ''
    });

    useEffect(() => {
        if (formData.startDate) {
            const start = new Date(formData.startDate);
            let duration = 30;
            if (formData.plan === 'Semanal') duration = 7;
            if (formData.plan === 'Trimestral') duration = 90;

            const end = new Date(start);
            end.setDate(start.getDate() + duration);
            setFormData(prev => ({ ...prev, endDate: end.toISOString().split('T')[0] }));
        }
    }, [formData.plan, formData.startDate]);

    const handleOpenModal = (client = null) => {
        if (client) {
            setEditingClient(client);
            setFormData({
                name: client.name,
                email: client.email,
                phone: client.phone,
                plan: client.plan,
                status: client.status,
                videoUrl: client.videoUrl || '',
                videoName: client.videoName || '',
                startDate: client.startDate || new Date().toISOString().split('T')[0],
                endDate: client.endDate || ''
            });
        } else {
            setEditingClient(null);
            setFormData({
                name: '',
                email: '',
                phone: '',
                plan: 'Mensal',
                status: 'Ativo',
                videoUrl: '',
                videoName: '',
                startDate: new Date().toISOString().split('T')[0],
                endDate: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        const clientData = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            plan: formData.plan,
            status: formData.status,
            videoUrl: formData.videoUrl,
            videoName: formData.videoName || (formData.videoUrl ? 'Vídeo via Link' : ''),
            startDate: formData.startDate,
            endDate: formData.endDate
        };

        if (editingClient) {
            setClients(clients.map(c => c.id === editingClient.id ? { ...c, ...clientData } : c));
        } else {
            setClients([...clients, { id: Date.now(), ...clientData }]);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('Excluir cliente?')) {
            setClients(clients.filter(c => c.id !== id));
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="manager-container">
            <header className="manager-header">
                <h1>Gerenciamento de Clientes</h1>
                <button className="btn-primary" onClick={() => handleOpenModal()}>
                    <UserPlus size={20} />
                    <span>Novo Cliente</span>
                </button>
            </header>
            <div className="filters-bar glass">
                <div className="search-box">
                    <Search size={18} className="search-icon" />
                    <input type="text" placeholder="Buscar por nome ou e-mail..." />
                </div>
            </div>

            <div className="table-container glass">
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Contato</th>
                            <th>Plano</th>
                            <th>Adesão / Término</th>
                            <th>Vídeo</th>
                            <th>Status</th>
                            <th className="text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((c) => (
                            <tr key={c.id}>
                                <td>{c.name}</td>
                                <td>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{c.email}</div>
                                    <div>{c.phone}</div>
                                </td>
                                <td><span className="badge-plan">{c.plan}</span></td>
                                <td>
                                    <div className="date-info">
                                        <div className="date-row"><Calendar size={12} /> {c.startDate}</div>
                                        <div className="date-row end"><Calendar size={12} /> {c.endDate}</div>
                                    </div>
                                </td>
                                <td>
                                    <div className="video-cell-mini">
                                        <VideoIcon size={14} />
                                        <span>{c.videoName || 'Sem vídeo'}</span>
                                    </div>
                                </td>
                                <td>
                                    <span className={`badge ${c.status === 'Ativo' ? 'success' : 'warning'}`}>
                                        {c.status}
                                    </span>
                                </td>
                                <td className="text-right">
                                    <div className="action-buttons">
                                        <button className="icon-btn edit" onClick={() => handleOpenModal(c)}><Edit2 size={16} /></button>
                                        <button className="icon-btn delete" onClick={() => handleDelete(c.id)}><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingClient ? "Editar Cliente" : "Novo Cliente"}>
                <form onSubmit={handleSave}>
                    <div className="form-group">
                        <label>Nome Completo</label>
                        <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>E-mail</label>
                            <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Telefone</label>
                            <input type="text" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                        </div>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Plano</label>
                            <select value={formData.plan} onChange={(e) => setFormData({ ...formData, plan: e.target.value })}>
                                <option value="Semanal">Semanal</option>
                                <option value="Mensal">Mensal</option>
                                <option value="Trimestral">Trimestral</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Status</label>
                            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                                <option value="Ativo">Ativo</option>
                                <option value="Inativo">Inativo</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Data de Adesão</label>
                            <input type="date" required value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Data de Término</label>
                            <input type="date" readOnly value={formData.endDate} className="readonly-input" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>URL do Vídeo (Recomendado para Tablets)</label>
                        <div className="input-with-icon">
                            <Link size={18} />
                            <input
                                type="url"
                                placeholder="https://exemplo.com/video.mp4"
                                value={formData.videoUrl}
                                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                            />
                        </div>
                        <p className="field-hint">Use links diretos de vídeos (.mp4, .webm) para garantir a reprodução.</p>
                    </div>

                    <div className="info-box glass">
                        <Info size={16} />
                        <p>Para exibir vídeos locais sem internet, use a opção de "Selecionar Arquivo" no Player do Tablet.</p>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                        <button type="submit" className="btn-primary">Salvar Cliente</button>
                    </div>
                </form>
            </Modal>
        </motion.div>
    );
};

export default ClientManager;
