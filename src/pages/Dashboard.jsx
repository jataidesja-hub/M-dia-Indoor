import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Video, Truck, Activity, Clock, Trophy, Signal, Power, ArrowUpRight } from 'lucide-react';
import { db, collections } from '../firebase';
import { collection, doc, onSnapshot } from "firebase/firestore";
import './Dashboard.css';

const Dashboard = () => {
    const [stats, setStats] = useState({
        drivers: [],
        clients: [],
        playlist: [],
        onlineCount: 0,
        activeCampaigns: 0
    });
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const unsubDrivers = onSnapshot(collection(db, collections.DRIVERS), (snap) => {
            const drivers = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setStats(prev => ({
                ...prev,
                drivers,
                onlineCount: drivers.filter(d => d.status === 'Online').length
            }));
        });

        const unsubClients = onSnapshot(collection(db, collections.CLIENTS), (snap) => {
            const clients = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setStats(prev => ({
                ...prev,
                clients,
                activeCampaigns: clients.filter(c => c.status === 'Ativo').length
            }));
        });

        const unsubPlaylist = onSnapshot(doc(db, 'global', 'playlist'), (snap) => {
            if (snap.exists()) {
                setStats(prev => ({ ...prev, playlist: snap.data().items || [] }));
            }
        });

        const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);

        return () => { unsubDrivers(); unsubClients(); unsubPlaylist(); clearInterval(timeInterval); };
    }, []);

    return (
        <div className="dash-premium-wrapper">
            <header className="dash-top-hero">
                <div className="hero-content">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <span className="live-badge"><span className="dot"></span> EM OPERAÇÃO</span>
                        <h1>Central de Controle</h1>
                        <p>Monitoramento global em tempo real.</p>
                    </motion.div>
                </div>
                <div className="hero-stats glass">
                    <div className="time-box"><Clock size={16} /><span>{currentTime.toLocaleTimeString('pt-BR')}</span></div>
                </div>
            </header>

            <div className="main-stats-grid">
                <StatCard icon={Truck} label="Veículos Online" value={stats.onlineCount} subValue={`de ${stats.drivers.length} totais`} color="emerald" />
                <StatCard icon={Users} label="Anunciantes Ativos" value={stats.activeCampaigns} subValue="Campanhas no ar" color="blue" />
                <StatCard icon={Video} label="Mídias na Grade" value={stats.playlist.length} subValue="Vídeos em rotação" color="purple" />
                <StatCard icon={Activity} label="Saúde da Rede" value="100%" subValue="Sincronia Nuvem" color="orange" />
            </div>

            <div className="dash-two-columns">
                <section className="fleet-monitor glass">
                    <div className="card-header">
                        <div className="title"><Signal size={18} /><h3>Status da Frota em Tempo Real</h3></div>
                    </div>
                    <div className="driver-monitor-list">
                        <AnimatePresence>
                            {stats.drivers.map(driver => (
                                <motion.div layout key={driver.id} className={`driver-status-card ${driver.status.toLowerCase()}`}>
                                    <div className="driver-avatar-box"><Power size={14} /></div>
                                    <div className="driver-details"><span className="name">{driver.name}</span><span className="vehicle">{driver.vehicle}</span></div>
                                    <div className="driver-status-badges">
                                        <span className={`status-tag ${driver.status.toLowerCase()}`}>{driver.status}</span>
                                        {driver.status === 'Online' && <span className="time-badge">Ativo</span>}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </section>

                <section className="performance-card glass">
                    <div className="card-header"><div className="title"><Trophy size={18} /><h3>Desempenho Semanal</h3></div></div>
                    <div className="performance-chart-mock">
                        <div className="bars-container">
                            {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                                <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} className="bar"></motion.div>
                            ))}
                        </div>
                        <div className="chart-labels"><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span><span>D</span></div>
                    </div>
                </section>
            </div>
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value, subValue, color }) => (
    <motion.div whileHover={{ y: -5, scale: 1.02 }} className={`stat-premium-card ${color}`}><div className="card-bg-effect"></div><div className="card-icon"><Icon size={28} /></div><div className="card-content"><span className="label">{label}</span><span className="value">{value}</span><span className="subvalue">{subValue}</span></div><div className="card-arrow"><ArrowUpRight size={16} /></div></motion.div>
);

export default Dashboard;
