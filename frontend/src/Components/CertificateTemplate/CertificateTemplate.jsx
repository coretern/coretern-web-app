import React from 'react';
import { ShieldCheck, Award } from 'lucide-react';
import './CertificateTemplate.css';
import certTemplate from '../../assets/CoreTern_internship_Certificate.png';

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
    const branchName = enrollment?.branch ? ` (${enrollment.branch})` : '';
    const collegeName = enrollment?.collegeName ? ` of ${enrollment.collegeName}` : '';
    const regNo = enrollment?.collegeRegNumber ? `, bearing Roll no. ${enrollment.collegeRegNumber}` : '';

    return (
        <div id="certificate-print" className="certificate-container template-mode">
            <img src={certTemplate} className="cert-template-bg" alt="Certificate Background" />

            <div className="cert-content-overlay">
                <header className="cert-header">
                    <div className="cert-id-tag">
                        <span>CERTIFICATE ID: {id}</span>
                    </div>
                </header>

                <main className="cert-main">
                    <h2 className="cert-recipient-name outfit">{recipientName}</h2>
                    <p className="cert-dynamic-text">
                        Student of <strong>{courseName}{branchName}</strong>{regNo}{collegeName}.
                        Has successfully completed <strong>{getDurationWeeks()}</strong> ({formatDate(enrollment?.startDate)} to {formatDate(enrollment?.endDate)}) internship on
                        <strong> {internship?.title}</strong>.
                    </p>
                </main>

                <footer className="cert-footer">
                    <div className="cert-left-bottom">
                        <div className="cert-issue-date">
                            Issued on: {new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </div>
                    </div>

                    <div className="cert-right-bottom">
                        <div className="cert-qr-container">
                            {qrCode ? (
                                <img src={qrCode} alt="Verification QR" className="cert-qr-img" />
                            ) : (
                                <div className="qr-fallback">QR Code</div>
                            )}
                            <div className="cert-id-display">ID: {id}</div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default CertificateTemplate;
