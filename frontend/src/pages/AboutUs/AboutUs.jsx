import React from 'react';
import SEO from '../../Components/SEO';
import '../Terms/Terms.css';

const AboutUs = () => {
    return (
        <div className="legal-page container">
            <SEO title="About Us" description="Learn more about TechStart's mission to bridge the gap between academic learning and industry demands." url="/about" />
            <div className="legal-header">
                <h1 className="outfit gradient-text text-center">About Us</h1>
                <p className="text-center text-muted">Empowering the next generation of tech leaders.</p>
            </div>
            <div className="legal-content glass">
                <h2>Our Mission</h2>
                <p>TechStart was founded with the mission to bridge the gap between academic learning and industry demands. We aim to equip students with practical, hands-on experience by working on real-world tech projects.</p>

                <h2>What We Do</h2>
                <p>We provide exclusive summer internship programs and top-notch development services designed for future innovators. By connecting young talent with professional frameworks, we accelerate growth.</p>

                <h2>Our Core Values</h2>
                <p>We believe in continuous learning, relentless innovation, and uncompromising quality. From our instructors to our developers, everyone at TechStart is dedicated to these principles.</p>

                <h2>Contact Information</h2>
                <p>If you'd like to get in touch or have any inquiries, feel free to visit our contact page or email us at info@techstart.com. We are located at the Innovation Hub in Bangalore.</p>
            </div>
        </div>
    );
};

export default AboutUs;
