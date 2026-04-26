'use client';

import { useState, useEffect } from 'react';
import { Loader2, Search, Trash2, ShieldOff, Shield, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { userAPI } from '@/lib/api';

export default function AdminUsers() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        try { const data = await userAPI.getAll(); setUsers(data.data); }
        catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleToggleStatus = async (id: string) => {
        try {
            await userAPI.toggleStatus(id);
            toast.success('User status updated');
            fetchUsers();
        } catch (err: any) { toast.error(err.message); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this user? All their data will be removed.')) return;
        try {
            await userAPI.delete(id);
            toast.success('User deleted');
            fetchUsers();
        } catch (err: any) { toast.error(err.message); }
    };

    const filtered = users.filter((u: any) =>
        u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[var(--color-primary)]" size={40} /></div>;

    return (
        <div>
            <div className="flex items-center justify-between mb-8 max-md:flex-col max-md:gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold font-[family-name:var(--font-outfit)]">Users</h1>
                    <p className="text-[var(--text-muted)] text-sm">{users.length} registered users</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
                    <input type="text" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-sm text-[var(--text)] focus:outline-none focus:border-[var(--color-primary)]" />
                </div>
            </div>

            <div className="glass rounded-2xl border border-[var(--border)] overflow-hidden">
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
                        <tbody>
                            {filtered.map((u: any) => (
                                <tr key={u._id}>
                                    <td className="font-semibold">
                                        <div className="flex items-center gap-3">
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', overflow: 'hidden', flexShrink: 0 }}>
                                                {u.avatar ? <img src={u.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : u.name?.[0]}
                                            </div>
                                            {u.name}
                                        </div>
                                    </td>
                                    <td className="text-[var(--text-muted)]">{u.email}</td>
                                    <td><span className={`badge ${u.role === 'admin' ? 'badge-primary' : 'badge-success'}`}>{u.role}</span></td>
                                    <td><span className={`badge ${u.status === 'active' ? 'badge-success' : 'badge-warning'}`}>{u.status}</span></td>
                                    <td className="text-[var(--text-muted)] text-sm">{new Date(u.createdAt).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit', hour: 'numeric', minute: '2-digit', hour12: true }).toUpperCase()}</td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button onClick={async () => {
                                                try {
                                                    const res = await userAPI.impersonate(u._id);
                                                    const token = res.data?.token || res.token;
                                                    if (token) {
                                                        const adminToken = localStorage.getItem('token');
                                                        if (adminToken) localStorage.setItem('admin_token', adminToken);
                                                        localStorage.setItem('token', token);
                                                        toast.success(`Viewing dashboard as ${u.name}`);
                                                        window.location.href = '/dashboard';
                                                    }
                                                } catch (err: any) { toast.error('Failed to open user dashboard'); }
                                            }} className="btn btn-outline btn-sm" title="View Dashboard">
                                                <Eye size={14} />
                                            </button>
                                            <button onClick={() => handleToggleStatus(u._id)} className="btn btn-outline btn-sm" title={u.status === 'active' ? 'Suspend' : 'Activate'}>
                                                {u.status === 'active' ? <ShieldOff size={14} /> : <Shield size={14} />}
                                            </button>
                                            {u.role !== 'admin' && (
                                                <button onClick={() => handleDelete(u._id)} className="btn btn-danger btn-sm" title="Delete User"><Trash2 size={14} /></button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-[var(--text-muted)]">No users found</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
