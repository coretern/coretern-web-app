'use client';

import { useState, useEffect } from 'react';
import { Users, BookOpen, Award, TrendingUp, Loader2, LifeBuoy } from 'lucide-react';
import { userAPI, enrollmentAPI, internshipAPI, ticketAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ users: 0, enrollments: 0, internships: 0, tickets: 0, completed: 0 });
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [users, enrollments, internships, tickets] = await Promise.allSettled([
                    userAPI.getAll(), enrollmentAPI.getAll(), internshipAPI.getAll(), ticketAPI.getAll()
                ]);
                const u = users.status === 'fulfilled' ? users.value : { count: 0, data: [] };
                const e = enrollments.status === 'fulfilled' ? enrollments.value : { count: 0, data: [] };
                const i = internships.status === 'fulfilled' ? internships.value : { count: 0, data: [] };
                const t = tickets.status === 'fulfilled' ? tickets.value : { count: 0, data: [] };
                
                setStats({
                    users: u.count || 0,
                    enrollments: e.count || 0,
                    internships: i.count || 0,
                    tickets: (t.data || []).filter((ticket: any) => ticket.status === 'open').length || 0,
                    completed: (e.data || []).filter((enrol: any) => enrol.status === 'completed').length || 0
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return <div className="loader-container"><Loader2 className="animate-spin" size={48} style={{ color: 'var(--color-primary)' }} /></div>;
    }

    const statCards = [
        { label: 'Total Registered Users', value: stats.users, icon: <Users size={24} />, color: '#6366f1', link: '/admin/users' },
        { label: 'Total Internships', value: stats.internships, icon: <BookOpen size={24} />, color: 'var(--color-primary)', link: '/admin/internships' },
        { label: 'Total Enrollments', value: stats.enrollments, icon: <TrendingUp size={24} />, color: 'var(--color-secondary)', link: '/admin/enrollments' },
        { label: 'Open Tickets', value: stats.tickets, icon: <LifeBuoy size={24} />, color: '#f59e0b', link: '/admin/tickets' },
        { label: 'Certificates Issued', value: stats.completed, icon: <Award size={24} />, color: 'var(--color-success)', link: '/admin/enrollments' },
    ];

    return (
        <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
            {/* Title box - exact match of standalone admin */}
            <header className="title-box" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h1 className="outfit" style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>
                    Dashboard Overview
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Real-time platform statistics</p>
            </header>

            {/* Stats Grid - exact match: repeat(auto-fit, minmax(260px, 1fr)), gap 2rem */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '2rem',
                marginBottom: '3rem',
            }}>
                {statCards.map((card, i) => (
                    <div
                        key={i}
                        className="card"
                        onClick={() => router.push(card.link)}
                        style={{
                            padding: '2rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem',
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-lg)',
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                    >
                        {/* Icon wrapper - exact match: 56px, radius-md */}
                        <div style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '1.25rem',
                            background: `${card.color}20`,
                            color: card.color,
                        }}>
                            {card.icon}
                        </div>

                        {/* Label - exact match: 0.9rem, 700, uppercase, 0.08em */}
                        <div style={{
                            fontSize: '0.9rem',
                            color: 'var(--text-muted)',
                            fontWeight: 700,
                            textTransform: 'uppercase' as const,
                            letterSpacing: '0.08em',
                        }}>
                            {card.label}
                        </div>

                        {/* Value - exact match: 2.75rem, 900, Outfit */}
                        <div style={{
                            fontSize: '2.75rem',
                            fontWeight: 900,
                            fontFamily: "'Outfit', sans-serif",
                            color: 'var(--text)',
                            lineHeight: 1,
                        }}>
                            {card.value}
                        </div>
                    </div>
                ))}
            </div>

            {/* Analytics Placeholder - exact match */}
            <div className="card" style={{
                height: '350px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                border: '2px dashed var(--border)',
                background: 'rgba(255, 255, 255, 0.01)',
                gap: '1.5rem',
                borderRadius: 'var(--radius-xl)',
            }}>
                <p>Advanced Analytics &amp; Data Insights coming soon.</p>
            </div>
        </div>
    );
}
