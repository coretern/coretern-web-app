'use client';

import { useState, useEffect } from 'react';
import { Loader2, Search, Award, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { enrollmentAPI, certificateAPI } from '@/lib/api';

export default function AdminEnrollments() {
    const [enrollments, setEnrollments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchEnrollments();
    }, []);

    const fetchEnrollments = async () => {
        try {
            const data = await enrollmentAPI.getAll();
            setEnrollments(data?.data || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleIssueCert = async (enrollmentId: string) => {
        try {
            await certificateAPI.issue({ enrollmentId });
            toast.success('Certificate issued!');
            fetchEnrollments();
        } catch (err: any) { toast.error(err.message); }
    };

    const filtered = enrollments.filter((e: any) => {
        const matchSearch = e.fullName?.toLowerCase().includes(search.toLowerCase()) || e.email?.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === 'all' || e.status === filter || e.paymentStatus === filter;
        return matchSearch && matchFilter;
    });

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[var(--color-primary)]" size={40} /></div>;

    return (
        <div>
            <div className="flex items-center justify-between mb-8 max-md:flex-col max-md:gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold font-[family-name:var(--font-outfit)]">Enrollments</h1>
                    <p className="text-[var(--text-muted)] text-sm">{enrollments.length} total enrollments</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
                        <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-sm text-[var(--text)] focus:outline-none focus:border-[var(--color-primary)]" />
                    </div>
                    <select value={filter} onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-sm text-[var(--text)] cursor-pointer">
                        <option value="all">All</option>
                        <option value="paid">Paid</option>
                        <option value="unpaid">Unpaid</option>
                        <option value="enrolled">Enrolled</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
            </div>

            <div className="glass rounded-2xl border border-[var(--border)] overflow-hidden">
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Internship</th>
                                <th>Payment</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((e: any) => (
                                <tr key={e._id}>
                                    <td>
                                        <div>
                                            <p className="font-semibold">{e.fullName}</p>
                                            <p className="text-[var(--text-muted)] text-xs">{e.email}</p>
                                        </div>
                                    </td>
                                    <td>{e.internship?.title || 'N/A'}</td>
                                    <td><span className={`badge ${e.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'}`}>{e.paymentStatus}</span></td>
                                    <td><span className={`badge ${e.status === 'completed' ? 'badge-success' : e.status === 'enrolled' ? 'badge-primary' : 'badge-warning'}`}>{e.status}</span></td>
                                    <td className="text-[var(--text-muted)] text-sm">{new Date(e.enrolledAt).toLocaleDateString()}</td>
                                    <td>
                                        {e.paymentStatus === 'paid' && e.status !== 'completed' && (
                                            <button onClick={() => handleIssueCert(e._id)} className="btn btn-primary btn-sm" title="Issue Certificate">
                                                <Award size={14} /> Issue Cert
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-[var(--text-muted)]">No enrollments found</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
