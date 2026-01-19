import React from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Video,
    Clock,
    Activity,
    TrendingUp,
    Signal
} from 'lucide-react';
import StatsCard from '../components/StatsCard';
import './Dashboard.css';

const Dashboard = () => {
    const stats = [
        { title: 'Dispositivos Online', value: '12', icon: Signal, color: '#10b981', trend: '+2 hoje' },
        { title: 'Vídeos Ativos', value: '48', icon: Video, color: '#3b82f6', trend: 'Total da rede' },
        { title: 'Clientes', value: '24', icon: Users, color: '#8b5cf6', trend: '+3 este mês' },
        { title: 'Tempo Exibição', value: '124h', icon: Clock, color: '#f59e0b', trend: 'Últimas 24h' }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="dashboard-container"
        >
            <header className="dashboard-header">
                <div>
                    <h1>Dashboard Geral</h1>
                    <p>Bem-vindo ao sistema de controle de mídia indoor.</p>
                </div>
                <div className="current-status animate-pulse">
                    <div className="status-indicator"></div>
                    Sistema Operacional
                </div>
            </header>

            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <StatsCard key={index} {...stat} delay={index * 0.1} />
                ))}
            </div>

            <div className="dashboard-content-grid">
                <div className="content-card glass main-chart">
                    <h3>Frequência de Exibição</h3>
                    <div className="placeholder-chart">
                        <Activity size={48} className="muted-icon" />
                        <p>Gráfico de performance em tempo real</p>
                    </div>
                </div>

                <div className="content-card glass recent-activity">
                    <h3>Atividade Recente</h3>
                    <div className="activity-list">
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="activity-item">
                                <div className="activity-icon blue">
                                    <Video size={16} />
                                </div>
                                <div className="activity-info">
                                    <p className="activity-title">Novo vídeo configurado</p>
                                    <p className="activity-time">Há 5 minutos - Tablet #04</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
