'use client';
import { useState, useEffect } from 'react';
import { Loader2, Search, Plus, X, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { certificateAPI } from '@/lib/api';

export default function AdminCertificates() {
    const [certificates, setCertificates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ certificateId: '', recipientName: '', certType: 'Internship', description: '' });
    const [generatingId, setGeneratingId] = useState<string | null>(null);
    const [certPreviewUrl, setCertPreviewUrl] = useState<string | null>(null);
    const [certPreviewData, setCertPreviewData] = useState<any>(null);
    const [generatingPdf, setGeneratingPdf] = useState(false);

    const generateCertificatePreview = async (certId: string) => {
        setGeneratingId(certId);
        toast.loading('Generating preview...', { id: 'manual-dl' });
        try {
            // Fetch live data from DB
            const res = await fetch(`/api/certificates/download/${certId}`);
            const json = await res.json();
            if (!json.success) throw new Error(json.error);
            const cert = json.data;

            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = '/CoreTern_Manual_Certificate.png';
            await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject; });

            const canvas = document.createElement('canvas');
            canvas.width = img.width;  // 6250
            canvas.height = img.height; // 4419
            const ctx = canvas.getContext('2d')!;
            
            // Fill white background for JPEG
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);

            const W = canvas.width;
            const H = canvas.height;

            // ===== CERTIFICATE ID top-right (gold text) =====
            ctx.fillStyle = '#c4973b';
            ctx.font = 'bold 70px Arial, sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText(`CERTIFICATE ID: ${cert.certificateId}`, W - 180, 200);

            // ===== CERTIFICATE TYPE (gold text) =====
            ctx.fillStyle = '#c4973b';
            ctx.font = 'bold 130px Georgia, serif';
            ctx.textAlign = 'center';
            let typeStr = cert.certType.toUpperCase();
            if (!typeStr.startsWith('OF ')) typeStr = 'OF ' + typeStr;
            ctx.fillText(typeStr, W / 2, 1260);

            // ===== RECIPIENT NAME (centered, bold, large) =====
            ctx.fillStyle = '#1a1a2e';
            ctx.font = 'bold 200px Georgia, serif';
            ctx.textAlign = 'center';
            ctx.fillText(cert.recipientName || '', W / 2, 2480);

            // ===== Description paragraph (wrapped text) =====
            ctx.font = '80px Arial, sans-serif';
            ctx.fillStyle = '#333';
            
            const words = (cert.description || '').split(' ');
            let line = '';
            let y = 2800;
            const lineHeight = 120;
            const maxWidth = 4800;
            
            for (let n = 0; n < words.length; n++) {
                const testLine = line + words[n] + ' ';
                const metrics = ctx.measureText(testLine);
                if (metrics.width > maxWidth && n > 0) {
                    ctx.fillText(line, W / 2, y);
                    line = words[n] + ' ';
                    y += lineHeight;
                } else {
                    line = testLine;
                }
            }
            ctx.fillText(line, W / 2, y);

            // ===== Issue date (bottom-left, near signature) =====
            ctx.textAlign = 'left';
            ctx.font = 'bold 65px Arial, sans-serif';
            ctx.fillStyle = '#1a5276';
            const issueDateStr = cert.issueDate ? new Date(cert.issueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
            ctx.fillText(`Issued on: ${issueDateStr}`, 1050, 4050);

            // ===== QR Code (bottom-right) =====
            const qrSize = 420;
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=https://www.coretern.com/verify?id=${cert.certificateId}`;
            const qrImg = new Image();
            qrImg.crossOrigin = 'anonymous';
            qrImg.src = qrUrl;
            await new Promise((resolve) => { qrImg.onload = resolve; qrImg.onerror = resolve; });
            if (qrImg.complete && qrImg.naturalWidth > 0) {
                ctx.drawImage(qrImg, W - 820, H - 720, qrSize, qrSize);
            }

            // ===== Cert ID label below QR =====
            ctx.font = 'bold 55px Arial, sans-serif';
            ctx.fillStyle = '#c4973b';
            ctx.textAlign = 'center';
            ctx.fillText(`ID: ${cert.certificateId}`, W - 610, H - 250);

            // ===== Cert ID label below QR =====
            ctx.font = 'bold 55px Arial, sans-serif';
            ctx.fillStyle = '#c4973b';
            ctx.textAlign = 'center';
            ctx.fillText(`ID: ${cert.certificateId}`, W - 610, H - 250);

            // Create compressed JPEG for preview and PDF
            setCertPreviewUrl(canvas.toDataURL('image/jpeg', 0.8));
            setCertPreviewData(cert);
            
            toast.success('Preview generated successfully!', { id: 'manual-dl' });
        } catch (err: any) {
            toast.error(err.message || 'Failed to generate preview', { id: 'manual-dl' });
        } finally {
            setGeneratingId(null);
        }
    };

    const downloadAsPdf = async () => {
        if (!certPreviewUrl || !certPreviewData) return;
        setGeneratingPdf(true);
        try {
            const { default: jsPDF } = await import('jspdf');
            const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
            
            pdf.addImage(certPreviewUrl, 'JPEG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
            pdf.save(`${certPreviewData.certificateId}_Certificate.pdf`);
            
            toast.success('Certificate downloaded successfully!');
        } catch (error) {
            toast.error('Failed to download PDF');
        } finally {
            setGeneratingPdf(false);
        }
    };

    useEffect(() => { fetchCerts(); }, []);

    const fetchCerts = async () => {
        try { const data = await certificateAPI.getManual(); setCertificates(data?.data || []); }
        catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await certificateAPI.issueManual(form);
            toast.success('Manual certificate issued!');
            setShowModal(false);
            setForm({ certificateId: '', recipientName: '', certType: 'Internship', description: '' });
            fetchCerts();
        } catch (err: any) { toast.error(err.message); }
        finally { setSaving(false); }
    };

    const filtered = certificates.filter((c: any) =>
        c.certificateId?.toLowerCase().includes(search.toLowerCase()) ||
        c.recipientName?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[var(--color-primary)]" size={40} /></div>;

    return (
        <div>
            <div className="flex items-center justify-between mb-8 max-md:flex-col max-md:gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold font-[family-name:var(--font-outfit)]">Certificates</h1>
                    <p className="text-[var(--text-muted)] text-sm">{certificates.length} manual certificates</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
                        <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-sm text-[var(--text)] focus:outline-none focus:border-[var(--color-primary)]" />
                    </div>
                    <button onClick={() => setShowModal(true)} className="btn btn-primary btn-sm"><Plus size={14} /> Issue Manual</button>
                </div>
            </div>

            <div className="glass rounded-2xl border border-[var(--border)] overflow-hidden">
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead><tr><th>Certificate ID</th><th>Recipient</th><th>Type</th><th>Description</th><th>Issue Date</th><th>Action</th></tr></thead>
                        <tbody>
                            {filtered.map((c: any) => (
                                <tr key={c._id}>
                                    <td className="font-mono font-semibold">{c.certificateId}</td>
                                    <td>{c.recipientName}</td>
                                    <td><span className="badge badge-primary">{c.certType}</span></td>
                                    <td className="text-[var(--text-muted)] text-sm max-w-[200px] truncate">{c.description}</td>
                                    <td className="text-[var(--text-muted)] text-sm">{new Date(c.issueDate).toLocaleDateString()}</td>
                                    <td>
                                        <button 
                                            onClick={() => generateCertificatePreview(c.certificateId)}
                                            disabled={generatingId === c.certificateId}
                                            className="btn btn-sm btn-outline flex items-center gap-2"
                                            title="View Certificate"
                                        >
                                            {generatingId === c.certificateId ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                                            Certificate
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-[var(--text-muted)]">No certificates found</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Manual Certificate Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
                    <div className="glass p-8 rounded-[var(--radius-xl)] border border-[var(--border)] w-full max-w-[500px]" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold font-[family-name:var(--font-outfit)]">Issue Manual Certificate</h2>
                            <button onClick={() => setShowModal(false)} className="text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer bg-transparent border-none"><X size={22} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <label className="text-sm font-medium text-[var(--text-muted)] mb-1 block">Certificate ID *</label>
                                <input className="admin-input" value={form.certificateId} onChange={e => setForm({...form, certificateId: e.target.value})} required placeholder="e.g. CERT-2026-001" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-[var(--text-muted)] mb-1 block">Recipient Name *</label>
                                <input className="admin-input" value={form.recipientName} onChange={e => setForm({...form, recipientName: e.target.value})} required />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-[var(--text-muted)] mb-1 block">Type</label>
                                <select className="admin-select" value={form.certType} onChange={e => setForm({...form, certType: e.target.value})}>
                                    <option value="Internship">Internship</option>
                                    <option value="Workshop">Workshop</option>
                                    <option value="Hackathon">Hackathon</option>
                                    <option value="Achievement">Achievement</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-[var(--text-muted)] mb-1 block">Description</label>
                                <textarea className="admin-input !min-h-[80px] resize-y" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Certificate description..." />
                            </div>
                            <div className="flex gap-3 justify-end mt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">Cancel</button>
                                <button type="submit" disabled={saving} className="btn btn-primary">
                                    {saving ? <Loader2 className="animate-spin" size={16} /> : 'Issue Certificate'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Certificate Preview Modal */}
            {certPreviewUrl && certPreviewData && (
                <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4">
                    <div className="bg-[var(--surface)] rounded-2xl overflow-hidden w-full max-w-[1000px] max-h-[90vh] flex flex-col shadow-2xl">
                        <div className="px-6 py-4 border-b border-[var(--border)] flex justify-between items-center bg-[var(--surface)]">
                            <div>
                                <h3 className="text-xl font-bold font-[family-name:var(--font-outfit)]">Certificate Preview</h3>
                                <p className="text-sm text-[var(--text-muted)]">ID: {certPreviewData.certificateId}</p>
                            </div>
                            <button onClick={() => { setCertPreviewUrl(null); setCertPreviewData(null); }} className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center border-none cursor-pointer transition-all hover:bg-red-500/20">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-8 overflow-y-auto flex-1 flex justify-center bg-black/5">
                            <img src={certPreviewUrl} alt="Certificate Preview" className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-xl" />
                        </div>
                        <div className="px-8 py-5 border-t border-[var(--border)] flex justify-end bg-[var(--surface)] gap-4">
                            <button
                                onClick={() => { setCertPreviewUrl(null); setCertPreviewData(null); }}
                                className="btn btn-outline"
                            >
                                Close
                            </button>
                            <button
                                onClick={downloadAsPdf}
                                disabled={generatingPdf}
                                className="btn btn-primary flex items-center gap-2"
                            >
                                {generatingPdf ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                                {generatingPdf ? 'Generating PDF...' : 'Download as PDF'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
