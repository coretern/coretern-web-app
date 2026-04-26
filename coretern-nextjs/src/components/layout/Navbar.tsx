'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Sun, Moon, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<any>(null);
    const pathname = usePathname();
    const router = useRouter();
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        const handleScroll = () => {
            if (pathname === '/') {
                setScrolled(window.scrollY > 50);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [pathname]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
        
        if (token) {
            import('@/lib/api').then(({ authAPI }) => {
                authAPI.me()
                    .then(res => setUser(res.data))
                    .catch(() => {
                        // Silently handle if token is invalid or expired
                        localStorage.removeItem('token');
                        setIsLoggedIn(false);
                        setUser(null);
                    });
            });
        } else {
            setUser(null);
        }

        if (pathname !== '/') {
            setScrolled(true);
        } else {
            setScrolled(window.scrollY > 20);
        }
    }, [pathname]);

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
        router.push('/');
    };

    const handleLogoClick = () => {
        if (pathname === '/') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleNavLinkClick = (path) => {
        setIsOpen(false);
        if (pathname === '/' && path === '/') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Internships', path: '/internships' },
        { name: 'Verify', path: '/verify' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <nav style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1000, padding: scrolled ? '0.85rem 0' : '1.2rem 0', transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)', background: scrolled ? 'var(--background)' : 'transparent', borderBottom: scrolled ? '1px solid var(--border)' : 'none', boxShadow: scrolled ? '0 2px 12px rgba(0,0,0,0.06)' : 'none' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
                <Link href="/" className="flex items-center gap-[0.65rem] text-[1.35rem] font-extrabold shrink-0 font-[family-name:var(--font-outfit)]" onClick={handleLogoClick}>
                    <Image
                        src={theme === 'dark' ? "/coretern_Navbar_Logo_dark.png" : "/coretern_Navbar_Logo_light.png"}
                        alt="CoreTern"
                        width={120}
                        height={32}
                        className="h-8 w-auto"
                        priority
                    />
                </Link>

                {/* Desktop Nav Links */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flex: 1, justifyContent: 'center' }} className="nav-links-desktop">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.path}
                            style={{
                                padding: '0.5rem 0.9rem',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '0.9rem',
                                fontWeight: 500,
                                transition: 'all 0.3s',
                                color: pathname === link.path ? 'var(--color-primary)' : 'var(--text-muted)',
                                background: pathname === link.path ? 'rgba(99,102,241,0.1)' : 'transparent',
                            }}
                            onClick={() => handleNavLinkClick(link.path)}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                    {/* Theme Toggle */}
                    <button
                        style={{ width: '36px', height: '36px', background: 'var(--surface-1)', border: '1px solid var(--border)', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-sm)', transition: 'all 0.3s', flexShrink: 0 }}
                        onClick={toggleTheme}
                        aria-label="Toggle Theme"
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {/* Auth / User Menu (Desktop) */}
                    {isLoggedIn ? (
                        <div className="user-menu-wrapper" style={{ position: 'relative' }}>
                            <button
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface-1)', border: '1px solid var(--border)', color: 'var(--text)', padding: '0.45rem 0.9rem 0.45rem 0.5rem', borderRadius: '999px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, transition: 'all 0.3s' }}
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                            >
                                <div style={{ width: '28px', height: '28px', background: 'var(--color-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0, overflow: 'hidden', fontWeight: 'bold' }}>
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : user?.name ? (
                                        user.name[0]
                                    ) : (
                                        <User size={16} fill="currentColor" />
                                    )}
                                </div>
                                <span className="outfit">{user?.name ? user.name.split(' ')[0] : 'My Account'}</span>
                                <ChevronDown size={14} style={{ color: 'var(--text-muted)', transition: 'transform 0.3s', transform: userMenuOpen ? 'rotate(180deg)' : 'none' }} />
                            </button>

                            <AnimatePresence>
                                {userMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                        transition={{ duration: 0.15 }}
                                        style={{ position: 'absolute', top: 'calc(100% + 0.75rem)', right: 0, minWidth: '180px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', overflow: 'hidden', zIndex: 2000, padding: '0.5rem', background: 'var(--surface)', boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}
                                    >
                                        <Link href="/dashboard" onClick={() => setUserMenuOpen(false)}
                                            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.9rem', fontSize: '0.875rem', color: 'var(--text-muted)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', transition: 'all 0.15s', fontWeight: 500 }}>
                                            <LayoutDashboard size={16} />
                                            Dashboard
                                        </Link>
                                        <div style={{ height: '1px', background: 'var(--border)', margin: '0.4rem 0' }} />
                                        <button onClick={handleLogout}
                                            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.9rem', fontSize: '0.875rem', color: '#ef4444', borderRadius: 'var(--radius-sm)', cursor: 'pointer', transition: 'all 0.15s', fontWeight: 500, background: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}>
                                            <LogOut size={16} />
                                            Sign Out
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="nav-links-desktop" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Link href="/login" style={{ padding: '0.5rem 1.5rem', borderRadius: '999px', background: 'var(--color-primary)', color: 'white', fontSize: '0.9rem', fontWeight: 600, transition: 'all 0.3s' }}>Login</Link>
                        </div>
                    )}

                    {/* Mobile Toggle */}
                    <button
                        className="mobile-toggle-btn"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={20} /> : <Menu size={20} />}
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
                        style={{ position: 'absolute', top: '100%', left: 0, width: '100%', zIndex: 999, overflow: 'hidden', background: 'var(--background)', borderBottom: '1px solid var(--border)' }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '2rem 1.5rem' }}>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.path}
                                    onClick={() => handleNavLinkClick(link.path)}
                                    style={{
                                        fontSize: '1.1rem',
                                        padding: '1rem 1.25rem',
                                        borderRadius: 'var(--radius-md)',
                                        background: pathname === link.path ? 'rgba(99,102,241,0.1)' : 'rgba(0,0,0,0.03)',
                                        border: pathname === link.path ? '1px solid rgba(99,102,241,0.2)' : '1px solid transparent',
                                        color: pathname === link.path ? 'var(--color-primary)' : 'var(--text-muted)',
                                        fontWeight: 500,
                                        transition: 'all 0.15s',
                                        display: 'block',
                                    }}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', marginTop: '1rem' }}>
                                {isLoggedIn ? (
                                    <>
                                        <Link href="/dashboard" onClick={() => setIsOpen(false)} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <LayoutDashboard size={16} /> Dashboard
                                        </Link>
                                        <button onClick={() => { handleLogout(); setIsOpen(false); }} className="btn btn-danger" style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <LogOut size={16} /> Sign Out
                                        </button>
                                    </>
                                ) : (
                                    <Link href="/login" onClick={() => setIsOpen(false)} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', textAlign: 'center' }}>Login</Link>
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
