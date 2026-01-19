import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { db, collections } from '../firebase';
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const redirectTo = searchParams.get('to') || 'admin';

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoggingIn(true);

        if (email === 'admin@midia.com' && password === 'admin123') {
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userRole', 'admin');
            navigate('/admin/dashboard');
            return;
        }

        try {
            const querySnapshot = await getDocs(collection(db, collections.DRIVERS));
            const drivers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const driver = drivers.find(d => d.email === email && d.password === password);

            if (driver) {
                await updateDoc(doc(db, collections.DRIVERS, driver.id), {
                    status: 'Online',
                    lastSeen: new Date().toLocaleString('pt-BR')
                });

                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('userRole', 'driver');
                localStorage.setItem('currentUserId', driver.id);
                localStorage.setItem('currentUserName', driver.name);

                navigate('/display');
            } else {
                setError('E-mail ou senha incorretos.');
            }
        } catch (err) {
            setError('Erro de conexão: ' + err.message);
        } finally {
            setIsLoggingIn(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-bg-glow"></div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="login-card glass">
                <div className="login-header">
                    <div className="logo-container"><LogIn size={32} color="var(--primary)" /></div>
                    <h1>Mídia Indoor</h1>
                    <p>{redirectTo === 'admin' ? 'Painel ADM' : 'Acesso de Motorista'}</p>
                </div>

                <form onSubmit={handleLogin}>
                    {error && <div className="error-message"><AlertCircle size={18} /><span>{error}</span></div>}
                    <div className="form-group"><label>E-mail</label><div className="input-wrapper"><Mail size={18} className="input-icon" /><input type="email" placeholder="nome@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required /></div></div>
                    <div className="form-group"><label>Senha</label><div className="input-wrapper"><Lock size={18} className="input-icon" /><input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required /></div></div>
                    <button type="submit" className="login-btn btn-primary" disabled={isLoggingIn}>{isLoggingIn ? 'Entrando...' : 'Acessar'}</button>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
