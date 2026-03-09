import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, User, Mail, Phone, Trash2, Loader2, ShieldAlert, ShieldCheck, Download, X as CloseIcon, ChevronDown, CheckSquare, Square } from 'lucide-react';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';
import './ManageUsers.css';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showExportOptions, setShowExportOptions] = useState(false);
    const [exportColumns, setExportColumns] = useState({
        'Student Name': true,
        'Gender': true,
        'Email Address': true,
        'Phone': true,
        'Source': true,
        'Status': true,
        'Joined Date': true,
        'Joined Time': true
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const token = localStorage.getItem('token');
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`, {
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
            await axios.put(`${import.meta.env.VITE_API_URL}/api/users/${id}/toggle-status`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(`Account ${currentStatus === 'active' ? 'Suspended' : 'Activated'}`);
            fetchUsers();
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    const toggleColumn = (column) => {
        setExportColumns(prev => ({ ...prev, [column]: !prev[column] }));
    };

    const handleExportExcel = () => {
        if (users.length === 0) return toast.error('No data to export');

        const selectedKeys = Object.keys(exportColumns).filter(key => exportColumns[key]);
        if (selectedKeys.length === 0) return toast.error('Please select at least one column');

        const dataToExport = filteredUsers.map(u => {
            const row = {};
            if (exportColumns['Student Name']) row['Student Name'] = u.name || 'N/A';
            if (exportColumns['Gender']) row['Gender'] = u.gender || 'N/A';
            if (exportColumns['Email Address']) row['Email Address'] = u.email || 'N/A';
            if (exportColumns['Phone']) row['Phone'] = u.phone || 'N/A';
            if (exportColumns['Source']) row['Source'] = u.googleId ? 'Google' : 'Form';
            if (exportColumns['Status']) row['Status'] = u.status?.toUpperCase();
            if (exportColumns['Joined Date']) row['Joined Date'] = new Date(u.createdAt).toLocaleDateString();
            if (exportColumns['Joined Time']) row['Joined Time'] = new Date(u.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return row;
        });

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
        XLSX.writeFile(workbook, `CoreTern_Users_${new Date().toISOString().split('T')[0]}.xlsx`);
        toast.success('Excel file exported successfully!');
        setShowExportOptions(false);
    };

    const handleDeleteUser = async (id, name) => {
        // Double Confirmation
        const firstConfirm = window.confirm(`Are you sure you want to delete ${name}? This ACTION IS PERMANENT.`);
        if (!firstConfirm) return;

        const secondConfirm = window.confirm(`RE-CONFIRM: Are you ABSOLUTELY sure? All certificates and enrollments for ${name} will be DELETED.`);
        if (!secondConfirm) return;

        const token = localStorage.getItem('token');
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/users/${id}`, {
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
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/${id}/impersonate`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Redirect to frontend with token in query param
            // Note: In production you'd use your actual frontend URL
            const frontendUrl = import.meta.env.VITE_FRONTEND_URL; // Updated to 5173 as Admin is on 5174
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
                <div className="flex items-center gap-4">
                    <div className="download-options-wrapper" style={{ position: 'relative' }}>
                        <button
                            className="btn-download"
                            onClick={() => setShowExportOptions(!showExportOptions)}
                        >
                            <Download size={18} /> Export Excel
                            <span className="selected-count">{Object.values(exportColumns).filter(Boolean).length}</span>
                        </button>

                        {showExportOptions && (
                            <div className="export-column-picker">
                                <div className="picker-header">
                                    <h4 className="outfit">Select Columns</h4>
                                    <button onClick={() => setShowExportOptions(false)} className="close-picker">
                                        <CloseIcon size={16} />
                                    </button>
                                </div>
                                <div className="column-options">
                                    {Object.keys(exportColumns).map(col => (
                                        <label key={col} className="column-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={exportColumns[col]}
                                                onChange={() => toggleColumn(col)}
                                            />
                                            {col}
                                        </label>
                                    ))}
                                </div>
                                <button
                                    className="btn-confirm-export"
                                    onClick={handleExportExcel}
                                >
                                    Generate Report
                                </button>
                            </div>
                        )}
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
                </div>
            </header>

            <div className="card admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Gender</th>
                            <th>Email Address</th>
                            <th>Phone</th>
                            <th>Source</th>
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
                                <td>
                                    <span className="gender-text">{user.gender || 'N/A'}</span>
                                </td>
                                <td>{user.email}</td>
                                <td>{user.phone || 'N/A'}</td>
                                <td>
                                    <span className={`source-badge ${user.googleId ? 'google' : 'form'}`}>
                                        {user.googleId ? 'Google' : 'Form'}
                                    </span>
                                </td>
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
                                <td>
                                    <div className="flex flex-col">
                                        <span style={{ fontWeight: '600' }}>{new Date(user.createdAt).toLocaleDateString()}</span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            {new Date(user.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </td>
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
