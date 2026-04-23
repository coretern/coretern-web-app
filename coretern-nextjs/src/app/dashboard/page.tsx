'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { BookOpen, Award, MessageSquare, User, Loader2, ExternalLink, Clock, ArrowRight, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI, enrollmentAPI, certificateAPI, ticketAPI } from '@/lib/api';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);
    const [enrollments, setEnrollments] = useState<any[]>([]);
    const [certificates, setCertificates] = useState<any[]>([]);
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('enrollments');
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) { router.push('/login'); return; }

            try {
                const userData = await authAPI.me();
                setUser(userData.data);

                const [enrolRes, certRes, ticketRes] = await Promise.allSettled([
                    enrollmentAPI.getMy(), certificateAPI.getMy(), ticketAPI.getMy()
                ]);
                setEnrollments(enrolRes.status === 'fulfilled' ? (enrolRes.value?.data || []) : []);
                setCertificates(certRes.status === 'fulfilled' ? (certRes.value?.data || []) : []);
                setTickets(ticketRes.status === 'fulfilled' ? (ticketRes.value?.data || []) : []);

                // Handle payment verification from redirect
                const orderId = searchParams.get('order_id');
                if (orderId) {
                    try {
                        await enrollmentAPI.verify(orderId);
                        toast.success('Payment verified successfully!');
                        const refreshed = await enrollmentAPI.getMy();
                        setEnrollments(refreshed?.data || []);
                    } catch (err: any) {
                        toast.error(err.message || 'Payment verification failed');
                    }
                    window.history.replaceState({}, '', '/dashboard');
                }
            } catch (err) {
                localStorage.removeItem('token');
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [router, searchParams]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-[var(--color-primary)]" size={40} />
            </div>
        );
    }

    const tabs = [
        { id: 'enrollments', label: 'My Internships', icon: BookOpen, count: enrollments.length },
        { id: 'certificates', label: 'Certificates', icon: Award, count: certificates.length },
        { id: 'tickets', label: 'Support', icon: MessageSquare, count: tickets.length },
        { id: 'profile', label: 'Profile', icon: User },
    ];

    const paidEnrollments = enrollments.filter((e: any) => e.paymentStatus === 'paid');

    return (
        <div>
            <Navbar />
            <section className="min-h-screen pt-24 pb-20 bg-[var(--background)]">
                <div className="container">
                    {/* Welcome Header */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                        <h1 className="text-3xl font-extrabold mb-2 font-[family-name:var(--font-outfit)]">
                            Welcome back, <span className="gradient-text">{user?.name}</span>
                        </h1>
                        <p className="text-[var(--text-muted)]">Manage your internships, certificates, and support tickets</p>
                    </motion.div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-4 gap-4 mb-10 max-md:grid-cols-2 max-sm:grid-cols-1">
                        {[
                            { label: 'Enrolled', value: paidEnrollments.length, color: 'var(--color-primary)' },
                            { label: 'Completed', value: paidEnrollments.filter((e: any) => e.status === 'completed').length, color: 'var(--color-success)' },
                            { label: 'Certificates', value: certificates.length, color: 'var(--color-secondary)' },
                            { label: 'Tickets', value: tickets.filter((t: any) => t.status === 'open').length, color: 'var(--color-warning)' },
                        ].map((stat, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                className="glass p-5 rounded-2xl border border-[var(--border)]">
                                <p className="text-[var(--text-muted)] text-sm mb-1">{stat.label}</p>
                                <p className="text-3xl font-extrabold font-[family-name:var(--font-outfit)]" style={{ color: stat.color }}>{stat.value}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                        {tabs.map((tab) => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold border transition-all duration-200 whitespace-nowrap cursor-pointer ${activeTab === tab.id ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]' : 'bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--color-primary)]'}`}>
                                <tab.icon size={16} />
                                {tab.label}
                                {tab.count !== undefined && <span className="bg-[rgba(255,255,255,0.2)] px-2 py-0.5 rounded-full text-xs">{tab.count}</span>}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'enrollments' && (
                        <div className="grid gap-4">
                            {paidEnrollments.length === 0 ? (
                                <div className="glass p-12 rounded-2xl border border-[var(--border)] text-center">
                                    <BookOpen className="mx-auto mb-4 text-[var(--text-muted)]" size={40} />
                                    <h3 className="text-lg font-bold mb-2">No Enrollments Yet</h3>
                                    <p className="text-[var(--text-muted)] mb-6">Start your journey by enrolling in an internship</p>
                                    <button onClick={() => router.push('/internships')} className="btn btn-primary">
                                        Browse Internships <ArrowRight size={16} />
                                    </button>
                                </div>
                            ) : (
                                paidEnrollments.map((enrol: any) => (
                                    <div key={enrol._id} className="glass p-6 rounded-2xl border border-[var(--border)] flex items-center justify-between gap-4 max-md:flex-col max-md:items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-bold text-lg">{enrol.internship?.title}</h3>
                                                <span className={`badge ${enrol.status === 'completed' ? 'badge-success' : enrol.status === 'enrolled' ? 'badge-primary' : 'badge-warning'}`}>
                                                    {enrol.status}
                                                </span>
                                            </div>
                                            <div className="flex gap-6 text-sm text-[var(--text-muted)]">
                                                <span className="flex items-center gap-1"><Clock size={14} /> {enrol.internship?.duration}</span>
                                                <span>Enrolled: {new Date(enrol.enrolledAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        {enrol.internship?.whatsappGroup && (
                                            <a href={enrol.internship.whatsappGroup} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
                                                <ExternalLink size={14} /> WhatsApp Group
                                            </a>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'certificates' && (
                        <div className="grid gap-4">
                            {certificates.length === 0 ? (
                                <div className="glass p-12 rounded-2xl border border-[var(--border)] text-center">
                                    <Award className="mx-auto mb-4 text-[var(--text-muted)]" size={40} />
                                    <h3 className="text-lg font-bold mb-2">No Certificates Yet</h3>
                                    <p className="text-[var(--text-muted)]">Complete an internship to receive your certificate</p>
                                </div>
                            ) : (
                                certificates.map((cert: any) => (
                                    <div key={cert._id} className="glass p-6 rounded-2xl border border-[var(--border)] flex items-center justify-between gap-4 max-md:flex-col max-md:items-start">
                                        <div>
                                            <h3 className="font-bold text-lg mb-1">{cert.internship?.title}</h3>
                                            <p className="text-[var(--text-muted)] text-sm">Certificate ID: {cert.certificateId}</p>
                                            <p className="text-[var(--text-muted)] text-sm">Issued: {new Date(cert.issueDate).toLocaleDateString()}</p>
                                        </div>
                                        <button onClick={() => router.push(`/verify?id=${cert.certificateId}`)} className="btn btn-primary btn-sm">
                                            View Certificate
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'tickets' && (
                        <div className="grid gap-4">
                            {tickets.length === 0 ? (
                                <div className="glass p-12 rounded-2xl border border-[var(--border)] text-center">
                                    <MessageSquare className="mx-auto mb-4 text-[var(--text-muted)]" size={40} />
                                    <h3 className="text-lg font-bold mb-2">No Support Tickets</h3>
                                    <p className="text-[var(--text-muted)] mb-6">Need help? Create a support ticket</p>
                                    <button onClick={() => router.push('/contact')} className="btn btn-primary">
                                        Contact Support <ArrowRight size={16} />
                                    </button>
                                </div>
                            ) : (
                                tickets.map((ticket: any) => (
                                    <div key={ticket._id} className="glass p-6 rounded-2xl border border-[var(--border)]">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="font-bold">{ticket.subject}</h3>
                                            <span className={`badge ${ticket.status === 'open' ? 'badge-warning' : ticket.status === 'resolved' ? 'badge-success' : 'badge-primary'}`}>
                                                {ticket.status}
                                            </span>
                                        </div>
                                        <p className="text-[var(--text-muted)] text-sm">#{ticket.ticketId} • {new Date(ticket.createdAt).toLocaleDateString()}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'profile' && user && (
                        <div className="glass p-8 rounded-[var(--radius-xl)] border border-[var(--border)] max-w-[600px]">
                            <h2 className="text-xl font-bold mb-6 font-[family-name:var(--font-outfit)]">Profile Settings</h2>
                            <div className="grid gap-5">
                                {[
                                    { label: 'Name', value: user.name },
                                    { label: 'Email', value: user.email },
                                    { label: 'Phone', value: user.phone || 'Not set' },
                                    { label: 'Gender', value: user.gender || 'Not set' },
                                    { label: 'Member Since', value: new Date(user.createdAt).toLocaleDateString() },
                                ].map((item, i) => (
                                    <div key={i} className="flex justify-between items-center py-3 border-b border-[var(--border)] last:border-none">
                                        <span className="text-[var(--text-muted)] text-sm font-medium">{item.label}</span>
                                        <span className="font-semibold">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
            <Footer />
        </div>
    );
}
