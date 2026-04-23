'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, Award, MessageSquare, TrendingUp, Loader2 } from 'lucide-react';
import { userAPI, enrollmentAPI, internshipAPI, ticketAPI } from '@/lib/api';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ users: 0, enrollments: 0, internships: 0, tickets: 0 });
    const [loading, setLoading] = useState(true);
    const [recentEnrollments, setRecentEnrollments] = useState<any[]>([]);

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
                    users: u.count || 0, enrollments: e.count || 0,
                    internships: i.count || 0, tickets: t.count || 0
                });
                setRecentEnrollments((e.data || []).slice(0, 5));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[var(--color-primary)]" size={40} /></div>;
    }

    const statCards = [
        { icon: Users, label: 'Total Users', value: stats.users, color: 'var(--color-primary)', bg: 'rgba(99,102,241,0.1)' },
        { icon: BookOpen, label: 'Enrollments', value: stats.enrollments, color: 'var(--color-secondary)', bg: 'rgba(6,182,212,0.1)' },
        { icon: Award, label: 'Internships', value: stats.internships, color: 'var(--color-success)', bg: 'rgba(16,185,129,0.1)' },
        { icon: MessageSquare, label: 'Tickets', value: stats.tickets, color: 'var(--color-warning)', bg: 'rgba(245,158,11,0.1)' },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold font-[family-name:var(--font-outfit)]">Dashboard</h1>
                <p className="text-[var(--text-muted)] mt-1">Overview of your platform</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-5 mb-10 max-lg:grid-cols-2 max-sm:grid-cols-1">
                {statCards.map((card, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        className="glass p-6 rounded-2xl border border-[var(--border)]">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: card.bg }}>
                                <card.icon size={22} style={{ color: card.color }} />
                            </div>
                            <TrendingUp size={16} className="text-[var(--color-success)]" />
                        </div>
                        <p className="text-3xl font-extrabold font-[family-name:var(--font-outfit)]" style={{ color: card.color }}>{card.value}</p>
                        <p className="text-[var(--text-muted)] text-sm mt-1">{card.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Recent Enrollments */}
            <div className="glass rounded-2xl border border-[var(--border)] overflow-hidden">
                <div className="p-6 border-b border-[var(--border)]">
                    <h2 className="text-lg font-bold font-[family-name:var(--font-outfit)]">Recent Enrollments</h2>
                </div>
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Internship</th>
                                <th>Payment</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentEnrollments.map((e: any) => (
                                <tr key={e._id}>
                                    <td>{e.fullName}</td>
                                    <td>{e.internship?.title || 'N/A'}</td>
                                    <td>
                                        <span className={`badge ${e.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                                            {e.paymentStatus}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge ${e.status === 'completed' ? 'badge-success' : e.status === 'enrolled' ? 'badge-primary' : 'badge-warning'}`}>
                                            {e.status}
                                        </span>
                                    </td>
                                    <td className="text-[var(--text-muted)]">{new Date(e.enrolledAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                            {recentEnrollments.length === 0 && (
                                <tr><td colSpan={5} className="text-center py-8 text-[var(--text-muted)]">No enrollments yet</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
