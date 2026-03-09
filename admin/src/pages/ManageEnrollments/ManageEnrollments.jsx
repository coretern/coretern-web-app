import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Award, CheckCircle, Clock, Loader2, FileText, X, ExternalLink, Download, User, Mail, Phone, GraduationCap, Calendar, Hash, UserCircle, ShieldCheck, FileSpreadsheet as ExcelIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import './ManageEnrollments.css';

const ManageEnrollments = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [issuingId, setIssuingId] = useState(null);
    const [selectedEnrol, setSelectedEnrol] = useState(null);
    const [showExportOptions, setShowExportOptions] = useState(false);
    const [exportColumns, setExportColumns] = useState({
        'Student Name': true,
        'Email': true,
        'WhatsApp/Phone': true,
        'College Name': true,
        'Course': true,
        'Branch': true,
        'Registration No': true,
        'Internship Program': true,
        'Payment Status': true,
        'Enrollment Status': true,
        'Enrolled Date': true,
        'Enrollment Time': true,
        'NOC/Resume Link': true,
        'Profile Gender': true,
        'Profile Phone': true
    });

    useEffect(() => {
        fetchEnrollments();
    }, []);

    const fetchEnrollments = async () => {
        const token = localStorage.getItem('token');
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/enrollments`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEnrollments(data.data);
        } catch (err) {
            toast.error('Failed to fetch enrollments');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadResume = async (url, studentName) => {
        if (!url) return;

        toast.loading('Preparing download...', { id: 'download' });

        // Cloudinary specific fix: Use fl_attachment to force download and bypass CORS
        if (url.includes('cloudinary.com')) {
            try {
                const parts = url.split('/');
                const uploadIndex = parts.indexOf('upload');
                if (uploadIndex !== -1) {
                    parts.splice(uploadIndex + 1, 0, 'fl_attachment');
                    const downloadUrl = parts.join('/');
                    const link = document.createElement('a');
                    link.href = downloadUrl;
                    link.download = `NOC_${(studentName || 'Student').replace(/\s+/g, '_')}`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    toast.success('Download started successfully!', { id: 'download' });
                    return;
                }
            } catch (err) {
                console.error('Cloudinary transformation error', err);
            }
        }

        // Fallback for same-origin or other URLs
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');

            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;

            const extension = url.split('.').pop().split(/\#|\?/)[0] || (blob.type.includes('pdf') ? 'pdf' : 'jpg');
            const fileName = `NOC_${(studentName || 'Student').replace(/\s+/g, '_')}.${extension}`;

            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);

            toast.success('File downloaded successfully!', { id: 'download' });
        } catch (err) {
            console.error('Download error:', err);
            toast.error('Direct download failed. Opening in new tab...', { id: 'download' });
            window.open(url, '_blank');
        }
    };

    const handleIssueCertificate = async (enrolId) => {
        setIssuingId(enrolId);
        const token = localStorage.getItem('token');
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/certificates`, { enrollmentId: enrolId }, {
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

    const handleExportExcel = () => {
        if (enrollments.length === 0) return toast.error('No data to export');

        const selectedKeys = Object.keys(exportColumns).filter(key => exportColumns[key]);
        if (selectedKeys.length === 0) return toast.error('Please select at least one column');

        const dataToExport = enrollments.map(e => {
            const row = {};
            if (exportColumns['Student Name']) row['Student Name'] = e.fullName || e.user?.name || 'N/A';
            if (exportColumns['Email']) row['Email'] = e.email || e.user?.email || 'N/A';
            if (exportColumns['WhatsApp/Phone']) row['WhatsApp/Phone'] = e.whatsappNumber || e.user?.phone || 'N/A';
            if (exportColumns['College Name']) row['College Name'] = e.collegeName || 'N/A';
            if (exportColumns['Course']) row['Course'] = e.course || 'N/A';
            if (exportColumns['Branch']) row['Branch'] = e.branch || 'N/A';
            if (exportColumns['Registration No']) row['Registration No'] = e.collegeRegNumber || 'N/A';
            if (exportColumns['Internship Program']) row['Internship Program'] = e.internship?.title || 'N/A';
            if (exportColumns['Payment Status']) row['Payment Status'] = e.paymentStatus?.toUpperCase() || 'N/A';
            if (exportColumns['Enrollment Status']) row['Enrollment Status'] = e.status?.toUpperCase() || 'N/A';
            if (exportColumns['Enrolled Date']) row['Enrolled Date'] = e.enrolledAt ? new Date(e.enrolledAt).toLocaleDateString() : 'N/A';
            if (exportColumns['Enrollment Time']) row['Enrollment Time'] = e.enrolledAt ? new Date(e.enrolledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A';
            if (exportColumns['NOC/Resume Link']) row['NOC/Resume Link'] = e.resume || 'N/A';
            if (exportColumns['Profile Gender']) row['Profile Gender'] = e.user?.gender || 'N/A';
            if (exportColumns['Profile Phone']) row['Profile Phone'] = e.user?.phone || 'N/A';
            return row;
        });

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Enrollments');
        XLSX.writeFile(workbook, `CoreTern_Enrollments_${new Date().toISOString().split('T')[0]}.xlsx`);
        toast.success('Excel file exported successfully!');
        setShowExportOptions(false);
    };

    const toggleColumn = (column) => {
        setExportColumns(prev => ({
            ...prev,
            [column]: !prev[column]
        }));
    };

    const filtered = enrollments.filter(e =>
        e.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.internship?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="loader-container"><Loader2 className="animate-spin text-primary" size={48} /></div>;

    const frontendUrl = 'http://localhost:5173';

    return (
        <div className="manage-enroll-page">
            <header className="title-box flex justify-between items-center">
                <div>
                    <h1 className="outfit">Student Enrollments</h1>
                    <p className="text-text-muted">Monitor registrations and issue certificates</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="download-options-wrapper">
                        <button onClick={() => setShowExportOptions(!showExportOptions)} className="btn-download btn-excel" title="Choose Columns and Export">
                            <ExcelIcon size={18} />
                            <span>Export Excel</span>
                        </button>

                        {showExportOptions && (
                            <div className="export-column-picker glass">
                                <div className="picker-header">
                                    <h4 className="outfit">Select Columns</h4>
                                    <button onClick={() => setShowExportOptions(false)} className="close-picker"><X size={14} /></button>
                                </div>
                                <div className="column-options">
                                    {Object.keys(exportColumns).map(col => (
                                        <label key={col} className="column-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={exportColumns[col]}
                                                onChange={() => toggleColumn(col)}
                                            />
                                            <span>{col}</span>
                                        </label>
                                    ))}
                                </div>
                                <button onClick={handleExportExcel} className="btn-confirm-export">
                                    Generate Excel ({Object.values(exportColumns).filter(Boolean).length} Selected)
                                </button>
                            </div>
                        )}
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
                </div>
            </header>

            <div className="card admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Info</th>
                            <th>Date & Time</th>
                            <th>Internship Program</th>
                            <th>Payment</th>
                            <th>Agreement</th>
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
                                <td>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-1 font-bold" style={{ fontSize: '0.9rem' }}>
                                            <Calendar size={14} className="text-primary" />
                                            <span>
                                                {enrol.enrolledAt ? new Date(enrol.enrolledAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 text-text-muted" style={{ fontSize: '0.8rem' }}>
                                            <Clock size={13} />
                                            <span>
                                                {enrol.enrolledAt ? new Date(enrol.enrolledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td>{enrol.internship?.title}</td>
                                <td>
                                    <span className={`payment-badge ${enrol.paymentStatus}`}>
                                        {enrol.paymentStatus}
                                    </span>
                                </td>
                                <td>
                                    <div className="flex gap-2">
                                        <a href={`${frontendUrl}/refund-policy`} target="_blank" rel="noreferrer" className={`mini-badge-pill ${enrol.agreedToRefundPolicy ? 'success' : 'danger'}`} title="Agreement to Refund Policy (Click to view)">R</a>
                                    </div>
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
            {
                selectedEnrol && (
                    <div className="admin-modal-overlay">
                        <div className="admin-modal-content glass profile-modal">
                            <button className="modal-close" onClick={() => setSelectedEnrol(null)}>
                                <X size={20} />
                            </button>

                            <div className="modal-profile-header">
                                <div className="profile-avatar outfit">
                                    {(selectedEnrol.fullName || selectedEnrol.user?.name)?.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="outfit">Enrollment Profile</h2>
                                    <p className="profile-subtitle font-bold">{selectedEnrol.internship?.title}</p>
                                </div>
                            </div>

                            <div className="modal-sections-grid">
                                <section className="modal-section">
                                    <h3 className="section-subtitle outfit">Personal Details</h3>
                                    <div className="info-list">
                                        <div className="info-card">
                                            <div className="card-icon"><UserCircle size={18} /></div>
                                            <div className="card-details">
                                                <label>Full Name</label>
                                                <p>{selectedEnrol.fullName || selectedEnrol.user?.name}</p>
                                            </div>
                                        </div>
                                        <div className="info-card">
                                            <div className="card-icon"><User size={18} /></div>
                                            <div className="card-details">
                                                <label>Gender</label>
                                                <p className="capitalize">{selectedEnrol.gender || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="info-card">
                                            <div className="card-icon"><Phone size={18} /></div>
                                            <div className="card-details">
                                                <label>WhatsApp / Phone</label>
                                                <p>{selectedEnrol.whatsappNumber || selectedEnrol.user?.phone || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="info-card">
                                            <div className="card-icon"><Mail size={18} /></div>
                                            <div className="card-details">
                                                <label>Email Address</label>
                                                <p>{selectedEnrol.email || selectedEnrol.user?.email}</p>
                                            </div>
                                        </div>
                                        <div className="info-card">
                                            <div className="card-icon"><ShieldCheck size={18} /></div>
                                            <div className="card-details">
                                                <label>Refund Policy Agreed</label>
                                                <p className={selectedEnrol.agreedToRefundPolicy ? 'text-success' : 'text-danger'}>
                                                    {selectedEnrol.agreedToRefundPolicy ? 'Yes' : 'No'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section className="modal-section">
                                    <h3 className="section-subtitle outfit">Academic & Program</h3>
                                    <div className="info-list">
                                        <div className="info-card">
                                            <div className="card-icon"><GraduationCap size={18} /></div>
                                            <div className="card-details">
                                                <label>College Name</label>
                                                <p>{selectedEnrol.collegeName || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="info-card">
                                            <div className="card-icon"><FileText size={18} /></div>
                                            <div className="card-details">
                                                <label>Course / Degree</label>
                                                <p>{selectedEnrol.course || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="info-card">
                                            <div className="card-icon"><GraduationCap size={18} /></div>
                                            <div className="card-details">
                                                <label>Branch</label>
                                                <p>{selectedEnrol.branch || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="info-card">
                                            <div className="card-icon"><Hash size={18} /></div>
                                            <div className="card-details">
                                                <label>College Reg No.</label>
                                                <p>{selectedEnrol.collegeRegNumber || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="info-card">
                                            <div className="card-icon"><Calendar size={18} /></div>
                                            <div className="card-details">
                                                <label>Duration</label>
                                                <p>
                                                    {selectedEnrol.startDate ? new Date(selectedEnrol.startDate).toLocaleDateString() : 'N/A'} to {' '}
                                                    {selectedEnrol.endDate ? new Date(selectedEnrol.endDate).toLocaleDateString() : 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="info-card">
                                            <div className="card-icon"><CheckCircle size={18} /></div>
                                            <div className="card-details">
                                                <label>Payment & Date</label>
                                                <p className="capitalize">{selectedEnrol.paymentStatus} - {selectedEnrol.enrolledAt ? new Date(selectedEnrol.enrolledAt).toLocaleDateString() : 'N/A'}</p>
                                            </div>
                                        </div>
                                        {selectedEnrol.paymentId && (
                                            <div className="info-card">
                                                <div className="card-icon"><Hash size={18} /></div>
                                                <div className="card-details">
                                                    <label>Transaction ID</label>
                                                    <p style={{ fontSize: '0.8rem', wordBreak: 'break-all' }}>{selectedEnrol.paymentId}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            </div>

                            {selectedEnrol.resume && (
                                <div className="modal-footer-action">
                                    <div className="flex gap-4">
                                        <a href={selectedEnrol.resume} target="_blank" rel="noreferrer" className="resume-link-premium flex-1">
                                            <ExternalLink size={18} />
                                            <span>View in New Tab</span>
                                        </a>
                                        <button
                                            onClick={() => handleDownloadResume(selectedEnrol.resume, selectedEnrol.fullName || selectedEnrol.user?.name)}
                                            className="download-btn-premium flex-1"
                                        >
                                            <Download size={18} />
                                            <span>Download Document</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default ManageEnrollments;
