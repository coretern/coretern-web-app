import React from 'react';
import { ShieldCheck, Award } from 'lucide-react';
import './CertificateTemplate.css';

const CertificateTemplate = ({ id, user, internship, date, qrCode }) => {
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
                <h2 className="cert-recipient-name outfit">{user?.name}</h2>
                <div className="cert-underline"></div>

                <p className="cert-text">
                    has successfully completed the <strong>{internship?.title}</strong> program
                    spanning <strong>{internship?.duration}</strong>.
                    They have demonstrated exceptional proficiency in all aspects of the curriculum and practical implementations.
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
