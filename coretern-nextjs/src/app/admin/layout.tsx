'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { LayoutDashboard, BookOpen, Users, Award, MessageSquare, Settings, LogOut, Menu, X, ChevronRight, FileText } from 'lucide-react';
import { authAPI } from '@/lib/api';
import { useTheme } from '@/context/ThemeContext';

const sidebarLinks = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: BookOpen, label: 'Internships', path: '/admin/internships' },
    { icon: FileText, label: 'Enrollments', path: '/admin/enrollments' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: Award, label: 'Certificates', path: '/admin/certificates' },
    { icon: MessageSquare, label: 'Tickets', path: '/admin/tickets' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [admin, setAdmin] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();
    const { theme } = useTheme();

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
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 h-screen w-[260px] bg-[var(--surface)] border-r border-[var(--border)] z-50 transition-transform duration-300 flex flex-col max-lg:${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div className="p-6 border-b border-[var(--border)]">
                    <Link href="/admin" className="flex items-center gap-3">
                        <Image
                            src={theme === 'dark' ? '/coretern_Navbar_Logo_dark.png' : '/coretern_Navbar_Logo_light.png'}
                            alt="CoreTern Admin"
                            width={120} height={32}
                            className="h-8 w-auto"
                        />
                    </Link>
                    <p className="text-[var(--text-muted)] text-xs mt-2 font-medium">Admin Panel</p>
                </div>

                <nav className="flex-1 p-4 overflow-y-auto">
                    <div className="flex flex-col gap-1">
                        {sidebarLinks.map((link) => {
                            const isActive = pathname === link.path || (link.path !== '/admin' && pathname.startsWith(link.path));
                            return (
                                <Link key={link.path} href={link.path} onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? 'bg-[var(--color-primary)] text-white shadow-[var(--shadow-primary)]' : 'text-[var(--text-muted)] hover:bg-[var(--surface-1)] hover:text-[var(--text)]'}`}>
                                    <link.icon size={18} />
                                    {link.label}
                                    {isActive && <ChevronRight size={14} className="ml-auto" />}
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                <div className="p-4 border-t border-[var(--border)]">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-9 h-9 bg-[image:var(--grad-primary)] rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0">
                            {admin?.name?.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="font-semibold text-sm truncate">{admin?.name}</p>
                            <p className="text-[var(--text-muted)] text-xs truncate">{admin?.email}</p>
                        </div>
                    </div>
                    <button onClick={handleLogout}
                        className="w-full flex items-center gap-3 py-3 px-4 rounded-xl text-sm font-medium text-[#ef4444] hover:bg-[rgba(239,68,68,0.1)] transition-all duration-200 cursor-pointer bg-transparent border-none">
                        <LogOut size={18} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Main Content */}
            <div className="flex-1 lg:ml-[260px]">
                {/* Top Bar */}
                <header className="sticky top-0 z-30 bg-[var(--background)] border-b border-[var(--border)] px-6 py-4 flex items-center justify-between">
                    <button className="lg:hidden text-[var(--text)] cursor-pointer bg-transparent border-none" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                    <div className="text-sm text-[var(--text-muted)]">
                        {pathname.split('/').filter(Boolean).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' / ')}
                    </div>
                </header>

                <main className="p-6 max-lg:p-4">
                    {children}
                </main>
            </div>
        </div>
    );
}
