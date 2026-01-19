import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const redirectTo = searchParams.get('to') || 'admin';

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');

        // Admin Credentials
        if (email === 'admin@midia.com' && password === 'admin123') {
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userRole', 'admin');
            navigate('/admin/dashboard');
            return;
        }

        // Driver Credentials
        const drivers = JSON.parse(localStorage.getItem('drivers') || '[]');
        const driver = drivers.find(d => d.email === email && d.password === password);

        if (driver) {
            // Mark driver as Online
            const updatedDrivers = drivers.map(d =>
                d.id === driver.id
                    ? { ...d, status: 'Online', lastSeen: new Date().toLocaleString('pt-BR') }
                    : d
            );
            localStorage.setItem('drivers', JSON.stringify(updatedDrivers));

            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userRole', 'driver');
            localStorage.setItem('currentUserId', driver.id);
            localStorage.setItem('currentUserName', driver.name);

            navigate('/display');
            return;
        }

        setError('E-mail ou senha incorretos.');
    };

    return (
        <div className="login-page">
            <div className="login-bg-glow"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="login-card glass"
            >
                <div className="login-header">
                    <div className="logo-container">
                        <LogIn size={32} color="var(--primary)" />
                    </div>
                    <h1>Mídia Indoor</h1>
                    <p>{redirectTo === 'admin' ? 'Acesso Administrativo' : 'Acesso do Motorista'}</p>
                </div>

                <form onSubmit={handleLogin}>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="error-message"
                        >
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </motion.div>
                    )}

                    <div className="form-group">
                        <label>E-mail</label>
                        <div className="input-wrapper">
                            <Mail size={18} className="input-icon" />
                            <input
                                type="email"
                                placeholder="nome@exemplo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Senha</label>
                        <div className="input-wrapper">
                            <Lock size={18} className="input-icon" />
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="login-btn btn-primary">
                        Acessar Sistema
                    </button>
                </form>

                <div className="login-footer">
                    <p>© 2026 Media Indoor Tablet</p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
