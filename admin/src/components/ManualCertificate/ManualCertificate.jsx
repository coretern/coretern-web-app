import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import './ManualCertificate.css';
import certTemplate from '../../assets/CoreTern_Manual_Certificate.png';

const ManualCertificate = ({ id, recipientName, certType, description, qrData }) => {
    return (
        <div id="manual-certificate-print" className="manual-certificate-container">
            <img src={certTemplate} className="cert-template-bg" alt="Manual Certificate" />

            <div className="cert-content-overlay">
                <div className="manual-cert-type">
                    {certType || 'OF INTERNSHIP'}
                </div>

                <h2 className="cert-recipient-name">{recipientName || 'Recipient Name'}</h2>

                <main className="cert-main">
                    {/* Render raw description if it contains HTML or just plain text */}
                    <div className="cert-dynamic-text" dangerouslySetInnerHTML={{ __html: description }} />
                </main>

                <footer className="cert-footer">
                    <div className="cert-right-bottom">
                        <div className="cert-qr-container">
                            <QRCodeSVG
                                value={qrData || id || 'https://coretern.com'}
                                size={80}
                                level="H"
                                includeMargin={true}
                                className="cert-qr-canvas"
                            />
                            <div className="cert-id-display">ID: {id}</div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default ManualCertificate;
