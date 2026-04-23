'use client';
import { useState, useEffect } from 'react';
import { Loader2, Search, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { certificateAPI } from '@/lib/api';

export default function AdminCertificates() {
    const [certificates, setCertificates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ certificateId: '', recipientName: '', certType: 'Internship', description: '' });

    useEffect(() => { fetchCerts(); }, []);

    const fetchCerts = async () => {
        try { const data = await certificateAPI.getManual(); setCertificates(data?.data || []); }
        catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await certificateAPI.issueManual(form);
            toast.success('Manual certificate issued!');
            setShowModal(false);
            setForm({ certificateId: '', recipientName: '', certType: 'Internship', description: '' });
            fetchCerts();
        } catch (err: any) { toast.error(err.message); }
        finally { setSaving(false); }
    };

    const filtered = certificates.filter((c: any) =>
        c.certificateId?.toLowerCase().includes(search.toLowerCase()) ||
        c.recipientName?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[var(--color-primary)]" size={40} /></div>;

    return (
        <div>
            <div className="flex items-center justify-between mb-8 max-md:flex-col max-md:gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold font-[family-name:var(--font-outfit)]">Certificates</h1>
                    <p className="text-[var(--text-muted)] text-sm">{certificates.length} manual certificates</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
                        <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-sm text-[var(--text)] focus:outline-none focus:border-[var(--color-primary)]" />
                    </div>
                    <button onClick={() => setShowModal(true)} className="btn btn-primary btn-sm"><Plus size={14} /> Issue Manual</button>
                </div>
            </div>

            <div className="glass rounded-2xl border border-[var(--border)] overflow-hidden">
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead><tr><th>Certificate ID</th><th>Recipient</th><th>Type</th><th>Description</th><th>Issue Date</th></tr></thead>
                        <tbody>
                            {filtered.map((c: any) => (
                                <tr key={c._id}>
                                    <td className="font-mono font-semibold">{c.certificateId}</td>
                                    <td>{c.recipientName}</td>
                                    <td><span className="badge badge-primary">{c.certType}</span></td>
                                    <td className="text-[var(--text-muted)] text-sm max-w-[200px] truncate">{c.description}</td>
                                    <td className="text-[var(--text-muted)] text-sm">{new Date(c.issueDate).toLocaleDateString()}</td>
                                </tr>
                            ))}
                            {filtered.length === 0 && <tr><td colSpan={5} className="text-center py-8 text-[var(--text-muted)]">No certificates found</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Manual Certificate Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
                    <div className="glass p-8 rounded-[var(--radius-xl)] border border-[var(--border)] w-full max-w-[500px]" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold font-[family-name:var(--font-outfit)]">Issue Manual Certificate</h2>
                            <button onClick={() => setShowModal(false)} className="text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer bg-transparent border-none"><X size={22} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <label className="text-sm font-medium text-[var(--text-muted)] mb-1 block">Certificate ID *</label>
                                <input className="admin-input" value={form.certificateId} onChange={e => setForm({...form, certificateId: e.target.value})} required placeholder="e.g. CERT-2026-001" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-[var(--text-muted)] mb-1 block">Recipient Name *</label>
                                <input className="admin-input" value={form.recipientName} onChange={e => setForm({...form, recipientName: e.target.value})} required />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-[var(--text-muted)] mb-1 block">Type</label>
                                <select className="admin-select" value={form.certType} onChange={e => setForm({...form, certType: e.target.value})}>
                                    <option value="Internship">Internship</option>
                                    <option value="Workshop">Workshop</option>
                                    <option value="Hackathon">Hackathon</option>
                                    <option value="Achievement">Achievement</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-[var(--text-muted)] mb-1 block">Description</label>
                                <textarea className="admin-input !min-h-[80px] resize-y" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Certificate description..." />
                            </div>
                            <div className="flex gap-3 justify-end mt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">Cancel</button>
                                <button type="submit" disabled={saving} className="btn btn-primary">
                                    {saving ? <Loader2 className="animate-spin" size={16} /> : 'Issue Certificate'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
