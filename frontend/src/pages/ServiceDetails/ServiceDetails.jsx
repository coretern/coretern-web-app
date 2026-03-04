import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import PageTransition from '../../Components/PageTransition';
import SEO from '../../Components/SEO';
import { services, getDetailedData, commonWhyChoose } from '../../data/servicesData.jsx';
import './ServiceDetails.css';

const ServiceDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const service = services.find(s => s.id === id);
    const data = getDetailedData(id);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!service || !data) {
        return (
            <div className="error-page">
                <h2>Service Not Found</h2>
                <button onClick={() => navigate('/')} className="btn btn-primary">Go Back Home</button>
            </div>
        );
    }

    return (
        <PageTransition>
            <SEO
                title={`${service.title} Services`}
                description={service.desc}
                url={`/services/${id}`}
            />
            <div className="service-details-page">
                <Navbar />

                <header className="service-hero">
                    <div className="container">
                        <button className="back-btn" onClick={() => navigate(-1)}>
                            <ArrowLeft size={20} /> Back
                        </button>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="service-hero-content"
                        >
                            <span className="service-badge">Our Solutions</span>
                            <h1 className="outfit">{service.title}</h1>
                            <p className="service-intro">{service.desc}</p>
                        </motion.div>
                    </div>
                    <div className="hero-bg-accent"></div>
                </header>

                <section className="service-main">
                    <div className="container">
                        <div className="features-grid">
                            {data.features.map((feature, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="feature-card glass"
                                >
                                    <div className="feature-icon-wrapper">
                                        {feature.icon}
                                    </div>
                                    <div className="feature-info">
                                        <h3 className="outfit">{feature.title}</h3>
                                        <p>{feature.desc}</p>
                                        <div className="feature-footer">
                                            <span className="feature-category">{feature.cat}</span>
                                            {feature.trend && <span className="trend-tag">Future Trend</span>}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="why-us-section">
                    <div className="container">
                        <div className="why-us-grid">
                            <div className="why-us-content">
                                <h2 className="section-title outfit">Why Choose Our <br /><span className="text-primary">Services</span></h2>
                                <p className="text-text-muted">We combine technical excellence with business strategy to deliver results that matter.</p>

                                <div className="benefits-checklist">
                                    {['9+ Years Industry Experience', '100+ Successful Projects', 'Global Client Base', '24/7 Premium Support'].map((item, i) => (
                                        <div key={i} className="benefit-item">
                                            <CheckCircle2 size={20} className="text-primary" />
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="why-us-cards">
                                {commonWhyChoose.slice(0, 4).map((item, idx) => (
                                    <div key={idx} className="why-card secondary-card glass" data-index={`0${idx + 1}`}>
                                        <div className="why-card-icon">{item.icon}</div>
                                        <h4 className="outfit">{item.title}</h4>
                                        <p>{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="cta-section">
                    <div className="container">
                        <div className="cta-box glass">
                            <h2 className="outfit">Ready to start your project?</h2>
                            <p>Let's build something extraordinary together.</p>
                            <button onClick={() => navigate('/contact')} className="btn btn-primary">Contact Us Now</button>
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </PageTransition>
    );
};

export default ServiceDetails;
