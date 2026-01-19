import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Search, Edit2, Trash2, Mail, Lock, Truck } from 'lucide-react';
import Modal from '../components/Modal';
import './VideoManager.css';

const DriverManager = () => {
    const [drivers, setDrivers] = useState(() => {
        const saved = localStorage.getItem('drivers');
        return saved ? JSON.parse(saved) : [
            { id: 1, name: 'Carlos Santos', vehicle: 'Van XP-2030', email: 'carlos@driver.com', password: '123', status: 'Offline', lastSeen: '19/01/2026 10:00' },
            { id: 2, name: 'Roberto Lima', vehicle: 'Sedan ABC-1234', email: 'roberto@driver.com', password: '123', status: 'Offline', lastSeen: '18/01/2026 15:30' },
        ];
    });

    useEffect(() => {
        localStorage.setItem('drivers', JSON.stringify(drivers));
    }, [drivers]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDriver, setEditingDriver] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        vehicle: '',
        email: '',
        password: '',
        status: 'Offline'
    });

    const handleOpenModal = (driver = null) => {
        if (driver) {
            setEditingDriver(driver);
            setFormData({
                name: driver.name,
                vehicle: driver.vehicle,
                email: driver.email,
                password: driver.password,
                status: driver.status
            });
        } else {
            setEditingDriver(null);
            setFormData({
                name: '',
                vehicle: '',
                email: '',
                password: '',
                status: 'Offline'
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        const driverData = {
            ...formData,
            lastSeen: editingDriver ? editingDriver.lastSeen : 'Nunca'
        };

        if (editingDriver) {
            setDrivers(drivers.map(d => d.id === editingDriver.id ? { ...d, ...driverData } : d));
        } else {
            setDrivers([...drivers, { id: Date.now(), ...driverData }]);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('Excluir motorista?')) {
            setDrivers(drivers.filter(d => d.id !== id));
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="manager-container">
            <header className="manager-header">
                <h1>Gerenciamento de Motoristas</h1>
                <button className="btn-primary" onClick={() => handleOpenModal()}>
                    <UserPlus size={20} />
                    <span>Novo Motorista</span>
                </button>
            </header>

            <div className="filters-bar glass">
                <div className="search-box">
                    <Search size={18} className="search-icon" />
                    <input type="text" placeholder="Buscar por nome, e-mail ou veículo..." />
                </div>
            </div>

            <div className="table-container glass">
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>Motorista</th>
                            <th>Veículo</th>
                            <th>Acesso (E-mail)</th>
                            <th>Senha</th>
                            <th>Status</th>
                            <th className="text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {drivers.map((d) => (
                            <tr key={d.id}>
                                <td>
                                    <div className="driver-cell">
                                        <div className="driver-avatar"><UserPlus size={14} /></div>
                                        <span>{d.name}</span>
                                    </div>
                                </td>
                                <td>{d.vehicle}</td>
                                <td>{d.email}</td>
                                <td>
                                    <span style={{ fontFamily: 'monospace', opacity: 0.6 }}>••••••</span>
                                </td>
                                <td>
                                    <span className={`badge ${d.status === 'Online' ? 'success' : 'warning'}`}>
                                        {d.status}
                                    </span>
                                </td>
                                <td className="text-right">
                                    <div className="action-buttons">
                                        <button className="icon-btn edit" onClick={() => handleOpenModal(d)}><Edit2 size={16} /></button>
                                        <button className="icon-btn delete" onClick={() => handleDelete(d.id)}><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingDriver ? "Editar Motorista" : "Novo Motorista"}>
                <form onSubmit={handleSave}>
                    <div className="form-group">
                        <label>Nome Completo</label>
                        <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    </div>

                    <div className="form-group">
                        <label>Veículo / Identificação</label>
                        <div className="input-with-icon">
                            <Truck size={18} />
                            <input type="text" required placeholder="Ex: Van XP-2030" value={formData.vehicle} onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })} />
                        </div>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>E-mail de Acesso</label>
                            <div className="input-with-icon">
                                <Mail size={18} />
                                <input type="email" required placeholder="motorista@midia.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Senha</label>
                            <div className="input-with-icon">
                                <Lock size={18} />
                                <input type="text" required placeholder="Senha de acesso" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Status Inicial</label>
                        <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                            <option value="Online">Online</option>
                            <option value="Offline">Offline</option>
                        </select>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                        <button type="submit" className="btn-primary">Salvar Motorista</button>
                    </div>
                </form>
            </Modal>
        </motion.div>
    );
};

export default DriverManager;
