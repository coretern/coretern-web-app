import React from 'react';
import '../Terms/Terms.css';

const RefundPolicy = () => {
    return (
        <div className="legal-page container">
            <div className="legal-header">
                <h1 className="outfit gradient-text text-center">Refund Policy</h1>
                <p className="text-center text-muted">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
            <div className="legal-content glass">
                <h2>1. Overview</h2>
                <p>At TechStart, our goal is to ensure high satisfaction for all users enrolling in our programs. This policy outlines our refund processes and eligibility.</p>

                <h2>2. Eligibility for Refunds</h2>
                <p>A full refund will only be considered if a request is submitted within 7 days of the transaction date, provided no coursework or internship material has been accessed or downloaded.</p>

                <h2>3. Non-Refundable Items</h2>
                <p>Registration fees, processing fees, and completed internship phases or project deliverables are strictly non-refundable under any circumstance.</p>

                <h2>4. Process for Requesting a Refund</h2>
                <p>To initiate a refund, please contact our support team at info@techstart.com with your enrollment details and reason for the request. We aim to process valid refunds within 7-10 business days.</p>
            </div>
        </div>
    );
};

export default RefundPolicy;
