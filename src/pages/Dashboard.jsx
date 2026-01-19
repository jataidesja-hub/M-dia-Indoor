import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    Video,
    TrendingUp,
    Clock,
    Activity,
    AlertCircle,
    Truck,
    MapPin,
    ShieldCheck,
    Pulse
} from 'lucide-react';
import './Dashboard.css';

const StatCard = ({ title, value, icon: Icon, trend, color, subtitle }) => (
    <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`stat-card-premium glass ${color}`}
    >
        <div className="stat-glow"></div>
        <div className="stat-content">
            <div className="stat-header">
                <div className="icon-badge">
                    <Icon size={24} />
                </div>
                {trend && (
                    <div className={`trend-tag ${trend.startsWith('+') ? 'positive' : 'neutral'}`}>
                        <TrendingUp size={12} />
                        <span>{trend}</span>
                    </div>
                )}
            </div>
            <div className="stat-main">
                <h3 className="stat-title">{title}</h3>
                <div className="value-container">
                    <span className="stat-value">{value}</span>
                </div>
                {subtitle && <p className="stat-subtitle">{subtitle}</p>}
            </div>
            <div className="stat-footer-progress">
                <div className="progress-bg">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '70%' }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="progress-fill"
                    ></motion.div>
                </div>
            </div>
        </div>
    </motion.div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalClients: 0,
        activeVideos: 0,
        onlineDrivers: 0,
        totalHours: 0,
        drivers: []
    });

    const updateDashboardData = () => {
        const clients = JSON.parse(localStorage.getItem('clients') || '[]');
        const activeClients = clients.filter(c => c.status === 'Ativo').length;
        const playlist = JSON.parse(localStorage.getItem('playlist') || '[]');
        const drivers = JSON.parse(localStorage.getItem('drivers') || '[]');
        const onlineDriversList = drivers.filter(d => d.status === 'Online');

        setStats({
            totalClients: activeClients,
            activeVideos: playlist.length,
            onlineDrivers: onlineDriversList.length,
            totalHours: (onlineDriversList.length * 12) + (Math.random() * 5), // Mock dynamic hours
            drivers: drivers
        });
    };

    useEffect(() => {
        updateDashboardData();
        // Polling para atualização "automática" de status
        const interval = setInterval(updateDashboardData, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="dashboard-wrapper">
            <header className="dash-hero">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="hero-text"
                >
                    <div className="live-indicator">
                        <span className="pulse-dot"></span>
                        SISTEMA EM OPERAÇÃO
                    </div>
                    <h1>Monitoramento Geral</h1>
                    <p>Controle de frota e exibição em tempo real.</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="dash-clock glass"
                >
                    <Clock size={20} className="text-primary" />
                    <div className="time-stack">
                        <span className="current-time">{new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="current-date">{new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}</span>
                    </div>
                </motion.div>
            </header>

            <div className="stats-grid-premium">
                <StatCard
                    title="Anunciantes Ativos"
                    value={stats.totalClients}
                    icon={Users}
                    trend="+12%"
                    color="blue-stat"
                    subtitle="Campanhas rodando agora"
                />
                <StatCard
                    title="Grade de Mídia"
                    value={stats.activeVideos}
                    icon={Video}
                    trend="+3"
                    color="purple-stat"
                    subtitle="Vídeos na playlist global"
                />
                <StatCard
                    title="Veículos Ativos"
                    value={stats.onlineDrivers}
                    icon={Truck}
                    trend="LIVE"
                    color="emerald-stat"
                    subtitle={`${stats.drivers.filter(d => d.status === 'Offline').length} desconectados`}
                />
                <StatCard
                    title="Tempo de Exposição"
                    value={`${Math.floor(stats.totalHours)}h`}
                    icon={Activity}
                    trend="+8%"
                    color="orange-stat"
                    subtitle="Acumulado do dia"
                />
            </div>

            <div className="dashboard-grid-main">
                <section className="fleet-status glass">
                    <div className="section-header">
                        <div className="title-with-icon">
                            <Truck size={20} />
                            <h3>Status da Frota</h3>
                        </div>
                        <div className="status-counts">
                            <span className="count-tag online">{stats.onlineDrivers} Online</span>
                            <span className="count-tag offline">{stats.drivers.length - stats.onlineDrivers} Offline</span>
                        </div>
                    </div>

                    <div className="driver-list-scroll">
                        <AnimatePresence mode='popLayout'>
                            {stats.drivers.length === 0 ? (
                                <div className="empty-dash">
                                    <AlertCircle size={40} opacity={0.2} />
                                    <p>Nenhum motorista cadastrado.</p>
                                </div>
                            ) : (
                                stats.drivers.map((driver) => (
                                    <motion.div
                                        layout
                                        key={driver.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className={`driver-card-dash ${driver.status.toLowerCase()}`}
                                    >
                                        <div className="driver-main-info">
                                            <div className="status-marker"></div>
                                            <div className="info-text">
                                                <p className="d-name">{driver.name}</p>
                                                <p className="d-vehicle">{driver.vehicle}</p>
                                            </div>
                                        </div>
                                        <div className="driver-meta">
                                            <div className="meta-item">
                                                <MapPin size={12} />
                                                <span>Rota Ativa</span>
                                            </div>
                                            <div className="status-label">
                                                {driver.status === 'Online' ? 'CONECTADO' : 'OFFLINE'}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </section>

                <section className="network-health glass">
                    <div className="section-header">
                        <div className="title-with-icon">
                            <ShieldCheck size={20} />
                            <h3>Saúde do Sistema</h3>
                        </div>
                    </div>

                    <div className="health-metrics">
                        <div className="metric-row">
                            <span>Sinal de GPS</span>
                            <div className="health-bar"><div className="fill green" style={{ width: '94%' }}></div></div>
                            <span className="pct">94%</span>
                        </div>
                        <div className="metric-row">
                            <span>Latência Média</span>
                            <div className="health-bar"><div className="fill blue" style={{ width: '20%' }}></div></div>
                            <span className="pct">32ms</span>
                        </div>
                        <div className="metric-row">
                            <span>Sincronia de Dados</span>
                            <div className="health-bar"><div className="fill purple" style={{ width: '100%' }}></div></div>
                            <span className="pct">100%</span>
                        </div>
                    </div>

                    <div className="live-activity-feed">
                        <h4>Atividade Recente</h4>
                        <div className="feed-item">
                            <div className="feed-icon"><Pulse size={14} /></div>
                            <div className="feed-text">
                                <p><strong>Campanha Coca-Cola</strong> iniciada em 4 veículos.</p>
                                <span>Há 2 min</span>
                            </div>
                        </div>
                        <div className="feed-item">
                            <div className="feed-icon"><Users size={14} /></div>
                            <div className="feed-text">
                                <p>Novo anunciante <strong>Super Premium</strong> aprovado.</p>
                                <span>Há 15 min</span>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
