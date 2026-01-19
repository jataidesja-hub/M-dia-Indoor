import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Video,
    Users,
    Truck,
    MonitorPlay,
    LogOut,
    Menu
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // If it's a driver, we'd handle offline status here too if they were in admin, 
        // but drivers only access /display. Admin is admin.
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userRole');
        localStorage.removeItem('currentUserId');
        localStorage.removeItem('currentUserName');
        navigate('/');
    };

    return (
        <aside className="sidebar glass">
            <div className="sidebar-header">
                <div className="logo">
                    <MonitorPlay size={24} color="var(--primary)" />
                    <span>Mídia Indoor</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <LayoutDashboard size={20} />
                    <span>Painel</span>
                </NavLink>
                <NavLink to="/admin/videos" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <Video size={20} />
                    <span>Vídeos</span>
                </NavLink>
                <NavLink to="/admin/clients" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <Users size={20} />
                    <span>Clientes</span>
                </NavLink>
                <NavLink to="/admin/drivers" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <Truck size={20} />
                    <span>Motoristas</span>
                </NavLink>
            </nav>

            <div className="sidebar-footer">
                <button onClick={handleLogout} className="logout-btn">
                    <LogOut size={20} />
                    <span>Sair do Sistema</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
