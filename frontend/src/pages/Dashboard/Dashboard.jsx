import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { BookOpen, Award, LogOut, Download, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { toPng } from 'html-to-image';
import download from 'downloadjs';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import CertificateTemplate from '../../Components/CertificateTemplate/CertificateTemplate';
import './Dashboard.css';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [enrollments, setEnrollments] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCert, setSelectedCert] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboard = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            // Check for order_id in URL (Payment Redirect)
            const queryParams = new URLSearchParams(window.location.search);
            const orderId = queryParams.get('order_id');

            if (orderId) {
                toast.loading('Verifying payment...', { id: 'verify' });
                try {
                    await axios.get(`http://localhost:5000/api/enrollments/verify/${orderId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.success('Enrollment Activated!', { id: 'verify' });
                    // Clean up URL
                    window.history.replaceState({}, document.title, window.location.pathname);
                } catch (err) {
                    toast.error(err.response?.data?.message || 'Payment verification failed', { id: 'verify' });
                }
            }

            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const [userRes, enrollRes, certRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/auth/me', config),
                    axios.get('http://localhost:5000/api/enrollments/my', config),
                    axios.get('http://localhost:5000/api/certificates/my', config)
                ]);

                setUser(userRes.data.data);
                setEnrollments(enrollRes.data.data);
                setCertificates(certRes.data.data);
            } catch (err) {
                localStorage.removeItem('token');
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, [navigate]);

    const handleDownload = async () => {
        const node = document.getElementById('certificate-print');
        if (!node) return;

        toast.loading('Generating Certificate...', { id: 'cert' });
        try {
            const dataUrl = await toPng(node, {
                quality: 1.0,
                width: 1000,
                height: 850,
                style: {
                    transform: 'scale(1)',
                    transformOrigin: 'top left'
                }
            });
            download(dataUrl, `Certificate-${selectedCert.certificateId}.png`);
            toast.success('Downloaded!', { id: 'cert' });
        } catch (err) {
            toast.error('Generation failed', { id: 'cert' });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        toast.success('Logged out');
        navigate('/login');
    };

    if (loading) return <div className="loader-container"><Loader2 className="animate-spin text-primary" size={60} /></div>;

    return (
        <div className="dashboard-page">
            <Navbar />

            <div className="container">
                <header className="dashboard-header">
                    <div>
                        <h1 className="outfit">Hello, {user?.name} 👋</h1>
                        <p className="text-text-muted">Manage your learning journey</p>
                    </div>
                    <button onClick={handleLogout} className="btn btn-outline">
                        <LogOut size={18} /> Logout
                    </button>
                </header>

                <div className="dashboard-grid">
                    <aside className="stats-sidebar">
                        <div className="stat-card glass">
                            <div className="stat-icon primary"><BookOpen size={24} /></div>
                            <div className="stat-info">
                                <h3>Enrollments</h3>
                                <p>{enrollments.length}</p>
                            </div>
                        </div>
                        <div className="stat-card glass">
                            <div className="stat-icon secondary"><Award size={24} /></div>
                            <div className="stat-info">
                                <h3>Achievements</h3>
                                <p>{certificates.length}</p>
                            </div>
                        </div>
                    </aside>

                    <main className="internships-list">
                        <h2 className="outfit">My Internships</h2>
                        {enrollments.length === 0 ? (
                            <div className="glass p-12 rounded-3xl text-center">
                                <p className="text-text-muted mb-6">Start your career with our professional programs.</p>
                                <Link to="/internships" className="btn btn-primary">Browse Internships</Link>
                            </div>
                        ) : (
                            enrollments.map((enrol, i) => {
                                const cert = certificates.find(c => c.internship?._id === enrol.internship?._id);
                                return (
                                    <motion.div
                                        key={enrol._id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="enrollment-card glass"
                                    >
                                        <div className="enroll-info">
                                            <img src={enrol.internship.image} className="enroll-img" alt="" />
                                            <div className="enroll-text">
                                                <h3 className="outfit">{enrol.internship.title}</h3>
                                                <span className={`status-badge ${enrol.paymentStatus}`}>
                                                    {enrol.paymentStatus}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="enroll-actions">
                                            {cert ? (
                                                <button onClick={() => setSelectedCert(cert)} className="btn btn-primary">
                                                    View Certificate
                                                </button>
                                            ) : (
                                                <button className="btn btn-outline" disabled>
                                                    {enrol.status === 'pending' ? 'Verification Pending' : 'In Progress'}
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })
                        )}
                    </main>
                </div>
            </div>

            {selectedCert && (
                <div className="cert-modal">
                    <div className="modal-actions">
                        <button onClick={handleDownload} className="btn btn-primary">
                            <Download size={20} /> Download
                        </button>
                        <button onClick={() => setSelectedCert(null)} className="btn btn-secondary">
                            <X size={20} /> Close
                        </button>
                    </div>

                    <div className="cert-preview-wrapper">
                        <CertificateTemplate
                            id={selectedCert.certificateId}
                            user={user}
                            internship={selectedCert.internship}
                            enrollment={selectedCert.enrollment}
                            date={selectedCert.issueDate}
                            qrCode={selectedCert.qrCode}
                        />
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default Dashboard;
