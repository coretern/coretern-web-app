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
        { name: 'Services', path: '/services' },
        { name: 'Internships', path: '/internships' },
        { name: 'Verify', path: '/verify' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <nav className={`fixed top-0 left-0 w-full z-[1000] py-[1.2rem] transition-all duration-[0.4s] ease-[cubic-bezier(0.16,1,0.3,1)] isolate ${scrolled ? 'py-[0.8rem] !bg-[var(--background)] backdrop-blur-none border-b border-[var(--border)] shadow-[0_4px_20px_rgba(0,0,0,0.2)]' : ''}`}>
            <div className="container flex justify-between items-center gap-8">
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
                <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.path}
                            className={`px-[0.9rem] py-2 rounded-[var(--radius-sm)] text-[0.9rem] font-medium text-[var(--text-muted)] transition-colors duration-150 hover:text-[var(--text)] hover:bg-[var(--surface-light)] ${pathname === link.path ? '!text-[var(--color-primary-light)] bg-[rgba(99,102,241,0.1)]' : ''}`}
                            onClick={() => handleNavLinkClick(link.path)}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    {/* Theme Toggle */}
                    <button
                        className="w-9 h-9 bg-[var(--surface-1)] border border-[var(--border)] text-[var(--text-muted)] cursor-pointer flex items-center justify-center rounded-[var(--radius-sm)] transition-all duration-150 shrink-0 hover:text-[var(--text)] hover:border-[var(--color-primary)] hover:bg-[rgba(99,102,241,0.1)]"
                        onClick={toggleTheme}
                        aria-label="Toggle Theme"
                    >
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    {/* Auth / User Menu (Desktop) */}
                    {isLoggedIn ? (
                        <div className="user-menu-wrapper relative hidden md:block">
                            <button
                                className="flex items-center gap-2 bg-[var(--surface-1)] border border-[var(--border)] text-[var(--text)] py-[0.45rem] pr-[0.9rem] pl-2 rounded-full cursor-pointer text-[0.875rem] font-medium font-[family-name:var(--font-inter)] transition-all duration-150 hover:border-[var(--color-primary)] hover:bg-[var(--surface-light)]"
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                            >
                                <div className="w-7 h-7 bg-[image:var(--grad-primary)] rounded-full flex items-center justify-center text-white shrink-0">
                                    <User size={16} />
                                </div>
                                <span>My Account</span>
                                <ChevronDown size={14} className={`text-[var(--text-muted)] transition-transform duration-150 ${userMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {userMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                        transition={{ duration: 0.15 }}
                                        className="glass absolute top-[calc(100%+0.75rem)] right-0 min-w-[180px] rounded-[var(--radius-md)] border border-[var(--border)] overflow-hidden z-[2000] p-2 shadow-[var(--shadow-lg)]"
                                    >
                                        <Link href="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 py-[0.65rem] px-[0.9rem] text-[0.875rem] text-[var(--text-muted)] rounded-[var(--radius-sm)] cursor-pointer transition-all duration-150 font-medium w-full hover:bg-[var(--surface-light)] hover:text-[var(--text)]">
                                            <LayoutDashboard size={16} />
                                            Dashboard
                                        </Link>
                                        <div className="h-px bg-[var(--border)] my-[0.4rem]" />
                                        <button onClick={handleLogout} className="flex items-center gap-3 py-[0.65rem] px-[0.9rem] text-[0.875rem] text-[#ef4444] rounded-[var(--radius-sm)] cursor-pointer transition-all duration-150 font-medium bg-transparent border-none w-full text-left hover:bg-[rgba(239,68,68,0.1)]">
                                            <LogOut size={16} />
                                            Sign Out
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center gap-2">
                            <Link href="/login" className="btn btn-primary btn-sm">Login</Link>
                        </div>
                    )}

                    {/* Mobile Toggle */}
                    <button
                        className="flex md:hidden bg-[var(--surface-1)] border border-[var(--border)] text-[var(--text)] cursor-pointer p-2 rounded-[var(--radius-sm)] transition-all duration-150 shrink-0 items-center justify-center hover:border-[var(--color-primary)] hover:bg-[var(--surface-light)]"
                        onClick={() => setIsOpen(!isOpen)}
                    >
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
                        className="absolute top-full left-0 w-full z-[999] overflow-hidden bg-[var(--background)] border-b border-[var(--border)] backdrop-blur-[20px]"
                    >
                        <div className="flex flex-col gap-2 py-8 px-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.path}
                                    onClick={() => handleNavLinkClick(link.path)}
                                    className={`text-[1.1rem] py-4 px-5 rounded-[var(--radius-md)] bg-[rgba(255,255,255,0.03)] border border-transparent text-[var(--text-muted)] font-medium transition-colors duration-150 hover:text-[var(--text)] ${pathname === link.path ? '!bg-[rgba(99,102,241,0.1)] !border-[rgba(99,102,241,0.2)] !text-[var(--color-primary-light)]' : ''}`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="flex flex-col gap-4 pt-6 border-t border-[var(--border)] mt-4">
                                {isLoggedIn ? (
                                    <>
                                        <Link href="/dashboard" onClick={() => setIsOpen(false)} className="btn btn-outline w-full justify-center">
                                            <LayoutDashboard size={16} /> Dashboard
                                        </Link>
                                        <button onClick={() => { handleLogout(); setIsOpen(false); }} className="btn btn-danger w-full justify-center">
                                            <LogOut size={16} /> Sign Out
                                        </button>
                                    </>
                                ) : (
                                    <Link href="/login" onClick={() => setIsOpen(false)} className="btn btn-primary w-full justify-center">Login</Link>
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
