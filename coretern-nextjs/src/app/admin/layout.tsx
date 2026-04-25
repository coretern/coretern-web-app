'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { LayoutDashboard, BookOpen, Users, Award, LifeBuoy, Settings, LogOut, Menu, X, ChevronRight, FileText, Rocket, Sun, Moon } from 'lucide-react';
import { authAPI } from '@/lib/api';
import { useTheme } from '@/context/ThemeContext';

const sidebarLinks = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Rocket, label: 'Total Users', path: '/admin/users' },
    { icon: BookOpen, label: 'Internships', path: '/admin/internships' },
    { icon: Users, label: 'Enrollments', path: '/admin/enrollments' },
    { icon: Award, label: 'Manual Certificate', path: '/admin/certificates' },
    { icon: LifeBuoy, label: 'Tickets', path: '/admin/tickets' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [admin, setAdmin] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();

    // Skip auth check for login page
    const isLoginPage = pathname === '/admin/login';

    useEffect(() => {
        if (isLoginPage) { setLoading(false); return; }
        const checkAdmin = async () => {
            const token = localStorage.getItem('token');
            if (!token) { router.push('/admin/login'); return; }
            try {
                const data = await authAPI.me();
                if (data.data.role !== 'admin') { router.push('/'); return; }
                setAdmin(data.data);
            } catch {
                localStorage.removeItem('token');
                router.push('/admin/login');
            } finally {
                setLoading(false);
            }
        };
        checkAdmin();
    }, [router, isLoginPage]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/admin/login');
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
            <div className="animate-spin w-10 h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full" />
        </div>;
    }

    if (isLoginPage) return <>{children}</>;

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar - exact replica of standalone admin */}
            <aside
                className={`fixed lg:sticky top-0 left-0 z-50 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
                style={{
                    width: '280px',
                    height: '100vh',
                    background: 'var(--surface)',
                    borderRight: '1px solid var(--border)',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '2.5rem 1.5rem',
                }}
            >
                {/* Logo - exact match: padding 0 0.5rem, margin-bottom 3.5rem */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '3.5rem', padding: '0 0.5rem' }}>
                    <Link href="/admin">
                        <Image
                            src={theme === 'dark' ? '/coretern_Navbar_Logo_dark.png' : '/coretern_Navbar_Logo_light.png'}
                            alt="CoreTern"
                            width={160} height={40}
                            style={{ height: '40px', width: 'auto' }}
                            priority
                        />
                    </Link>
                </div>

                {/* Nav Links - exact match: gap 0.65rem, padding 0.85rem 1.25rem, radius 0.75rem */}
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', flex: 1 }}>
                    {sidebarLinks.map((link) => {
                        const isActive = pathname === link.path || (link.path !== '/admin' && pathname.startsWith(link.path));
                        return (
                            <Link
                                key={link.path}
                                href={link.path}
                                onClick={() => setSidebarOpen(false)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '0.85rem 1.25rem',
                                    borderRadius: '0.75rem',
                                    color: isActive ? 'white' : 'var(--text-muted)',
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                    textDecoration: 'none',
                                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                                    background: isActive ? 'var(--grad-primary)' : 'transparent',
                                    boxShadow: isActive ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none',
                                }}
                            >
                                <link.icon size={20} />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer actions - exact match */}
                <div style={{ padding: '0 0rem', marginBottom: '0.5rem' }}>
                    <button
                        onClick={toggleTheme}
                        style={{
                            width: '100%',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            gap: '0.75rem',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '0.75rem',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            border: '1px solid var(--border)',
                            background: 'transparent',
                            color: 'var(--text)',
                            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                            fontFamily: 'inherit',
                        }}
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>
                </div>

                <button
                    onClick={handleLogout}
                    style={{
                        width: '100%',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.75rem',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444',
                        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                        fontFamily: 'inherit',
                    }}
                >
                    <LogOut size={20} /> <span>Logout</span>
                </button>
            </aside>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Main Content - exact match: flex 1, padding 2.5rem, background grad-dark */}
            <main
                style={{
                    flex: 1,
                    padding: '2.5rem',
                    overflowY: 'auto',
                    background: 'var(--grad-dark)',
                }}
            >
                {/* Mobile Menu Button */}
                <div className="lg:hidden mb-4">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        style={{
                            padding: '0.5rem',
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            borderRadius: '0.5rem',
                            color: 'var(--text)',
                            cursor: 'pointer',
                        }}
                    >
                        <Menu size={24} />
                    </button>
                </div>
                {children}
            </main>
        </div>
    );
}
