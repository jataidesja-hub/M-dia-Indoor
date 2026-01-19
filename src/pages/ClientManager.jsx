import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Search, Edit2, Trash2 } from 'lucide-react';
import Modal from '../components/Modal';
import './VideoManager.css';

const ClientManager = () => {
    const [clients, setClients] = useState([
        { id: 1, name: 'João Silva', email: 'joao@transporte.com', phone: '(11) 99999-9999', plan: 'Premium', status: 'Ativo' },
        { id: 2, name: 'Maria Santos', email: 'maria@logistica.com', phone: '(11) 88888-8888', plan: 'Básico', status: 'Inativo' },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', plan: 'Premium', status: 'Ativo' });

    const handleOpenModal = (client = null) => {
        if (client) {
            setEditingClient(client);
            setFormData({ name: client.name, email: client.email, phone: client.phone, plan: client.plan, status: client.status });
        } else {
            setEditingClient(null);
            setFormData({ name: '', email: '', phone: '', plan: 'Premium', status: 'Ativo' });
        }
        setIsModalOpen(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (editingClient) {
            setClients(clients.map(c => c.id === editingClient.id ? { ...c, ...formData } : c));
        } else {
            setClients([...clients, { id: Date.now(), ...formData }]);
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
                            <th>E-mail</th>
                            <th>Telefone</th>
                            <th>Plano</th>
                            <th>Status</th>
                            <th className="text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((c) => (
                            <tr key={c.id}>
                                <td>{c.name}</td>
                                <td>{c.email}</td>
                                <td>{c.phone}</td>
                                <td>{c.plan}</td>
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
                    <div className="form-group">
                        <label>E-mail</label>
                        <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Telefone</label>
                        <input type="text" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Plano</label>
                        <select value={formData.plan} onChange={(e) => setFormData({ ...formData, plan: e.target.value })}>
                            <option value="Premium">Premium</option>
                            <option value="Básico">Básico</option>
                            <option value="Empresarial">Empresarial</option>
                        </select>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                        <button type="submit" className="btn-primary">Salvar</button>
                    </div>
                </form>
            </Modal>
        </motion.div>
    );
};

export default ClientManager;
