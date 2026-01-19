import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    Video,
    Truck,
    Activity,
    Clock,
    Trophy,
    AlertCircle,
    Signal,
    Power,
    ArrowUpRight
} from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
    const [stats, setStats] = useState({
        clients: [],
        playlist: [],
        drivers: [],
        onlineCount: 0,
        activeCampaigns: 0
    });

    const [currentTime, setCurrentTime] = useState(new Date());

    const refreshData = () => {
        const drivers = JSON.parse(localStorage.getItem('drivers') || '[]');
        const clients = JSON.parse(localStorage.getItem('clients') || '[]');
        const playlist = JSON.parse(localStorage.getItem('playlist') || '[]');

        setStats({
            drivers,
            clients,
            playlist,
            onlineCount: drivers.filter(d => d.status === 'Online').length,
            activeCampaigns: clients.filter(c => c.status === 'Ativo').length
        });
        setCurrentTime(new Date());
    };

    useEffect(() => {
        refreshData();
        const interval = setInterval(refreshData, 3000); // Atualiza a cada 3s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="dash-premium-wrapper">
            {/* Top Bar / Hero */}
            <header className="dash-top-hero">
                <div className="hero-content">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <span className="live-badge">
                            <span className="dot"></span> EM OPERAÇÃO
                        </span>
                        <h1>Central de Controle</h1>
                        <p>Monitoramento global da rede de mídia indoor.</p>
                    </motion.div>
                </div>

                <div className="hero-stats glass">
                    <div className="time-box">
                        <Clock size={16} />
                        <span>{currentTime.toLocaleTimeString('pt-BR')}</span>
                    </div>
                </div>
            </header>

            {/* Main Stats Grid */}
            <div className="main-stats-grid">
                <StatCard
                    icon={Truck}
                    label="Veículos Online"
                    value={stats.onlineCount}
                    subValue={`de ${stats.drivers.length} totais`}
                    color="emerald"
                />
                <StatCard
                    icon={Users}
                    label="Anunciantes Ativos"
                    value={stats.activeCampaigns}
                    subValue="Campanhas no ar"
                    color="blue"
                />
                <StatCard
                    icon={Video}
                    label="Mídias na Grade"
                    value={stats.playlist.length}
                    subValue="Vídeos em rotação"
                    color="purple"
                />
                <StatCard
                    icon={Activity}
                    label="Saúde da Rede"
                    value="98.5%"
                    subValue="Uptime garantido"
                    color="orange"
                />
            </div>

            <div className="dash-two-columns">
                {/* Fleet Monitor */}
                <section className="fleet-monitor glass">
                    <div className="card-header">
                        <div className="title">
                            <Signal size={18} />
                            <h3>Status da Frota em Tempo Real</h3>
                        </div>
                        <span className="pulse-text">Painel Dinâmico</span>
                    </div>

                    <div className="driver-monitor-list">
                        <AnimatePresence>
                            {stats.drivers.length === 0 ? (
                                <div className="empty-state">
                                    <AlertCircle size={32} />
                                    <p>Nenhum motorista cadastrado ainda.</p>
                                </div>
                            ) : (
                                stats.drivers.map(driver => (
                                    <motion.div
                                        layout
                                        key={driver.id}
                                        className={`driver-status-card ${driver.status.toLowerCase()}`}
                                    >
                                        <div className="driver-avatar-box">
                                            <Power size={14} />
                                        </div>
                                        <div className="driver-details">
                                            <span className="name">{driver.name}</span>
                                            <span className="vehicle">{driver.vehicle}</span>
                                        </div>
                                        <div className="driver-status-badges">
                                            <span className={`status-tag ${driver.status.toLowerCase()}`}>
                                                {driver.status}
                                            </span>
                                            {driver.status === 'Online' && (
                                                <span className="time-badge">Ativo Agora</span>
                                            )}
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </section>

                {/* Network Performance */}
                <section className="performance-card glass">
                    <div className="card-header">
                        <div className="title">
                            <Trophy size={18} />
                            <h3>Desempenho da Rede</h3>
                        </div>
                    </div>

                    <div className="performance-chart-mock">
                        <div className="bars-container">
                            {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    className="bar"
                                ></motion.div>
                            ))}
                        </div>
                        <div className="chart-labels">
                            <span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span><span>D</span>
                        </div>
                    </div>

                    <div className="mini-stats">
                        <div className="m-stat">
                            <span>Alcance Diário</span>
                            <strong>+1.2k views</strong>
                        </div>
                        <div className="m-stat">
                            <span>Média por Tablet</span>
                            <strong>4.2h / dia</strong>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value, subValue, color }) => (
    <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        className={`stat-premium-card ${color}`}
    >
        <div className="card-bg-effect"></div>
        <div className="card-icon">
            <Icon size={28} />
        </div>
        <div className="card-content">
            <span className="label">{label}</span>
            <span className="value">{value}</span>
            <span className="subvalue">{subValue}</span>
        </div>
        <div className="card-arrow">
            <ArrowUpRight size={16} />
        </div>
    </motion.div>
);

export default Dashboard;
