'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldCheck, Loader2, AlertCircle, User, Book, Calendar } from 'lucide-react';
import Link from 'next/link';
import { certificateAPI } from '@/lib/api';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function VerifyPage() {
    const searchParams = useSearchParams();
    const queryId = searchParams.get('id') || '';
    const [id, setId] = useState(queryId);
    const [certificate, setCertificate] = useState<any>(null);
    const [verifying, setVerifying] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (queryId) {
            setId(queryId);
            doVerify(queryId);
        }
    }, [queryId]);

    const doVerify = async (certId: string) => {
        if (!certId.trim()) return;
        setVerifying(true);
        setError(null);
        setCertificate(null);
        try {
            const data = await certificateAPI.verify(certId.trim());
            setCertificate(data.data);
        } catch {
            setError('Invalid or expired certificate ID');
        } finally {
            setVerifying(false);
        }
    };

    const handleVerify = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!id.trim()) return;
        setVerifying(true);
        setError(null);
        setCertificate(null);
        try {
            const data = await certificateAPI.verify(id.trim());
            setCertificate(data.data);
        } catch (err: any) {
            setError('Invalid or expired certificate ID');
        } finally {
            setVerifying(false);
        }
    };

    return (
        <div className="verify-page">
            <Navbar />
            <main className="verify-main">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="verify-card glass"
                    >
                        {/* Search State */}
                        {!certificate && !verifying && (
                            <div>
                                <div className="verify-badge-container">
                                    <div className="verify-shield-bg"></div>
                                    <ShieldCheck className="verify-icon" size={80} />
                                </div>
                                <h1 className="verify-title outfit">Verify Credentials</h1>
                                <p className="verify-subtitle">
                                    Verify the authenticity of CoreTern digital certificates by entering the unique ID.
                                </p>

                                <form onSubmit={handleVerify} className="verify-form">
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <input
                                            type="text"
                                            className="auth-input verify-input"
                                            placeholder="CERT-ID-XXXX"
                                            value={id}
                                            onChange={(e) => setId(e.target.value.toUpperCase())}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}>
                                        Verify Certificate
                                    </button>
                                </form>

                                {error && (
                                    <div className="error-msg" style={{ fontWeight: 700 }}>
                                        <AlertCircle size={18} /> {error}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Verifying State */}
                        {verifying && (
                            <div style={{ padding: '3rem 0', textAlign: 'center' }}>
                                <div className="verify-badge-container">
                                    <Loader2 className="animate-spin" size={60} style={{ color: 'var(--color-primary)' }} />
                                </div>
                                <p className="outfit" style={{ fontSize: '1.5rem', fontWeight: 700 }}>Verifying ID...</p>
                                <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Connecting to secure records...</p>
                            </div>
                        )}

                        {/* Success State */}
                        {certificate && (
                            <div>
                                <div className="verify-badge-container">
                                    <div className="verify-shield-bg" style={{ background: '#10b981' }}></div>
                                    <ShieldCheck className="verify-icon" size={80} style={{ color: '#10b981' }} />
                                </div>
                                <h2 className="verify-title outfit">Verified Authentic</h2>
                                <p className="verify-subtitle">
                                    This document is valid and was officially issued by <strong>CoreTern Platforms</strong>.
                                </p>

                                <div className="verify-info-grid">
                                    <div className="info-item">
                                        <div className="label"><User size={14} /> Issued To</div>
                                        <div className="value">{certificate.isManual ? certificate.recipientName : (certificate.enrollment?.fullName || certificate.user?.name)}</div>
                                    </div>

                                    {!certificate.isManual && certificate.internship && (
                                        <div className="info-item">
                                            <div className="label"><Book size={14} /> Internship</div>
                                            <div className="value">{certificate.internship.title}</div>
                                        </div>
                                    )}

                                    <div className="info-item">
                                        <div className="label"><ShieldCheck size={14} /> Certificate ID</div>
                                        <div className="value">{certificate.certificateId}</div>
                                    </div>

                                    <div className="info-item">
                                        <div className="label"><Calendar size={14} /> Issue Date</div>
                                        <div className="value">{new Date(certificate.issueDate).toLocaleDateString(undefined, {
                                            year: 'numeric', month: 'long', day: 'numeric'
                                        })}</div>
                                    </div>

                                    {certificate.isManual && (
                                        <div className="info-item">
                                            <div className="label"><ShieldCheck size={14} /> Status</div>
                                            <div className="value" style={{ color: '#059669', fontWeight: 'bold' }}>Verified Certificate</div>
                                        </div>
                                    )}

                                    {certificate.isManual && certificate.description && (
                                        <div className="info-item description-item">
                                            <div className="label"><AlertCircle size={14} /> Program Details</div>
                                            <div className="value description-text" dangerouslySetInnerHTML={{ __html: certificate.description }}></div>
                                        </div>
                                    )}

                                    {!certificate.isManual && certificate.enrollment?.collegeName && (
                                        <div className="info-item">
                                            <div className="label"><ShieldCheck size={14} /> Institution</div>
                                            <div className="value">{certificate.enrollment.collegeName}</div>
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <button onClick={() => { setCertificate(null); setId(''); }} className="btn btn-outline" style={{ width: '100%', padding: '1rem' }}>
                                        Verify Another
                                    </button>
                                    <Link href="/" className="btn btn-primary" style={{ width: '100%', padding: '1rem', textAlign: 'center' }}>
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
    );
}
