import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ShieldCheck, User, Book, Calendar, Loader2, AlertCircle } from 'lucide-react';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import PageTransition from '../../Components/PageTransition';
import './VerifyCertificate.css';

const VerifyCertificate = () => {
    const { id: urlId } = useParams();
    const [id, setId] = useState(urlId || '');
    const [certificate, setCertificate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [verifying, setVerifying] = useState(false);

    useEffect(() => {
        if (urlId) {
            handleVerify(urlId);
        }
    }, [urlId]);

    const handleVerify = async (certId) => {
        if (!certId) return;
        setVerifying(true);
        setError(null);
        setCertificate(null);
        try {
            const { data } = await axios.get(`http://localhost:5000/api/certificates/verify/${certId}`);
            setCertificate(data.data);
        } catch (err) {
            setError('Invalid or expired certificate ID');
        } finally {
            setVerifying(false);
        }
    };

    const handleManualSubmit = (e) => {
        e.preventDefault();
        handleVerify(id);
    };

    if (loading) return <div className="loader-container"><Loader2 className="animate-spin text-primary" size={60} /></div>;

    return (
        <PageTransition>
            <div className="verify-page">
                <Navbar />

                <main className="verify-main">
                    <div className="container flex justify-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="verify-card glass"
                        >
                            {!certificate && !verifying && (!error || id !== urlId) && (
                                <div className="search-state">
                                    <div className="verify-badge-container">
                                        <div className="verify-shield-bg"></div>
                                        <ShieldCheck className="verify-icon" size={80} />
                                    </div>
                                    <h1 className="verify-title outfit">Verify Credentials</h1>
                                    <p className="verify-subtitle">Verify the authenticity of TechStart digital certificates by entering the unique ID.</p>

                                    <form onSubmit={handleManualSubmit} className="verify-form">
                                        <div className="input-wrapper mb-6">
                                            <input
                                                type="text"
                                                className="auth-input verify-input"
                                                placeholder="CERT-ID-XXXX"
                                                value={id}
                                                onChange={(e) => setId(e.target.value.toUpperCase())}
                                                required
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-primary w-full py-4">
                                            Verify Certificate
                                        </button>
                                    </form>
                                    {error && (
                                        <div className="error-msg font-bold">
                                            <AlertCircle size={18} /> {error}
                                        </div>
                                    )}
                                </div>
                            )}

                            {!certificate && !verifying && error && id === urlId && (
                                <div className="error-state">
                                    <div className="verify-badge-container">
                                        <div className="verify-shield-bg" style={{ background: '#ef4444' }}></div>
                                        <AlertCircle className="verify-icon danger" size={80} />
                                    </div>
                                    <h1 className="verify-title outfit text-danger">Invalid Certificate</h1>
                                    <p className="verify-subtitle">No record found for ID: <strong>{urlId || id}</strong>. This certificate may be invalid or officially revoked.</p>

                                    <div className="flex flex-col gap-4">
                                        <button onClick={() => { setError(null); setId(''); window.history.pushState({}, '', '/verify'); }} className="btn btn-outline w-full py-4">
                                            Try Different ID
                                        </button>
                                        <Link to="/" className="btn btn-primary w-full py-4">
                                            Return Home
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {verifying && (
                                <div className="verifying-state py-12">
                                    <div className="verify-badge-container">
                                        <Loader2 className="animate-spin text-primary" size={60} />
                                    </div>
                                    <p className="outfit text-2xl font-bold">Verifying ID...</p>
                                    <p className="text-muted mt-2">Connecting to secure records...</p>
                                </div>
                            )}

                            {certificate && (
                                <div className="success-state">
                                    <div className="verify-badge-container">
                                        <div className="verify-shield-bg" style={{ background: '#10b981' }}></div>
                                        <ShieldCheck className="verify-icon success" size={80} />
                                    </div>
                                    <h1 className="verify-title outfit">Verified Authentic</h1>
                                    <p className="verify-subtitle">This document is valid and was officially issued by <strong>TechStart Platforms</strong>.</p>

                                    <div className="verify-info-grid">
                                        <div className="info-item">
                                            <div className="label"><User size={14} /> Issued To</div>
                                            <div className="value">{certificate.user?.name}</div>
                                        </div>
                                        <div className="info-item">
                                            <div className="label"><Book size={14} /> Internship</div>
                                            <div className="value">{certificate.internship?.title}</div>
                                        </div>
                                        <div className="info-item">
                                            <div className="label"><ShieldCheck size={14} /> Certificate ID</div>
                                            <div className="value">{certificate.certificateId}</div>
                                        </div>
                                        <div className="info-item">
                                            <div className="label"><Calendar size={14} /> Issue Date</div>
                                            <div className="value">{new Date(certificate.issueDate).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}</div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <button onClick={() => setCertificate(null)} className="btn btn-outline w-full py-4">
                                            Verify Another
                                        </button>
                                        <Link to="/" className="btn btn-primary w-full py-4">
                                            Return Home
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </main>

                <Footer />
            </div>
        </PageTransition>
    );
};

export default VerifyCertificate;
