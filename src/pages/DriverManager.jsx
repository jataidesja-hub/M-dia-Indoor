import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Truck, Phone, MapPin } from 'lucide-react';
import './VideoManager.css';

const DriverManager = () => {
    const [drivers, setDrivers] = useState([
        { id: 1, name: 'Carlos Oliveira', vehicle: 'Van #12', status: 'Online', hours: '45h' },
        { id: 2, name: 'Roberto Lima', vehicle: 'Sedan #03', status: 'Offline', hours: '12h' },
    ]);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="manager-container">
            <header className="manager-header">
                <h1>Gerenciamento de Motoristas</h1>
                <button className="btn-primary">
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

export default DriverManager;
