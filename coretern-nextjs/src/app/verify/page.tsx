'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ShieldCheck, Loader2, CheckCircle2, XCircle, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import { certificateAPI } from '@/lib/api';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function VerifyPage() {
    const [certId, setCertId] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [notFound, setNotFound] = useState(false);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!certId.trim()) return toast.error('Please enter a certificate ID');

        setLoading(true);
        setResult(null);
        setNotFound(false);

        try {
            const data = await certificateAPI.verify(certId.trim());
            setResult(data.data);
        } catch (err: any) {
            setNotFound(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <section className="min-h-screen pt-28 pb-20">
                <div className="container max-w-[700px]">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                        <div className="w-16 h-16 bg-[image:var(--grad-primary)] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[var(--shadow-primary)]">
                            <ShieldCheck className="text-white" size={30} />
                        </div>
                        <h1 className="text-[clamp(2.5rem,5vw,3.5rem)] font-extrabold mb-4 font-[family-name:var(--font-outfit)]">
                            Verify <span className="gradient-text">Certificate</span>
                        </h1>
                        <p className="text-[var(--text-muted)] text-lg">Enter the Certificate ID to verify its authenticity</p>
                    </motion.div>

                    <form onSubmit={handleVerify} className="flex gap-3 mb-12 max-sm:flex-col">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                            <input type="text" placeholder="Enter Certificate ID (e.g., CERT-XXXXXXXX)" value={certId}
                                onChange={(e) => setCertId(e.target.value)}
                                className="w-full py-4 pl-12 pr-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl text-[var(--text)] text-lg focus:outline-none focus:border-[var(--color-primary)] transition-colors" />
                        </div>
                        <button type="submit" disabled={loading} className="btn btn-primary !py-4 !px-8 !rounded-2xl !text-base">
                            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Verify'}
                        </button>
                    </form>

                    {result && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                            className="glass p-8 rounded-[var(--radius-xl)] border border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.05)]">
                            <div className="flex items-center gap-3 mb-6">
                                <CheckCircle2 className="text-[var(--color-success)]" size={28} />
                                <h2 className="text-xl font-bold text-[var(--color-success)]">Certificate Verified ✓</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-6 max-sm:grid-cols-1">
                                <div>
                                    <p className="text-[var(--text-muted)] text-sm mb-1">Certificate ID</p>
                                    <p className="font-bold">{result.certificateId}</p>
                                </div>
                                <div>
                                    <p className="text-[var(--text-muted)] text-sm mb-1">Recipient</p>
                                    <p className="font-bold">{result.isManual ? result.recipientName : result.enrollment?.fullName || result.user?.name}</p>
                                </div>
                                {!result.isManual && result.internship && (
                                    <>
                                        <div>
                                            <p className="text-[var(--text-muted)] text-sm mb-1">Internship</p>
                                            <p className="font-bold">{result.internship.title}</p>
                                        </div>
                                        <div>
                                            <p className="text-[var(--text-muted)] text-sm mb-1">Domain</p>
                                            <p className="font-bold">{result.internship.domain}</p>
                                        </div>
                                    </>
                                )}
                                {result.isManual && (
                                    <>
                                        <div>
                                            <p className="text-[var(--text-muted)] text-sm mb-1">Type</p>
                                            <p className="font-bold">{result.certType}</p>
                                        </div>
                                        <div>
                                            <p className="text-[var(--text-muted)] text-sm mb-1">Description</p>
                                            <p className="font-bold">{result.description}</p>
                                        </div>
                                    </>
                                )}
                                <div>
                                    <p className="text-[var(--text-muted)] text-sm mb-1">Issue Date</p>
                                    <p className="font-bold">{new Date(result.issueDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                            {result.qrCode && (
                                <div className="mt-6 flex justify-center">
                                    <img src={result.qrCode} alt="QR Code" className="w-32 h-32 rounded-lg" />
                                </div>
                            )}
                        </motion.div>
                    )}

                    {notFound && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                            className="glass p-8 rounded-[var(--radius-xl)] border border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.05)] text-center">
                            <XCircle className="text-[var(--color-danger)] mx-auto mb-4" size={40} />
                            <h2 className="text-xl font-bold text-[var(--color-danger)] mb-2">Certificate Not Found</h2>
                            <p className="text-[var(--text-muted)]">No certificate exists with the given ID. Please double-check and try again.</p>
                        </motion.div>
                    )}
                </div>
            </section>
            <Footer />
        </div>
    );
}
