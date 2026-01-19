import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Edit2, Trash2 } from 'lucide-react';
import Modal from '../components/Modal';
import { db, collections } from '../firebase';
import { collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import './VideoManager.css';

const DriverManager = () => {
    const [drivers, setDrivers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDriver, setEditingDriver] = useState(null);
    const [formData, setFormData] = useState({
        name: '', vehicle: '', email: '', password: '', status: 'Offline'
    });

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, collections.DRIVERS), (snapshot) => {
            const driversList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setDrivers(driversList);
        });
        return () => unsubscribe();
    }, []);

    const handleOpenModal = (driver = null) => {
        if (driver) {
            setEditingDriver(driver);
            setFormData({ ...driver });
        } else {
            setEditingDriver(null);
            setFormData({ name: '', vehicle: '', email: '', password: '', status: 'Offline' });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingDriver) {
                await updateDoc(doc(db, collections.DRIVERS, editingDriver.id), formData);
            } else {
                await addDoc(collection(db, collections.DRIVERS), formData);
            }
            setIsModalOpen(false);
        } catch (error) {
            alert('Erro ao salvar motorista: ' + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Excluir motorista?')) {
            await deleteDoc(doc(db, collections.DRIVERS, id));
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="manager-container">
            <header className="manager-header">
                <h1>Gestão de Motoristas</h1>
                <button className="btn-primary" onClick={() => handleOpenModal()}>
                    <UserPlus size={20} />
                    <span>Novo Motorista</span>
                </button>
            </header>

            <div className="table-container glass">
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>Motorista</th>
                            <th>Veículo</th>
                            <th>Acesso</th>
                            <th>Status</th>
                            <th className="text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {drivers.map((d) => (
                            <tr key={d.id}>
                                <td>{d.name}</td>
                                <td>{d.vehicle}</td>
                                <td>{d.email}</td>
                                <td><span className={`badge ${d.status === 'Online' ? 'success' : 'warning'}`}>{d.status}</span></td>
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
                    <div className="form-group"><label>Nome</label><input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
                    <div className="form-group"><label>Placa/Veículo</label><input type="text" required value={formData.vehicle} onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })} /></div>
                    <div className="form-grid">
                        <div className="form-group"><label>E-mail</label><input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></div>
                        <div className="form-group"><label>Senha</label><input type="text" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} /></div>
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
