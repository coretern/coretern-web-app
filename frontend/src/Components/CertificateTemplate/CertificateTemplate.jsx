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
            return weeks > 0 ? `${weeks}-week` : `${diffDays}-day`;
        }
        const duration = internship?.duration || '4 weeks';
        return duration.toLowerCase().includes('week') ? duration.replace(/weeks?/i, '-week') : duration;
    };

    const recipientName = enrollment?.fullName || user?.name || 'Valued Learner';
    const courseName = enrollment?.course || 'Technology Program';
    const branchName = enrollment?.branch ? ` (${enrollment.branch})` : '';
    const collegeNameRaw = enrollment?.collegeName || '';
    const collegeName = collegeNameRaw.split(' ').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
    const regNo = enrollment?.collegeRegNumber ? ` (Roll No. ${enrollment.collegeRegNumber})` : '';

    return (
        <div id="certificate-print" className="certificate-container template-mode">
            <img src={certTemplate} className="cert-template-bg" alt="Certificate Background" />

            <div className="cert-content-overlay">
                <main className="cert-main">
                    <h2 className="cert-recipient-name outfit">{recipientName}</h2>
                    <p className="cert-dynamic-text">
                        This document certifies the successful completion of an internship in
                        <strong> {internship?.title} </strong> from
                        <strong> {formatDate(enrollment?.startDate)} </strong> to
                        <strong> {formatDate(enrollment?.endDate)}</strong>.
                        As a student of <strong>{courseName}{branchName}</strong> at
                        <strong> {collegeName || 'their institution'}</strong>{regNo},
                        they have demonstrated commendable diligence and proficiency in all assigned
                        tasks during their <strong> {getDurationWeeks()} </strong> tenure.
                    </p>
                </main>

                <footer className="cert-footer">
                    <div className="cert-left-bottom">
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
