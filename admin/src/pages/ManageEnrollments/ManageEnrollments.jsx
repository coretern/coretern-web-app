import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Award, CheckCircle, Clock, Loader2, FileText, X, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import './ManageEnrollments.css';

const ManageEnrollments = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [issuingId, setIssuingId] = useState(null);
    const [selectedEnrol, setSelectedEnrol] = useState(null);

    useEffect(() => {
        fetchEnrollments();
    }, []);

    const fetchEnrollments = async () => {
        const token = localStorage.getItem('token');
        try {
            const { data } = await axios.get('http://localhost:5000/api/enrollments', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEnrollments(data.data);
        } catch (err) {
            toast.error('Failed to fetch enrollments');
        } finally {
            setLoading(false);
        }
    };

    const handleIssueCertificate = async (enrolId) => {
        setIssuingId(enrolId);
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:5000/api/certificates', { enrollmentId: enrolId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Certificate Issued Successfully!');
            fetchEnrollments();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to issue certificate');
        } finally {
            setIssuingId(null);
        }
    };

    const filtered = enrollments.filter(e =>
        e.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.internship?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="loader-container"><Loader2 className="animate-spin text-primary" size={48} /></div>;

    return (
        <div className="manage-enroll-page">
            <header className="title-box flex justify-between items-center">
                <div>
                    <h1 className="outfit">Student Enrollments</h1>
                    <p className="text-text-muted">Monitor registrations and issue certificates</p>
                </div>
                <div className="search-container">
                    <Search className="search-icon" size={18} />
                    <input
                        type="text"
                        placeholder="Search student or course..."
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
                            <th>Student</th>
                            <th>Info</th>
                            <th>Internship Program</th>
                            <th>Payment</th>
                            <th>Status</th>
                            <th>Manual Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(enrol => (
                            <tr key={enrol._id}>
                                <td className="student-info">{enrol.user?.name}</td>
                                <td>
                                    <button
                                        className="btn-icon"
                                        title="View Student Info"
                                        onClick={() => setSelectedEnrol(enrol)}
                                    >
                                        <FileText size={18} />
                                    </button>
                                </td>
                                <td>{enrol.internship?.title}</td>
                                <td>
                                    <span className={`payment-badge ${enrol.paymentStatus}`}>
                                        {enrol.paymentStatus}
                                    </span>
                                </td>
                                <td>
                                    <div className={`status-indicator ${enrol.status === 'completed' ? 'completed' : 'pending'}`}>
                                        {enrol.status === 'completed' ? <CheckCircle size={16} /> : <Clock size={16} />}
                                        <span className="capitalize">{enrol.status}</span>
                                    </div>
                                </td>
                                <td>
                                    {enrol.status === 'enrolled' ? (
                                        <button
                                            onClick={() => handleIssueCertificate(enrol._id)}
                                            disabled={issuingId === enrol._id}
                                            className="btn btn-primary btn-sm"
                                        >
                                            {issuingId === enrol._id ? <Loader2 className="animate-spin" size={16} /> : <><Award size={16} /> Issue Cert</>}
                                        </button>
                                    ) : enrol.status === 'completed' ? (
                                        <span className="text-success font-bold flex items-center gap-1">
                                            <Award size={16} /> Issued
                                        </span>
                                    ) : (
                                        <span className="text-text-muted text-sm italic">Prerequisites Pending</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && <div className="p-12 text-center text-text-muted">No records found matching your query.</div>}
            </div>

            {/* Student Info Modal */}
            {selectedEnrol && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal-content glass" style={{ maxWidth: '600px' }}>
                        <button className="modal-close" onClick={() => setSelectedEnrol(null)}>
                            <X size={20} />
                        </button>
                        <h2 className="outfit mb-6">Student Enrollment Profile</h2>

                        <div className="info-grid">
                            <div className="info-item">
                                <label>Full Name (for Cert)</label>
                                <p>{selectedEnrol.fullName || selectedEnrol.user?.name}</p>
                            </div>
                            <div className="info-item">
                                <label>WhatsApp / Phone</label>
                                <p>{selectedEnrol.whatsappNumber || selectedEnrol.user?.phone || 'N/A'}</p>
                            </div>
                            <div className="info-item">
                                <label>Email Address</label>
                                <p>{selectedEnrol.email || selectedEnrol.user?.email}</p>
                            </div>
                            <div className="info-item">
                                <label>College Name</label>
                                <p>{selectedEnrol.collegeName || 'N/A'}</p>
                            </div>
                            <div className="info-item">
                                <label>College Reg No.</label>
                                <p>{selectedEnrol.collegeRegNumber || 'N/A'}</p>
                            </div>
                            <div className="info-item">
                                <label>Duration</label>
                                <p>
                                    {selectedEnrol.startDate ? new Date(selectedEnrol.startDate).toLocaleDateString() : 'N/A'} -
                                    {selectedEnrol.endDate ? new Date(selectedEnrol.endDate).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>
                            {selectedEnrol.resume && (
                                <div className="info-item full-width">
                                    <label>Resume / Documents</label>
                                    <a href={selectedEnrol.resume} target="_blank" rel="noreferrer" className="resume-link">
                                        <ExternalLink size={16} /> View Submitted Document
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageEnrollments;
