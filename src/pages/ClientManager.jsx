import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, UserPlus, Mail, Phone, Calendar } from 'lucide-react';
import './VideoManager.css'; // Reusing manager styles

const ClientManager = () => {
    const [clients, setClients] = useState([
        { id: 1, name: 'João Silva', email: 'joao@transporte.com', phone: '(11) 99999-9999', plan: 'Premium', status: 'Ativo' },
        { id: 2, name: 'Maria Santos', email: 'maria@logistica.com', phone: '(11) 88888-8888', plan: 'Básico', status: 'Inativo' },
    ]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="manager-container"
        >
            <header className="manager-header">
                <h1>Gerenciamento de Clientes</h1>
                <button className="btn-primary">
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
                                    {/* Placeholder for actions */}
                                    <button className="icon-btn">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default ClientManager;
