import React from 'react';
import { ShieldCheck, Award } from 'lucide-react';
import './CertificateTemplate.css';

const CertificateTemplate = ({ id, user, internship, enrollment, date, qrCode }) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Calculate duration in weeks if possible
    const getDurationWeeks = () => {
        if (enrollment?.startDate && enrollment?.endDate) {
            const start = new Date(enrollment.startDate);
            const end = new Date(enrollment.endDate);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const weeks = Math.round(diffDays / 7);
            return weeks > 0 ? `${weeks} weeks` : `${diffDays} days`;
        }
        return internship?.duration || '4 weeks';
    };

    const recipientName = enrollment?.fullName || user?.name || 'Valued Learner';
    const courseName = enrollment?.course || 'Technology Program';
    const collegeName = enrollment?.collegeName ? ` of ${enrollment.collegeName}` : '';
    const regNo = enrollment?.collegeRegNumber ? `, bearing Roll no. ${enrollment.collegeRegNumber}` : '';

    return (
        <div id="certificate-print" className="certificate-container">
            <div className="cert-bg-overlay"></div>

            <header className="cert-header">
                <div className="cert-logo">
                    <div className="cert-logo-icon">
                        <ShieldCheck size={32} />
                    </div>
                    <span>TechStart</span>
                </div>
                <div className="cert-id-box">
                    <div className="cert-id-label">Certificate ID</div>
                    <div className="cert-id-value">{id}</div>
                </div>
            </header>

            <main className="cert-main">
                <Award size={80} className="cert-medal" />
                <h1 className="cert-title outfit">Certificate of Excellence</h1>
                <p className="cert-intro">This is to certify that</p>
                <h2 className="cert-recipient-name outfit">{recipientName}</h2>
                <div className="cert-underline"></div>

                <p className="cert-text">
                    student of <strong>{courseName}</strong>{regNo}{collegeName}.
                    Has successfully completed <strong>{getDurationWeeks()}</strong> ({formatDate(enrollment?.startDate)} to {formatDate(enrollment?.endDate)}) internship on
                    <strong> {internship?.title}</strong>.
                </p>

                <p className="cert-subtext">
                    During their internship, we found them active and competent in executing all assigned tasks satisfactorily.
                    We wish them great success in all their future endeavors.
                </p>
            </main>

            <footer className="cert-footer">
                <div className="cert-signature-section">
                    <div className="signature-line"></div>
                    <h4 className="outfit">TechStart Platforms</h4>
                    <p className="signature-title">Director of Innovation</p>
                    <div className="cert-date">
                        Issued on: {new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </div>
                </div>

                <div className="cert-qr-box">
                    <div className="qr-wrapper">
                        {qrCode ? (
                            <img src={qrCode} alt="QR Code" className="cert-qr" />
                        ) : (
                            <div className="qr-placeholder">QR Code</div>
                        )}
                    </div>
                    <span className="cert-id-label">Scan to Verify</span>
                </div>
            </footer>
        </div>
    );
};

export default CertificateTemplate;
