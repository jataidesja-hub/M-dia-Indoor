import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Video,
    Users,
    Truck,
    Settings,
    MonitorPlay,
    LogOut
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
    return (
        <aside className="sidebar glass">
            <div className="sidebar-logo">
                <MonitorPlay size={32} color="var(--primary)" />
                <span>Mídia Indoor</span>
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink to="/admin/videos" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <Video size={20} />
                    <span>Vídeos</span>
                </NavLink>

                <NavLink to="/admin/clients" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <Users size={20} />
                    <span>Clientes</span>
                </NavLink>

                <NavLink to="/admin/drivers" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <Truck size={20} />
                    <span>Motoristas</span>
                </NavLink>

                <div className="nav-divider"></div>

                <NavLink to="/display" className="nav-item display-link" target="_blank">
                    <MonitorPlay size={20} />
                    <span>Abrir Player</span>
                </NavLink>
            </nav>

            <div className="sidebar-footer">
                <button className="nav-item logout">
                    <LogOut size={20} />
                    <span>Sair</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
