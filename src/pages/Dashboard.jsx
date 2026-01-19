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
        { title: 'Dispositivos Online', value: '0', icon: Signal, color: '#10b981', trend: 'Aguardando conexão' },
        { title: 'Vídeos Ativos', value: '0', icon: Video, color: '#3b82f6', trend: 'Nenhum vídeo' },
        { title: 'Clientes', value: '0', icon: Users, color: '#8b5cf6', trend: 'Inicie agora' },
        { title: 'Tempo Exibição', value: '0h', icon: Clock, color: '#f59e0b', trend: 'Sem atividade' }
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
                        <div className="activity-placeholder">
                            <p>Nenhuma atividade registrada ainda.</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
