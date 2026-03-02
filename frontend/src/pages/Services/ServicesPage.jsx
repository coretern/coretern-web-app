import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import Services from '../../Components/Services/Services';
import PageTransition from '../../Components/PageTransition';
import './ServicesPage.css';

const ServicesPage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <PageTransition>
            <div className="services-page">
                <Navbar />

                <header className="services-hero">
                    <div className="container hero-content">
                        <h1 className="outfit">Our <span className="text-primary">Expertise</span></h1>
                        <p className="hero-subtitle">
                            We provide industry-leading digital solutions tailored to your business needs.
                            Explore our core domains and discover how we can help you scale.
                        </p>
                    </div>
                    <div className="hero-glow"></div>
                </header>

                <Services />

                <section className="services-cta">
                    <div className="container">
                        <div className="cta-card glass">
                            <h2 className="outfit">Have a specific requirement?</h2>
                            <p>Our team is ready to discuss your custom project needs.</p>
                            <button
                                onClick={() => navigate('/contact')}
                                className="btn btn-primary lg"
                            >
                                Get in Touch
                            </button>
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </PageTransition>
    );
};

export default ServicesPage;
