import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Search, Edit2, Trash2, Link, Upload, Video as VideoIcon, Calendar, Info, AlertCircle, CheckCircle2 } from 'lucide-react';
import Modal from '../components/Modal';
import { db, storage, collections } from '../firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import './VideoManager.css';

const ClientManager = () => {
    const [clients, setClients] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', plan: 'Mensal', status: 'Ativo',
        videoUrl: '', videoName: '', videoType: 'link', videoFile: null,
        startDate: new Date().toISOString().split('T')[0], endDate: ''
    });

    // Escutar mudanças no Firebase em tempo real
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, collections.CLIENTS), (snapshot) => {
            const clientsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setClients(clientsList);
        });
        return () => unsubscribe();
    }, []);

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
                ...client,
                videoFile: null,
                startDate: client.startDate || new Date().toISOString().split('T')[0]
            });
        } else {
            setEditingClient(null);
            setFormData({
                name: '', email: '', phone: '', plan: 'Mensal', status: 'Ativo',
                videoUrl: '', videoName: '', videoType: 'link', videoFile: null,
                startDate: new Date().toISOString().split('T')[0], endDate: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, videoType: 'local', videoFile: file, videoName: file.name, videoUrl: '' });
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        let finalVideoUrl = formData.videoUrl;

        try {
            // 1. Se for upload de arquivo, sobe para o Firebase Storage
            if (formData.videoType === 'local' && formData.videoFile) {
                const storageRef = ref(storage, `videos/${Date.now()}_${formData.videoFile.name}`);
                const snapshot = await uploadBytes(storageRef, formData.videoFile);
                finalVideoUrl = await getDownloadURL(snapshot.ref);
            }

            const clientData = {
                name: formData.name,
                email: formData.email || '',
                phone: formData.phone || '',
                plan: formData.plan,
                status: formData.status,
                videoUrl: finalVideoUrl,
                videoName: formData.videoName,
                videoType: 'link', // Após subir, ele vira um link na nuvem
                startDate: formData.startDate,
                endDate: formData.endDate,
                updatedAt: new Date().toISOString()
            };

            if (editingClient) {
                await updateDoc(doc(db, collections.CLIENTS, editingClient.id), clientData);
            } else {
                await addDoc(collection(db, collections.CLIENTS), clientData);
            }
            setIsModalOpen(false);
        } catch (error) {
            alert('Erro ao sincronizar com a nuvem: ' + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Excluir cliente permanentemente da nuvem?')) {
            await deleteDoc(doc(db, collections.CLIENTS, id));
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="manager-container">
            <header className="manager-header">
                <h1>Clientes (Nuvem Sincronizada)</h1>
                <button className="btn-primary" onClick={() => handleOpenModal()}>
                    <UserPlus size={20} />
                    <span>Novo Cliente</span>
                </button>
            </header>

            <div className="table-container glass">
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
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
                                <td><span className="badge-plan">{c.plan}</span></td>
                                <td>{c.startDate} a {c.endDate}</td>
                                <td>
                                    <div className="video-cell-mini">
                                        <VideoIcon size={14} />
                                        <span>{c.videoName}</span>
                                        <span className="source-tag">Cloud</span>
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
                    <div className="form-group"><label>Nome</label><input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
                    <div className="form-grid">
                        <div className="form-group"><label>Plano</label><select value={formData.plan} onChange={(e) => setFormData({ ...formData, plan: e.target.value })}><option value="Semanal">Semanal</option><option value="Mensal">Mensal</option><option value="Trimestral">Trimestral</option></select></div>
                        <div className="form-group"><label>Status</label><select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}><option value="Ativo">Ativo</option><option value="Inativo">Inativo</option></select></div>
                    </div>
                    <div className="form-grid">
                        <div className="form-group"><label>Adesão</label><input type="date" required value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} /></div>
                        <div className="form-group"><label>Término</label><input type="date" readOnly value={formData.endDate} className="readonly-input" /></div>
                    </div>

                    <div className="tabs-container">
                        <div className="tabs-header">
                            <button type="button" className={formData.videoType === 'link' ? 'tab-btn active' : 'tab-btn'} onClick={() => setFormData({ ...formData, videoType: 'link' })}><Link size={16} /> Link</button>
                            <button type="button" className={formData.videoType === 'local' ? 'tab-btn active' : 'tab-btn'} onClick={() => setFormData({ ...formData, videoType: 'local' })}><Upload size={16} /> Upload</button>
                        </div>
                        <div className="tab-content">
                            {formData.videoType === 'link' ? (
                                <div className="form-group">
                                    <label>URL do Vídeo</label>
                                    <input type="url" placeholder="https://..." value={formData.videoUrl} onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value, videoName: 'Vídeo via Link' })} />
                                </div>
                            ) : (
                                <div className="form-group">
                                    <div className={`upload-container ${formData.videoFile ? 'has-file' : ''}`} onClick={() => document.getElementById('v-up').click()}>
                                        {formData.videoFile ? <CheckCircle2 size={32} color="var(--primary)" /> : <Upload size={32} />}
                                        <span>{formData.videoName || 'Selecionar Vídeo'}</span>
                                        <input id="v-up" type="file" accept="video/*" style={{ display: 'none' }} onChange={handleFileChange} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)} disabled={isSaving}>Cancelar</button>
                        <button type="submit" className="btn-primary" disabled={isSaving}>{isSaving ? 'Subindo para Nuvem...' : 'Salvar na Nuvem'}</button>
                    </div>
                </form>
            </Modal>
        </motion.div>
    );
};

export default ClientManager;
