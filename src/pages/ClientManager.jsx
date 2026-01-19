import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Search, Edit2, Trash2, Link, Upload, Video as VideoIcon, Calendar, Info, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import Modal from '../components/Modal';
import { db, storage, collections } from '../firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import './VideoManager.css';

const ClientManager = () => {
    const [clients, setClients] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', plan: 'Mensal', status: 'Ativo',
        videoUrl: '', videoName: '', videoType: 'link', videoFile: null,
        startDate: new Date().toISOString().split('T')[0], endDate: ''
    });

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, collections.CLIENTS), (snapshot) => {
            const clientsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setClients(clientsList);
        }, (error) => {
            console.error("Erro no Firestore:", error);
            alert("Erro de permissão no Firebase! Verifique se ativou o Firestore em 'Modo de Teste' e as REGRAS estão abertas.");
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
        setUploadProgress(0);
        if (client) {
            setEditingClient(client);
            setFormData({ ...client, videoFile: null });
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
        setUploadProgress(0);
        let finalVideoUrl = formData.videoUrl;

        try {
            if (formData.videoType === 'local' && formData.videoFile) {
                const storageRef = ref(storage, `videos/${Date.now()}_${formData.videoFile.name}`);
                const uploadTask = uploadBytesResumable(storageRef, formData.videoFile);

                finalVideoUrl = await new Promise((resolve, reject) => {
                    uploadTask.on('state_changed',
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            setUploadProgress(Math.round(progress));
                        },
                        (error) => {
                            console.error("Erro detalhado no upload:", error);
                            alert("ERRO NO GOOGLE STORAGE: " + error.code + " - " + error.message);
                            reject(error);
                        },
                        async () => {
                            const url = await getDownloadURL(uploadTask.snapshot.ref);
                            resolve(url);
                        }
                    );
                });
            }

            const clientData = {
                name: formData.name,
                plan: formData.plan,
                status: formData.status,
                videoUrl: finalVideoUrl,
                videoName: formData.videoName || 'Vídeo Cloud',
                videoType: 'link',
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
            console.error("Falha geral:", error);
            alert('ERRO AO SALVAR: ' + error.message);
        } finally {
            setIsSaving(false);
            setUploadProgress(0);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Excluir este cliente e vídeo da nuvem?')) {
            await deleteDoc(doc(db, collections.CLIENTS, id));
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="manager-container">
            <header className="manager-header">
                <h1>Painel de Anunciantes</h1>
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
                            <th>Validade</th>
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
                                    </div>
                                </td>
                                <td><span className={`badge ${c.status === 'Ativo' ? 'success' : 'warning'}`}>{c.status}</span></td>
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

            <Modal isOpen={isModalOpen} onClose={() => !isSaving && setIsModalOpen(false)} title={editingClient ? "Editar Cliente" : "Novo Cliente"}>
                <form onSubmit={handleSave}>
                    <div className="form-group"><label>Nome do Cliente</label><input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} disabled={isSaving} /></div>

                    <div className="form-grid">
                        <div className="form-group"><label>Plano</label><select value={formData.plan} onChange={(e) => setFormData({ ...formData, plan: e.target.value })} disabled={isSaving}><option value="Semanal">Semanal</option><option value="Mensal">Mensal</option><option value="Trimestral">Trimestral</option></select></div>
                        <div className="form-group"><label>Status</label><select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} disabled={isSaving}><option value="Ativo">Ativo</option><option value="Inativo">Inativo</option></select></div>
                    </div>

                    <div className="form-grid">
                        <div className="form-group"><label>Início</label><input type="date" required value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} disabled={isSaving} /></div>
                        <div className="form-group"><label>Vencimento</label><input type="date" readOnly value={formData.endDate} className="readonly-input" /></div>
                    </div>

                    <div className="tabs-container">
                        <div className="tabs-header">
                            <button type="button" className={formData.videoType === 'link' ? 'tab-btn active' : 'tab-btn'} onClick={() => !isSaving && setFormData({ ...formData, videoType: 'link' })}><Link size={16} /> Link Externo</button>
                            <button type="button" className={formData.videoType === 'local' ? 'tab-btn active' : 'tab-btn'} onClick={() => !isSaving && setFormData({ ...formData, videoType: 'local' })}><Upload size={16} /> Subir Arquivo</button>
                        </div>
                        <div className="tab-content">
                            {formData.videoType === 'link' ? (
                                <div className="form-group">
                                    <label>URL do Vídeo</label>
                                    <input type="url" placeholder="https://..." value={formData.videoUrl} onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value, videoName: 'Vídeo Externo' })} disabled={isSaving} />
                                </div>
                            ) : (
                                <div className="form-group">
                                    <div className={`upload-container ${formData.videoFile ? 'has-file' : ''}`} onClick={() => !isSaving && document.getElementById('v-up').click()}>
                                        {isSaving ? <Loader2 className="animate-spin" size={32} /> : (formData.videoFile ? <CheckCircle2 size={32} color="var(--primary)" /> : <Upload size={32} />)}
                                        <span>{formData.videoName || 'Escolher vídeo do computador'}</span>
                                        <input id="v-up" type="file" accept="video/*" style={{ display: 'none' }} onChange={handleFileChange} disabled={isSaving} />
                                    </div>
                                    {isSaving && (
                                        <div className="progress-wrapper mt-2">
                                            <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: `${uploadProgress}%` }}></div></div>
                                            <span className="progress-text">{uploadProgress}% enviado para o Google</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)} disabled={isSaving}>Cancelar</button>
                        <button type="submit" className="btn-primary" disabled={isSaving}>
                            {isSaving ? `Progresso: ${uploadProgress}%` : 'Salvar na Nuvem'}
                        </button>
                    </div>
                </form>
            </Modal>
        </motion.div>
    );
};

export default ClientManager;
