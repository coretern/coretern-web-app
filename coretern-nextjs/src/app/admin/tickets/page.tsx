'use client';
import { useState, useEffect } from 'react';
import { Loader2, Search, Trash2, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { ticketAPI } from '@/lib/api';

export default function AdminTickets() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => { fetchTickets(); }, []);
    const fetchTickets = async () => {
        try { const data = await ticketAPI.getAll(); setTickets(data.data); }
        catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this ticket?')) return;
        try { await ticketAPI.delete(id); toast.success('Deleted'); fetchTickets(); }
        catch (err: any) { toast.error(err.message); }
    };

    const handleStatus = async (id: string, status: string) => {
        try { await ticketAPI.updateStatus(id, { status }); toast.success('Updated'); fetchTickets(); }
        catch (err: any) { toast.error(err.message); }
    };

    const filtered = tickets.filter((t: any) =>
        t.name?.toLowerCase().includes(search.toLowerCase()) || t.subject?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[var(--color-primary)]" size={40} /></div>;

    return (
        <div>
            <div className="flex items-center justify-between mb-8 max-md:flex-col max-md:gap-4">
                <h1 className="text-2xl font-extrabold font-[family-name:var(--font-outfit)]">Tickets ({tickets.length})</h1>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
                    <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-sm text-[var(--text)] focus:outline-none focus:border-[var(--color-primary)]" />
                </div>
            </div>
            <div className="glass rounded-2xl border border-[var(--border)] overflow-hidden">
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead><tr><th>ID</th><th>From</th><th>Subject</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
                        <tbody>
                            {filtered.map((t: any) => (
                                <tr key={t._id}>
                                    <td className="font-mono text-sm">{t.ticketId}</td>
                                    <td>{t.name}<br/><span className="text-[var(--text-muted)] text-xs">{t.email}</span></td>
                                    <td>{t.subject}</td>
                                    <td>
                                        <select value={t.status} onChange={(e) => handleStatus(t._id, e.target.value)}
                                            className="bg-[var(--surface-1)] border border-[var(--border)] rounded-lg px-2 py-1 text-xs cursor-pointer text-[var(--text)]">
                                            {['open','pending','resolved','closed'].map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </td>
                                    <td className="text-[var(--text-muted)] text-sm">{new Date(t.createdAt).toLocaleDateString()}</td>
                                    <td><button onClick={() => handleDelete(t._id)} className="btn btn-danger btn-sm"><Trash2 size={14} /></button></td>
                                </tr>
                            ))}
                            {filtered.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-[var(--text-muted)]">No tickets</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
