import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Users, LogOut, Rocket, Sun, Moon, LifeBuoy } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';
import './Sidebar.css';

const Sidebar = () => {
    const { theme, toggleTheme } = useTheme();

    const handleLogout = () => {
        localStorage.removeItem('token');
        toast.success('Admin Logged Out');
        window.location.href = '/login';
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo-icon-bg" style={{ background: 'var(--grad-primary)', padding: '8px', borderRadius: '10px', color: 'white' }}>
                    <Rocket size={24} />
                </div>
                <span className="outfit">CoreTern</span>
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
                    <LayoutDashboard size={20} /> <span>Dashboard</span>
                </NavLink>
                <NavLink to="/students" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
                    <Rocket size={20} /> <span>Total Users</span>
                </NavLink>
                <NavLink to="/internships" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
                    <BookOpen size={20} /> <span>Internships</span>
                </NavLink>
                <NavLink to="/enrollments" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
                    <Users size={20} /> <span>Enrollments</span>
                </NavLink>
                <NavLink to="/tickets" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
                    <LifeBuoy size={20} /> <span>Tickets</span>
                </NavLink>
            </nav>

            <div className="sidebar-footer" style={{ padding: '0 1.5rem', marginBottom: '1.5rem' }}>
                <button
                    onClick={toggleTheme}
                    className="btn btn-outline w-full"
                    style={{ justifyContent: 'flex-start', border: '1px solid var(--border)' }}
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
            </div>

            <button onClick={handleLogout} className="btn btn-danger logout-btn w-full">
                <LogOut size={20} /> <span>Logout</span>
            </button>
        </aside>
    );
};

export default Sidebar;
