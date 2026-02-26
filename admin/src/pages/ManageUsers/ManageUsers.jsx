import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, User, Mail, Phone, Trash2, Loader2 } from 'lucide-react';
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

    const handleDeleteUser = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete ${name}? This will also affect their enrollments.`)) return;

        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:5000/api/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('User Deleted Successfully');
            fetchUsers();
        } catch (err) {
            toast.error('Failed to delete user');
        }
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm)
    );

    if (loading) return <div className="loader-container"><Loader2 className="animate-spin text-primary" size={48} /></div>;

    return (
        <div className="manage-users-page">
            <header className="title-box flex justify-between items-center">
                <div>
                    <h1 className="outfit">Registered Students</h1>
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
                            <th>Joined On</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user._id}>
                                <td className="student-name">
                                    <div className="flex items-center gap-2">
                                        <User size={16} className="text-primary" />
                                        {user.name}
                                    </div>
                                </td>
                                <td>
                                    <div className="flex items-center gap-2">
                                        <Mail size={14} className="text-text-muted" />
                                        {user.email}
                                    </div>
                                </td>
                                <td>
                                    <div className="flex items-center gap-2">
                                        <Phone size={14} className="text-text-muted" />
                                        {user.phone || 'N/A'}
                                    </div>
                                </td>
                                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <span className={`role-badge ${user.role}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td>
                                    {user.role !== 'admin' && (
                                        <button
                                            className="btn-icon delete"
                                            title="Delete Account"
                                            onClick={() => handleDeleteUser(user._id, user.name)}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredUsers.length === 0 && (
                    <div className="p-12 text-center text-text-muted">No students found matching your search.</div>
                )}
            </div>
        </div>
    );
};

export default ManageUsers;
