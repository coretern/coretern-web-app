import React from 'react';
import SEO from '../../Components/SEO';
import '../Terms/Terms.css'; // Reusing the same CSS to maintain consistency

const Privacy = () => {
    return (
        <div className="legal-page container">
            <SEO
                title="Privacy Policy"
                description="Our privacy policy explains how we collect, use, and protect your personal information at CoreTern Platforms."
                url="/privacy"
            />
            <div className="legal-header">
                <h1 className="outfit gradient-text text-center">Privacy Policy</h1>
                <p className="text-center text-muted">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
            <div className="legal-content glass">
                <h2>1. Information We Collect</h2>
                <p>We collect personal information that you provide to us voluntarily, such as your name, email address, phone number, and educational background, specifically for processing Internship enrollments and account creations.</p>

                <h2>2. How We Use Your Information</h2>
                <p>The information we collect is used to provide, maintain, and improve our services, communicate with you, process your requests and transactions, and ensure platform security.</p>

                <h2>3. Data Sharing</h2>
                <p>We do not sell or rent your personal data to third parties. Information may only be shared with trusted service providers who assist us in operating our platform, subject to strict confidentiality agreements.</p>

                <h2>4. Data Security</h2>
                <p>We implement a variety of security measures to maintain the safety of your personal information when you enter, submit, or access your personal information.</p>

                <h2>5. Cookies and Tracking</h2>
                <p>We use cookies and similar tracking technologies to track the activity on our platform and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>
            </div>
        </div>
    );
};

export default Privacy;
