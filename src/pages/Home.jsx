import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MonitorPlay, Settings, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <div className="home-bg-glow"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="home-content"
            >
                <header className="home-header">
                    <div className="logo-badge">
                        <MonitorPlay size={40} className="primary-icon" />
                    </div>
                    <h1>Mídia Indoor <span className="gradient-text">Pro</span></h1>
                    <p>Sistema inteligente de exibição e gerenciamento de mídias para tablets.</p>
                </header>

                <div className="home-grid">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="home-card glass"
                        onClick={() => navigate('/login?to=display')}
                    >
                        <div className="card-icon-box blue">
                            <MonitorPlay size={32} />
                        </div>
                        <h2>Reproduzir Mídia</h2>
                        <p>Acesse o player para começar a exibição dos conteúdos no tablet.</p>
                        <div className="card-footer">
                            <span>Acessar Player</span>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="home-card glass"
                        onClick={() => navigate('/login?to=admin')}
                    >
                        <div className="card-icon-box purple">
                            <ShieldCheck size={32} />
                        </div>
                        <h2>Painel Administrativo</h2>
                        <p>Gerencie vídeos, clientes, motoristas e monitore o status do sistema.</p>
                        <div className="card-footer">
                            <span>Acessar Painel</span>
                        </div>
                    </motion.div>
                </div>

                <footer className="home-footer">
                    <p>&copy; 2026 Mídia Indoor Pro. Todos os direitos reservados.</p>
                </footer>
            </motion.div>
        </div>
    );
};

export default Home;
