import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import './Login.css';

const Login = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const target = searchParams.get('to') || 'admin';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // Pre-registered credentials for demo
        if (email === 'admin@midia.com' && password === 'admin123') {
            localStorage.setItem('isAuthenticated', 'true');
            if (target === 'display') {
                navigate('/display');
            } else {
                navigate('/admin/dashboard');
            }
        } else {
            setError('Credenciais inválidas. Tente admin@midia.com / admin123');
        }
    };

    return (
        <div className="login-container">
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="back-btn"
                onClick={() => navigate('/')}
            >
                <ArrowLeft size={20} />
                <span>Voltar</span>
            </motion.button>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="login-card glass"
            >
                <div className="login-header">
                    <div className="lock-icon">
                        <Lock size={32} />
                    </div>
                    <h1>Acesso Restrito</h1>
                    <p>Faça login para acessar o {target === 'display' ? 'Player' : 'Painel ADM'}.</p>
                </div>

                <form onSubmit={handleLogin} className="login-form">
                    {error && <div className="login-error">{error}</div>}

                    <div className="input-group">
                        <label>E-mail</label>
                        <div className="input-wrapper">
                            <User size={18} className="input-icon" />
                            <input
                                type="email"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Senha</label>
                        <div className="input-wrapper">
                            <Lock size={18} className="input-icon" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="eye-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="login-submit">
                        Entrar no Sistema
                    </button>
                </form>

                <div className="login-footer">
                    <p>Esqueceu sua senha? Entre em contato com o suporte.</p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
