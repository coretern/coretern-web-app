'use client';

import { Terminal, CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/landing/Hero';
import InternshipSection from '@/components/landing/InternshipSection';
import ClientReviews from '@/components/landing/ClientReviews';

export default function LandingPageClient() {
    const benefits = [
        'Practical Industry Experience',
        'Mentorship from Senior Developers',
        'Recognized Certifications',
        'Placement Assistance',
        'Project-Based Learning'
    ];

    return (
        <div>
            <Navbar />
            <Hero />
            <InternshipSection />
            <ClientReviews />

            {/* Benefits Section */}
            <section className="benefits-section">
                <div className="container benefits-container">
                    <div className="benefits-content">
                        <h2 className="outfit" style={{
                            fontSize: 'clamp(1.75rem, 4vw, 3rem)',
                            fontWeight: 800,
                            marginBottom: '1rem',
                            lineHeight: 1.1,
                        }}>
                            Why Students Choose <span className="text-[var(--color-primary)]">Our Programs</span>
                        </h2>
                        <div className="benefits-list">
                            {benefits.map((item, i) => (
                                <div key={i} className="benefit-item">
                                    <CheckCircle2 className="text-[var(--color-primary)]" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="benefits-visual glass">
                        <div style={{ position: 'absolute', inset: '-1px', background: 'var(--grad-primary)', borderRadius: 'inherit', zIndex: -1, opacity: 0.3 }} />
                        <div className="terminal-mock">
                            <Terminal size={120} className="terminal-icon" />
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
