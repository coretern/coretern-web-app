import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, BookOpen, Award, TrendingUp, Loader2 } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
    const [stats, setStats] = useState({
        internships: 0,
        enrollments: 0,
        students: 0,
        completed: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            try {
                const [intRes, enrRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/internships', config),
                    axios.get('http://localhost:5000/api/enrollments', config)
                ]);

                setStats({
                    internships: intRes.data.count || 0,
                    enrollments: enrRes.data.count || 0,
                    students: new Set(enrRes.data.data?.filter(e => e.user).map(e => e.user._id || e.user)).size || 0,
                    completed: enrRes.data.data?.filter(e => e.status === 'completed').length || 0
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { label: 'Total Internships', value: stats.internships, icon: <BookOpen />, color: 'var(--primary)' },
        { label: 'Total Enrollments', value: stats.enrollments, icon: <TrendingUp />, color: 'var(--secondary)' },
        { label: 'Total Students', value: stats.students, icon: <Users />, color: '#6366f1' },
        { label: 'Certificates Issued', value: stats.completed, icon: <Award />, color: 'var(--success)' }
    ];

    if (loading) return <div className="loader-container"><Loader2 className="animate-spin text-primary" size={48} /></div>;

    return (
        <div className="admin-dashboard-page">
            <header className="title-box">
                <h1 className="outfit">Dashboard Overview</h1>
                <p className="text-text-muted">Real-time platform statistics</p>
            </header>

            <div className="admin-stats-grid">
                {statCards.map((card, i) => (
                    <div key={i} className="card admin-stat-card">
                        <div className="admin-stat-icon-wrapper" style={{ background: `${card.color}20`, color: card.color }}>
                            {card.icon}
                        </div>
                        <div className="admin-stat-label">{card.label}</div>
                        <div className="admin-stat-value">{card.value}</div>
                    </div>
                ))}
            </div>

            <div className="card analytics-placeholder">
                <p>Advanced Analytics & Data Insights coming soon.</p>
            </div>
        </div>
    );
};

export default Dashboard;
