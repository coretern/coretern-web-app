import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, User, Mail, Phone, Trash2, Loader2, ShieldAlert, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import './ManageUsers.css';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const token = localStorage.getItem('token');
        try {
            const { data } = await axios.get('http://localhost:5000/api/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(data.data);
        } catch (err) {
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`http://localhost:5000/api/users/${id}/toggle-status`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(`Account ${currentStatus === 'active' ? 'Suspended' : 'Activated'}`);
            fetchUsers();
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    const handleDeleteUser = async (id, name) => {
        // Double Confirmation
        const firstConfirm = window.confirm(`Are you sure you want to delete ${name}? This ACTION IS PERMANENT.`);
        if (!firstConfirm) return;

        const secondConfirm = window.confirm(`RE-CONFIRM: Are you ABSOLUTELY sure? All certificates and enrollments for ${name} will be DELETED.`);
        if (!secondConfirm) return;

        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:5000/api/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('User and all associated records deleted');
            fetchUsers();
        } catch (err) {
            toast.error('Failed to delete user');
        }
    };

    const handleImpersonate = async (id, name) => {
        const token = localStorage.getItem('token');
        try {
            const { data } = await axios.post(`http://localhost:5000/api/users/${id}/impersonate`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Redirect to frontend with token in query param
            // Note: In production you'd use your actual frontend URL
            const frontendUrl = 'http://localhost:5173'; // Updated to 5173 as Admin is on 5174
            window.open(`${frontendUrl}/login?adminToken=${data.token}`, '_blank');
            toast.success(`Accessing platform as ${name}`);
        } catch (err) {
            toast.error('Impersonation failed');
        }
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm)
    );

    if (loading) return <div className="loader-container"><Loader2 className="animate-spin text-primary" size={48} /></div>;

    const frontendUrl = 'http://localhost:5173';

    return (
        <div className="manage-users-page">
            <header className="title-box flex justify-between items-center">
                <div>
                    <h1 className="outfit">Total Platform Users</h1>
                    <p className="text-text-muted">Total registered accounts on the platform</p>
                </div>
                <div className="search-container">
                    <Search className="search-icon" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name, email or phone..."
                        className="search-input"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            <div className="card admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Email Address</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Agreements</th>
                            <th>Joined On</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user._id} className={user.status === 'suspended' ? 'row-suspended' : ''}>
                                <td className="student-name">
                                    <div
                                        className="flex items-center gap-2 clickable-name"
                                        onClick={() => handleImpersonate(user._id, user.name)}
                                        title={`Login as ${user.name}`}
                                    >
                                        <User size={16} className="text-primary" />
                                        {user.name}
                                        {user.role === 'admin' && <span className="mini-badge admin">Admin</span>}
                                    </div>
                                </td>
                                <td>{user.email}</td>
                                <td>{user.phone || 'N/A'}</td>
                                <td>
                                    <span className={`status-pill ${user.status}`}>
                                        {user.status === 'active' ? 'Active' : 'Suspended'}
                                    </span>
                                </td>
                                <td>
                                    <div className="flex gap-2">
                                        <a href={`${frontendUrl}/terms`} target="_blank" rel="noreferrer" className={`mini-badge-pill ${user.agreedToTerms ? 'success' : 'danger'}`} title="Agreement to Terms of Service (Click to view)">T</a>
                                        <a href={`${frontendUrl}/privacy`} target="_blank" rel="noreferrer" className={`mini-badge-pill ${user.agreedToPrivacy ? 'success' : 'danger'}`} title="Agreement to Privacy Policy (Click to view)">P</a>
                                    </div>
                                </td>
                                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td>
                                    {user.role !== 'admin' && (
                                        <div className="flex gap-2">
                                            <button
                                                className={`btn-icon ${user.status === 'active' ? 'suspend' : 'activate'}`}
                                                title={user.status === 'active' ? 'Suspend User' : 'Activate User'}
                                                onClick={() => handleToggleStatus(user._id, user.status)}
                                            >
                                                {user.status === 'active' ? <ShieldAlert size={18} /> : <ShieldCheck size={18} />}
                                            </button>
                                            <button
                                                className="btn-icon delete"
                                                title="Permanently Delete"
                                                onClick={() => handleDeleteUser(user._id, user.name)}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredUsers.length === 0 && (
                    <div className="p-12 text-center text-text-muted">No users found matching your search.</div>
                )}
            </div>
        </div>
    );
};

export default ManageUsers;
