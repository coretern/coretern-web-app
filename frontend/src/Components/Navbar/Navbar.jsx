import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon, User, LogOut, LayoutDashboard, ChevronDown, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import './Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        const handleScroll = () => {
            if (location.pathname === '/') {
                setScrolled(window.scrollY > 50);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [location]);

    // Check auth and current route
    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);

        // Always show background if not on home page
        if (location.pathname !== '/') {
            setScrolled(true);
        } else {
            setScrolled(window.scrollY > 20);
        }
    }, [location]);

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.user-menu-wrapper')) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUserMenuOpen(false);
        navigate('/');
    };

    const handleLogoClick = () => {
        if (location.pathname === '/') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleNavLinkClick = (path) => {
        setIsOpen(false);
        if (location.pathname === '/' && path === '/') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
        { name: 'Internships', path: '/internships' },
        { name: 'Verify', path: '/verify' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="container nav-container">
                <Link to="/" className="nav-brand outfit" onClick={handleLogoClick}>
                    <img
                        src={theme === 'dark' ? "/coretern_Navbar_Logo_dark.png" : "/coretern_Navbar_Logo_light.png"}
                        alt="CoreTern"
                        className="nav-logo"
                        style={{ height: '32px', width: 'auto' }}
                    />
                </Link>

                <div className="nav-links">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                            onClick={() => handleNavLinkClick(link.path)}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div className="nav-actions-right">
                    <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    {isLoggedIn ? (
                        <div className="user-menu-wrapper">
                            <button
                                className="user-menu-trigger"
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                            >
                                <div className="user-avatar">
                                    <User size={16} />
                                </div>
                                <span>My Account</span>
                                <ChevronDown size={14} className={`chevron ${userMenuOpen ? 'open' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {userMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                        transition={{ duration: 0.15 }}
                                        className="user-dropdown glass"
                                    >
                                        <Link to="/dashboard" onClick={() => setUserMenuOpen(false)} className="dropdown-item">
                                            <LayoutDashboard size={16} />
                                            Dashboard
                                        </Link>
                                        <Link to="/dashboard" state={{ tab: 'settings' }} onClick={() => setUserMenuOpen(false)} className="dropdown-item">
                                            <Settings size={16} />
                                            Settings
                                        </Link>
                                        <div className="dropdown-divider" />
                                        <button onClick={handleLogout} className="dropdown-item text-danger">
                                            <LogOut size={16} />
                                            Sign Out
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="auth-btns">
                            <Link to="/login" className="btn btn-primary btn-sm">Login</Link>
                        </div>
                    )}

                    {/* Mobile toggle */}
                    <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mobile-menu glass"
                    >
                        <div className="mobile-menu-inner">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => handleNavLinkClick(link.path)}
                                    className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="mobile-auth">
                                {isLoggedIn ? (
                                    <>
                                        <Link to="/dashboard" onClick={() => setIsOpen(false)} className="btn btn-outline w-full justify-center">
                                            <LayoutDashboard size={16} /> Dashboard
                                        </Link>
                                        <Link to="/dashboard" state={{ tab: 'settings' }} onClick={() => setIsOpen(false)} className="btn btn-outline w-full justify-center">
                                            <Settings size={16} /> Profile Settings
                                        </Link>
                                        <button onClick={() => { handleLogout(); setIsOpen(false); }} className="btn btn-danger w-full justify-center">
                                            <LogOut size={16} /> Sign Out
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login" onClick={() => setIsOpen(false)} className="btn btn-primary w-full justify-center">Login</Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
