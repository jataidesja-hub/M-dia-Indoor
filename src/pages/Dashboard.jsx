import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Video,
    TrendingUp,
    Clock,
    Activity,
    AlertCircle,
    Truck
} from 'lucide-react';
import './Dashboard.css';

const StatCard = ({ title, value, icon: Icon, trend, color }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="stat-card glass"
    >
        <div className="stat-header">
            <div className={`stat-icon-container ${color}`}>
                <Icon size={24} />
            </div>
            {trend && (
                <div className="stat-trend positive">
                    <TrendingUp size={16} />
                    <span>{trend}</span>
                </div>
            )}
        </div>
        <div className="stat-body">
            <h3>{title}</h3>
            <p className="stat-value">{value}</p>
        </div>
    </motion.div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalClients: 0,
        activeVideos: 0,
        onlineDrivers: 0,
        totalHours: 0
    });

    useEffect(() => {
        // Get Clients
        const clients = JSON.parse(localStorage.getItem('clients') || '[]');
        const activeClients = clients.filter(c => c.status === 'Ativo').length;

        // Get Playlist
        const playlist = JSON.parse(localStorage.getItem('playlist') || '[]');

        // Get Drivers
        const drivers = JSON.parse(localStorage.getItem('drivers') || '[]');
        const onlineDriversCount = drivers.filter(d => d.status === 'Online').length;

        setStats({
            totalClients: activeClients,
            activeVideos: playlist.length,
            onlineDrivers: onlineDriversCount,
            totalHours: onlineDriversCount * 2.5 // Mock hours for visual impact
        });
    }, []);

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div>
                    <h1>Olá, Administrador</h1>
                    <p>Aqui está o que está acontecendo no seu sistema hoje.</p>
                </div>
                <div className="current-date glass">
                    <Clock size={18} />
                    <span>{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                </div>
            </header>

            <div className="stats-grid">
                <StatCard
                    title="Clientes Ativos"
                    value={stats.totalClients}
                    icon={Users}
                    trend="+12%"
                    color="blue"
                />
                <StatCard
                    title="Vídeos em Exibição"
                    value={stats.activeVideos}
                    icon={Video}
                    trend="+5%"
                    color="purple"
                />
                <StatCard
                    title="Motoristas Online"
                    value={stats.onlineDrivers}
                    icon={Truck}
                    trend="Estável"
                    color="green"
                />
                <StatCard
                    title="Tempo Total de Exibição"
                    value={`${Math.round(stats.totalHours)}h`}
                    icon={Activity}
                    trend="+18%"
                    color="orange"
                />
            </div>

            <div className="dashboard-content-grid">
                <div className="content-card glass main-chart">
                    <div className="card-header">
                        <h3>Desempenho da Rede</h3>
                        <select className="glass-select">
                            <option>Últimos 7 dias</option>
                            <option>Último mês</option>
                        </select>
                    </div>
                    <div className="chart-placeholder">
                        <Activity size={48} className="chart-icon" />
                        <p>Gráficos de atividade em tempo real serão exibidos aqui.</p>
                    </div>
                </div>

                <div className="content-card glass recent-activity">
                    <div className="card-header">
                        <h3>Atividade dos Motoristas</h3>
                        <button className="text-btn">Ver todos</button>
                    </div>
                    <div className="activity-list">
                        {stats.onlineDrivers === 0 ? (
                            <div className="empty-state">
                                <AlertCircle size={24} />
                                <p>Nenhum motorista online no momento.</p>
                            </div>
                        ) : (
                            JSON.parse(localStorage.getItem('drivers') || '[]')
                                .filter(d => d.status === 'Online')
                                .map(d => (
                                    <div key={d.id} className="activity-item">
                                        <div className="activity-dot online"></div>
                                        <div className="activity-info">
                                            <p className="driver-name">{d.name}</p>
                                            <p className="vehicle-tag">{d.vehicle}</p>
                                        </div>
                                        <span className="time-tag">Agora</span>
                                    </div>
                                ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
