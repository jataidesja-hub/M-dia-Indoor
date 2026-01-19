import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Search, Edit2, Trash2, Link, Upload, Video as VideoIcon, Calendar, Info, AlertCircle, CheckCircle2 } from 'lucide-react';
import Modal from '../components/Modal';
import { saveVideo, deleteVideo } from '../utils/db';
import './VideoManager.css';

const ClientManager = () => {
    const [clients, setClients] = useState(() => {
        const saved = localStorage.getItem('clients');
        return saved ? JSON.parse(saved) : [];
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
        videoType: 'link', // 'link' or 'local'
        videoFile: null,
        startDate: new Date().toISOString().split('T')[0],
        endDate: ''
    });

    const [isSaving, setIsSaving] = useState(false);

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
                videoType: client.videoType || 'link',
                videoFile: null,
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
                videoType: 'link',
                videoFile: null,
                startDate: new Date().toISOString().split('T')[0],
                endDate: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                videoType: 'local',
                videoFile: file,
                videoName: file.name,
                videoUrl: '' // Clear URL if file is selected
            });
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const clientId = editingClient ? editingClient.id : Date.now();

            // If local file, save to IndexedDB
            if (formData.videoType === 'local' && formData.videoFile) {
                await saveVideo(clientId, formData.videoFile);
            }

            const clientData = {
                id: clientId,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                plan: formData.plan,
                status: formData.status,
                videoUrl: formData.videoUrl,
                videoName: formData.videoName,
                videoType: formData.videoType,
                startDate: formData.startDate,
                endDate: formData.endDate
            };

            if (editingClient) {
                setClients(clients.map(c => c.id === editingClient.id ? clientData : c));
            } else {
                setClients([...clients, clientData]);
            }
            setIsModalOpen(false);
        } catch (error) {
            alert('Erro ao salvar vídeo localmente: ' + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Excluir cliente?')) {
            await deleteVideo(id);
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
                            <th>Plano</th>
                            <th>Adesão / Término</th>
                            <th>Vídeo / Origem</th>
                            <th>Status</th>
                            <th className="text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((c) => (
                            <tr key={c.id}>
                                <td>{c.name}</td>
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
                                        <span>{c.videoName}</span>
                                        <span className="source-tag">{c.videoType === 'local' ? 'Local' : 'Nuvem'}</span>
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

                    <div className="tabs-container">
                        <div className="tabs-header">
                            <button
                                type="button"
                                className={formData.videoType === 'link' ? 'tab-btn active' : 'tab-btn'}
                                onClick={() => setFormData({ ...formData, videoType: 'link' })}
                            >
                                <Link size={16} /> Link (Nuvem)
                            </button>
                            <button
                                type="button"
                                className={formData.videoType === 'local' ? 'tab-btn active' : 'tab-btn'}
                                onClick={() => setFormData({ ...formData, videoType: 'local' })}
                            >
                                <Upload size={16} /> Arquivo Local
                            </button>
                        </div>

                        <div className="tab-content">
                            {formData.videoType === 'link' ? (
                                <div className="form-group">
                                    <label>URL do Vídeo (Google Drive, Dropbox, etc)</label>
                                    <div className="input-with-icon">
                                        <Link size={18} />
                                        <input
                                            type="url"
                                            placeholder="https://drive.google.com/file/d/..."
                                            value={formData.videoUrl}
                                            onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value, videoName: 'Vídeo via Link' })}
                                        />
                                    </div>
                                    <p className="field-hint">Use para vídeos já hospedados na internet.</p>
                                </div>
                            ) : (
                                <div className="form-group">
                                    <label>Selecionar Arquivo de Vídeo</label>
                                    <div className={`upload-container ${formData.videoFile ? 'has-file' : ''}`} onClick={() => document.getElementById('video-upload').click()}>
                                        {formData.videoFile ? <CheckCircle2 size={32} color="var(--primary)" /> : <Upload size={32} />}
                                        <span>{formData.videoName || 'Toque para selecionar o vídeo do tablet'}</span>
                                        {formData.videoFile && <p className="file-size">{(formData.videoFile.size / 1024 / 1024).toFixed(2)} MB pronto para salvar</p>}
                                        <input
                                            id="video-upload"
                                            type="file"
                                            accept="video/*"
                                            style={{ display: 'none' }}
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                    <p className="field-hint">O vídeo ficará salvo apenas NESTE tablet/computador.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="info-box glass" style={{ borderColor: 'var(--primary)', color: '#93c5fd' }}>
                        <AlertCircle size={16} />
                        <p><strong>Dica:</strong> Para reprodução garantida sem internet, use a opção <strong>Arquivo Local</strong>.</p>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)} disabled={isSaving}>Cancelar</button>
                        <button type="submit" className="btn-primary" disabled={isSaving}>
                            {isSaving ? 'Salvando...' : 'Salvar Cliente'}
                        </button>
                    </div>
                </form>
            </Modal>
        </motion.div>
    );
};

export default ClientManager;
