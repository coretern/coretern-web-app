import React from 'react';
import SEO from '../../Components/SEO';
import './Terms.css';

const Terms = () => {
    return (
        <div className="legal-page container">
            <SEO title="Terms and Conditions" />
            <div className="legal-header">
                <h1 className="outfit gradient-text text-center">Terms of Service</h1>
                <p className="text-center text-muted">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
            <div className="legal-content glass">
                <h2>1. Acceptance of Terms</h2>
                <p>By accessing and using CoreTern Platforms, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>

                <h2>2. User Responsibilities</h2>
                <p>Users must provide accurate information during registration and maintain the security of their account credentials.</p>

                <h2>3. Intellectual Property</h2>
                <p>All content, materials, and designs on the CoreTern platform are the property of CoreTern and protected by appropriate copyright laws.</p>

                <h2>4. Modifications</h2>
                <p>We reserve the right to modify these terms at any time. Continued use of the platform constitutes acceptance of updated terms.</p>
            </div>
        </div>
    );
};

export default Terms;
