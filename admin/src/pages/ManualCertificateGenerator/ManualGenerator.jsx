import React, { useState, useRef, useEffect } from 'react';
import { Award, Download, RefreshCw, Type, User, AlignLeft, Hash, QrCode, FileText, Calendar, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import axios from 'axios';
import ManualCertificate from '../../components/ManualCertificate/ManualCertificate';
import './ManualGenerator.css';

const ManualGenerator = () => {
    const certRef = useRef(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(true);

    const [formData, setFormData] = useState({
        certType: 'OF INTERNSHIP',
        recipientName: 'ADITYA SHARMA',
        certificateId: 'CERT-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        description: 'This document certifies the successful completion of an internship in <strong>App Development</strong> from <strong>01/02/2026</strong> to <strong>01/03/2026</strong>. As a student of <strong>B.Tech (CSE)</strong> at <strong>Ramgarh Engineering College (Roll No. 784749389834)</strong>, they have demonstrated commendable diligence and proficiency in all assigned tasks during their <strong>4-week</strong> tenure.'
    });

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/certificates/manual`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHistory(data.data);
        } catch (err) {
            console.error('History Fetch Error:', err);
        } finally {
            setLoadingHistory(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDownload = async () => {
        const node = document.getElementById('manual-certificate-print');
        if (!node) return;

        setIsGenerating(true);
        const loadingToast = toast.loading('Saving and Generating PDF...');

        try {
            // 1. Save to DB first
            const token = localStorage.getItem('token');
            await axios.post(`${import.meta.env.VITE_API_URL}/api/certificates/manual`, {
                certificateId: formData.certificateId,
                recipientName: formData.recipientName,
                certType: formData.certType,
                description: formData.description
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // 2. Capture and generate PDF
            const dataUrl = await toPng(node, {
                quality: 1.0,
                width: 1000,
                height: 707,
                pixelRatio: 2,
            });

            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [1000, 707]
            });

            pdf.addImage(dataUrl, 'PNG', 0, 0, 1000, 707);
            pdf.save(`Certificate-${formData.certificateId}.pdf`);

            toast.success('Certificate Issued and Downloaded!', { id: loadingToast });
            fetchHistory(); // Refresh history
        } catch (err) {
            console.error('PDF Error:', err);
            const errorMsg = err.response?.data?.error || 'Failed to issue certificate';
            toast.error(errorMsg, { id: loadingToast });
        } finally {
            setIsGenerating(false);
        }
    };

    const loadFromHistory = (cert) => {
        setFormData({
            certType: cert.certType,
            recipientName: cert.recipientName,
            certificateId: cert.certificateId,
            description: cert.description
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        toast.success('Loaded from history');
    };

    // Auto-generate verification link for QR
    const verificationLink = `https://www.coretern.com/verify/${formData.certificateId}`;

    return (
        <div className="manual-generator-page fade-in">
            <div className="page-header">
                <div className="flex items-center gap-3">
                    <div className="header-icon-box">
                        <Award size={24} className="text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Manual Certificate Generator</h1>
                        <p className="text-muted text-sm">Create, save, and manage custom certificates.</p>
                    </div>
                </div>
            </div>

            <div className="generator-layout">
                {/* Form Side */}
                <div className="generator-form-card card shadow-sm">
                    <div className="card-header border-b py-3 px-4 flex justify-between items-center">
                        <h3 className="font-semibold flex items-center gap-2">
                            <RefreshCw size={18} /> Certificate Details
                        </h3>
                    </div>

                    <div className="card-body p-4 space-y-4">
                        <div className="form-group">
                            <label className="form-label flex items-center gap-2">
                                <Type size={16} /> Certificate Type
                            </label>
                            <input
                                type="text"
                                className="form-input"
                                name="certType"
                                value={formData.certType}
                                onChange={handleInputChange}
                                placeholder="e.g. OF COMPLETION"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label flex items-center gap-2">
                                <User size={16} /> Recipient Name
                            </label>
                            <input
                                type="text"
                                className="form-input"
                                name="recipientName"
                                value={formData.recipientName}
                                onChange={handleInputChange}
                                placeholder="Full Name"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label flex items-center gap-2">
                                <Hash size={16} /> Certificate ID
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    className="form-input"
                                    name="certificateId"
                                    value={formData.certificateId}
                                    onChange={handleInputChange}
                                    placeholder="CERT-XXXXX"
                                />
                                <button
                                    className="btn btn-outline p-2"
                                    title="Regenerate ID"
                                    onClick={() => setFormData(prev => ({ ...prev, certificateId: 'CERT-' + Math.random().toString(36).substr(2, 9).toUpperCase() }))}
                                >
                                    <RefreshCw size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label flex items-center gap-2">
                                <QrCode size={16} /> QR Verification Link
                            </label>
                            <input
                                type="text"
                                className="form-input opacity-70 bg-gray-50 dark:bg-gray-800"
                                value={verificationLink}
                                readOnly
                                disabled
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label flex items-center gap-2">
                                <AlignLeft size={16} /> Description (HTML allowed)
                            </label>
                            <textarea
                                className="form-input description-textarea"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Certificate paragraph..."
                            />
                        </div>

                        <button
                            className="btn btn-primary w-full py-3 mt-4"
                            onClick={handleDownload}
                            disabled={isGenerating}
                        >
                            {isGenerating ? (
                                <><RefreshCw className="animate-spin" size={20} /> Processing...</>
                            ) : (
                                <><Download size={20} /> Save & Download PDF</>
                            )}
                        </button>
                    </div>
                </div>

                {/* Preview Side */}
                <div className="generator-preview-container">
                    <div className="preview-sticky-header">
                        <span className="badge badge-secondary">Real-time Preview</span>
                    </div>

                    <div className="preview-scaling-wrapper shadow-2xl">
                        <ManualCertificate
                            id={formData.certificateId}
                            recipientName={formData.recipientName}
                            certType={formData.certType}
                            description={formData.description}
                            qrData={verificationLink}
                        />
                    </div>
                </div>
            </div>

            {/* History Section */}
            <div className="mt-12 history-section">
                <div className="flex items-center gap-3 mb-6">
                    <div className="header-icon-box" style={{ padding: '0.5rem' }}>
                        <FileText size={20} className="text-secondary" />
                    </div>
                    <h2 className="text-xl font-bold">Manual Issues History</h2>
                </div>

                <div className="card shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="admin-table w-full text-left">
                            <thead className="bg-subtle border-b">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Certificate ID</th>
                                    <th className="px-6 py-4 font-semibold">Recipient</th>
                                    <th className="px-6 py-4 font-semibold">Type</th>
                                    <th className="px-6 py-4 font-semibold">Issue Date</th>
                                    <th className="px-6 py-4 font-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loadingHistory ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-10 text-center">
                                            <RefreshCw className="animate-spin mx-auto text-primary" size={24} />
                                        </td>
                                    </tr>
                                ) : history.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-10 text-center text-muted">
                                            No manual certificates issued yet.
                                        </td>
                                    </tr>
                                ) : (
                                    history.map((cert) => (
                                        <tr key={cert._id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                            <td className="px-6 py-4 font-mono text-sm">{cert.certificateId}</td>
                                            <td className="px-6 py-4 font-medium">{cert.recipientName}</td>
                                            <td className="px-6 py-4">
                                                <span className="badge badge-outline">{cert.certType}</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm flex items-center gap-2">
                                                <Calendar size={14} className="opacity-60" />
                                                {new Date(cert.issueDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    className="btn btn-sm btn-ghost flex items-center gap-1 text-primary"
                                                    onClick={() => loadFromHistory(cert)}
                                                >
                                                    View/Load <ChevronRight size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManualGenerator;
