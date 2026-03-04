import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Twitter, Linkedin, Facebook } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-grid">
                <div className="footer-brand">
                    <h3 className="outfit gradient-text">TechStart</h3>
                    <p>
                        Empowering the next generation of tech leaders through world-class development services and hands-on internship programs.
                    </p>
                    <div className="social-links">
                        <a href="#" className="social-icon"><Instagram size={18} /></a>
                        <a href="#" className="social-icon"><Twitter size={18} /></a>
                        <a href="#" className="social-icon"><Linkedin size={18} /></a>
                        <a href="#" className="social-icon"><Facebook size={18} /></a>
                    </div>
                </div>

                <div className="footer-section">
                    <h4 className="outfit">Quick Links</h4>
                    <ul className="footer-links">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/internships">Summer Internship</Link></li>
                        <li><Link to="/services">Our Services</Link></li>
                        <li><Link to="/verify">Verify Certificate</Link></li>
                        <li><Link to="/contact">Contact Us</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4 className="outfit">Contact Us</h4>
                    <ul className="contact-list">
                        <li className="contact-item">
                            <Mail size={18} />
                            <span>info@techstart.com</span>
                        </li>
                        <li className="contact-item">
                            <Phone size={18} />
                            <span>+91 98765 43210</span>
                        </li>
                        <li className="contact-item">
                            <MapPin size={18} />
                            <span>Innovation Hub, Bangalore</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="container footer-bottom">
                <p>© {new Date().getFullYear()} TechStart Platforms. Designed for Future Innovators.</p>
                <div className="footer-legal-links">
                    <Link to="/terms">Terms</Link>
                    <Link to="/privacy">Privacy</Link>
                    <Link to="/refund-policy">Refund Policy</Link>
                    <Link to="/about">About Us</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
