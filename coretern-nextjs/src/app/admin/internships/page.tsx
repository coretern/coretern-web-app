'use client';
import { useState, useEffect } from 'react';
import { Loader2, Plus, Edit, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { internshipAPI } from '@/lib/api';

export default function AdminInternships() {
    const [internships, setInternships] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        title: '', domain: '', fee: '', duration: '', description: '', details: '',
        curriculum: '', whatsappGroup: '', active: true
    });
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => { fetchInternships(); }, []);

    const fetchInternships = async () => {
        try { const data = await internshipAPI.getAll(); setInternships(data?.data || []); }
        catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const openCreate = () => {
        setEditing(null);
        setForm({ title: '', domain: '', fee: '', duration: '', description: '', details: '', curriculum: '', whatsappGroup: '', active: true });
        setImageFile(null);
        setShowModal(true);
    };

    const openEdit = (item: any) => {
        setEditing(item);
        setForm({
            title: item.title || '', domain: item.domain || '', fee: String(item.fee || ''),
            duration: item.duration || '', description: item.description || '',
            details: item.details || '', curriculum: (item.curriculum || []).join(', '),
            whatsappGroup: item.whatsappGroup || '', active: item.active !== false
        });
        setImageFile(null);
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const formData = new FormData();
            Object.entries(form).forEach(([k, v]) => formData.append(k, String(v)));
            if (imageFile) formData.append('image', imageFile);

            if (editing) {
                await internshipAPI.update(editing._id, formData);
                toast.success('Internship updated!');
            } else {
                await internshipAPI.create(formData);
                toast.success('Internship created!');
            }
            setShowModal(false);
            fetchInternships();
        } catch (err: any) { toast.error(err.message); }
        finally { setSaving(false); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this internship?')) return;
        try { await internshipAPI.delete(id); toast.success('Deleted'); fetchInternships(); }
        catch (err: any) { toast.error(err.message); }
    };

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[var(--color-primary)]" size={40} /></div>;

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-extrabold font-[family-name:var(--font-outfit)]">Internships ({internships.length})</h1>
                <button onClick={openCreate} className="btn btn-primary"><Plus size={16} /> Add New</button>
            </div>
            <div className="glass rounded-2xl border border-[var(--border)] overflow-hidden">
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead><tr><th>Title</th><th>Domain</th><th>Fee</th><th>Duration</th><th>Actions</th></tr></thead>
                        <tbody>
                            {internships.map((i: any) => (
                                <tr key={i._id}>
                                    <td className="font-semibold">{i.title}</td>
                                    <td><span className="badge badge-primary">{i.domain}</span></td>
                                    <td className="font-bold">₹{i.fee}</td>
                                    <td>{i.duration}</td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button onClick={() => openEdit(i)} className="btn btn-outline btn-sm"><Edit size={14} /></button>
                                            <button onClick={() => handleDelete(i._id)} className="btn btn-danger btn-sm"><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {internships.length === 0 && <tr><td colSpan={5} className="text-center py-8 text-[var(--text-muted)]">No internships</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
                    <div className="glass p-8 rounded-[var(--radius-xl)] border border-[var(--border)] w-full max-w-[650px] max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold font-[family-name:var(--font-outfit)]">{editing ? 'Edit' : 'Create'} Internship</h2>
                            <button onClick={() => setShowModal(false)} className="text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer bg-transparent border-none"><X size={22} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                                <div>
                                    <label className="text-sm font-medium text-[var(--text-muted)] mb-1 block">Title *</label>
                                    <input className="admin-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-[var(--text-muted)] mb-1 block">Domain *</label>
                                    <input className="admin-input" value={form.domain} onChange={e => setForm({...form, domain: e.target.value})} required placeholder="e.g. Web Development" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-[var(--text-muted)] mb-1 block">Fee (₹) *</label>
                                    <input type="number" className="admin-input" value={form.fee} onChange={e => setForm({...form, fee: e.target.value})} required />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-[var(--text-muted)] mb-1 block">Duration *</label>
                                    <input className="admin-input" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} required placeholder="e.g. 4 Weeks" />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-[var(--text-muted)] mb-1 block">Short Description</label>
                                <textarea className="admin-input !min-h-[80px] resize-y" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-[var(--text-muted)] mb-1 block">Detailed Info (HTML supported)</label>
                                <textarea className="admin-input !min-h-[100px] resize-y" value={form.details} onChange={e => setForm({...form, details: e.target.value})} />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-[var(--text-muted)] mb-1 block">Curriculum (comma-separated)</label>
                                <input className="admin-input" value={form.curriculum} onChange={e => setForm({...form, curriculum: e.target.value})} placeholder="HTML, CSS, JavaScript, React" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-[var(--text-muted)] mb-1 block">WhatsApp Group Link</label>
                                <input className="admin-input" value={form.whatsappGroup} onChange={e => setForm({...form, whatsappGroup: e.target.value})} />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-[var(--text-muted)] mb-1 block">Cover Image</label>
                                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)}
                                    className="admin-input !py-2 !px-3 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-primary)] file:text-white file:cursor-pointer" />
                            </div>
                            <div className="flex gap-3 justify-end mt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">Cancel</button>
                                <button type="submit" disabled={saving} className="btn btn-primary">
                                    {saving ? <Loader2 className="animate-spin" size={16} /> : editing ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
