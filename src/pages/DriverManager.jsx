import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, Search, Edit2, Trash2 } from 'lucide-react';
import Modal from '../components/Modal';
import './VideoManager.css';

const DriverManager = () => {
    const [drivers, setDrivers] = useState([
        { id: 1, name: 'Carlos Oliveira', vehicle: 'Van #12', status: 'Online', hours: '45h' },
        { id: 2, name: 'Roberto Lima', vehicle: 'Sedan #03', status: 'Offline', hours: '12h' },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDriver, setEditingDriver] = useState(null);
    const [formData, setFormData] = useState({ name: '', vehicle: '', status: 'Online', hours: '0h' });

    const handleOpenModal = (driver = null) => {
        if (driver) {
            setEditingDriver(driver);
            setFormData({ name: driver.name, vehicle: driver.vehicle, status: driver.status, hours: driver.hours });
        } else {
            setEditingDriver(null);
            setFormData({ name: '', vehicle: '', status: 'Online', hours: '0h' });
        }
        setIsModalOpen(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (editingDriver) {
            setDrivers(drivers.map(d => d.id === editingDriver.id ? { ...d, ...formData } : d));
        } else {
            setDrivers([...drivers, { id: Date.now(), ...formData }]);
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
                    <Truck size={20} />
                    <span>Novo Motorista</span>
                </button>
            </header>
            <div className="filters-bar glass">
                <div className="search-box">
                    <Search size={18} className="search-icon" />
                    <input type="text" placeholder="Buscar motorista..." />
                </div>
            </div>
            <div className="table-container glass">
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Veículo</th>
                            <th>Status</th>
                            <th>Horas Online</th>
                            <th className="text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {drivers.map((d) => (
                            <tr key={d.id}>
                                <td>{d.name}</td>
                                <td>{d.vehicle}</td>
                                <td>
                                    <span className={`badge ${d.status === 'Online' ? 'success' : 'warning'}`}>
                                        {d.status}
                                    </span>
                                </td>
                                <td>{d.hours}</td>
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
                        <label>Nome do Motorista</label>
                        <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Veículo / Identificação</label>
                        <input type="text" required value={formData.vehicle} onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Status</label>
                        <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                            <option value="Online">Online</option>
                            <option value="Offline">Offline</option>
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

export default DriverManager;
