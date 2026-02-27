import React from 'react';
import { Terminal, CheckCircle2 } from 'lucide-react';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import Hero from '../../Components/Hero/Hero';
import Services from '../../Components/Services/Services';
import InternshipSection from '../../Components/InternshipSection/InternshipSection';
import ClientReviews from '../../Components/Reviews/ClientReviews';
import PageTransition from '../../Components/PageTransition';
import './LandingPage.css';

const LandingPage = () => {
    const benefits = [
        'Practical Industry Experience',
        'Mentorship from Senior Developers',
        'Recognized Certifications',
        'Placement Assistance',
        'Project-Based Learning'
    ];

    return (
        <PageTransition>
            <div className="landing-page">
                <Navbar />

                <Hero />

                <Services />

                <InternshipSection />

                <ClientReviews />

                <section className="benefits-section">
                    <div className="container benefits-container">
                        <div className="benefits-content">
                            <h2 className="section-title outfit">
                                Why Students Choose <span className="text-primary">Our Programs</span>
                            </h2>
                            <div className="benefits-list">
                                {benefits.map((item, i) => (
                                    <div key={i} className="benefit-item">
                                        <CheckCircle2 className="text-primary" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="benefits-visual glass">
                            <div className="terminal-mock">
                                <Terminal size={120} className="terminal-icon" />
                            </div>
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </PageTransition>
    );
};

export default LandingPage;
