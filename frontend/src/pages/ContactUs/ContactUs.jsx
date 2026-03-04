import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MessageCircle, MapPin, Send, Loader2, Instagram, Linkedin, Twitter, Facebook } from 'lucide-react';
import axios from 'axios';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import PageTransition from '../../Components/PageTransition';
import SEO from '../../Components/SEO';
import toast from 'react-hot-toast';
import './ContactUs.css';

const ContactUs = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/tickets`, formData);
            if (data.success) {
                toast.success(`Ticket Raised! ID: ${data.data.ticketId}`, { duration: 6000 });
                setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
            }
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to raise ticket');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageTransition>
            <SEO title="Contact Us" description="Get in touch with the TechStart team. Connect with us for internship inquiries, B2B technical services, or general support." url="/contact" />
            <div className="contact-page">
                <Navbar />

                <section className="contact-hero">
                    <div className="container">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="outfit display-title text-center"
                        >
                            Get in <span className="text-gradient">Touch</span>
                        </motion.h1>
                        <p className="subtitle text-center mx-auto">
                            Have questions about our internships or facing issues with your account?
                            Our team is here to help you 24/7.
                        </p>
                    </div>
                </section>

                <main className="contact-container container">
                    <div className="contact-grid">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="contact-info"
                        >
                            <div className="card glass info-card">
                                <h2 className="outfit">Contact Information</h2>
                                <p className="text-text-muted mb-8">Feel free to reach out via any of these channels.</p>

                                <div className="info-items">
                                    <div className="info-item">
                                        <div className="icon-box"><Mail size={24} /></div>
                                        <div>
                                            <h3>Email Us</h3>
                                            <p>support@techstart.com</p>
                                        </div>
                                    </div>
                                    <div className="info-item">
                                        <div className="icon-box whatsapp-icon"><MessageCircle size={24} /></div>
                                        <div>
                                            <h3>WhatsApp Us</h3>
                                            <p>+91 12345 67890</p>
                                        </div>
                                    </div>
                                    <div className="info-item">
                                        <div className="icon-box"><MapPin size={24} /></div>
                                        <div>
                                            <h3>Location</h3>
                                            <p>New Delhi, India</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="social-connect">
                                    <h4 className="outfit mb-4">Connect with us</h4>
                                    <div className="flex gap-4">
                                        <motion.a
                                            whileHover={{ y: -5 }}
                                            href="#" className="social-link instagram"
                                        >
                                            <Instagram size={20} />
                                        </motion.a>
                                        <motion.a
                                            whileHover={{ y: -5 }}
                                            href="#" className="social-link linkedin"
                                        >
                                            <Linkedin size={20} />
                                        </motion.a>
                                        <motion.a
                                            whileHover={{ y: -5 }}
                                            href="#" className="social-link twitter"
                                        >
                                            <Twitter size={20} />
                                        </motion.a>
                                        <motion.a
                                            whileHover={{ y: -5 }}
                                            href="#" className="social-link facebook"
                                        >
                                            <Facebook size={20} />
                                        </motion.a>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="contact-form-wrapper"
                        >
                            <div className="card glass">
                                <form onSubmit={handleSubmit} className="contact-form">
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Full Name</label>
                                            <input
                                                type="text"
                                                placeholder="John Doe"
                                                required
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Phone Number</label>
                                            <input
                                                type="tel"
                                                placeholder="+91 XXXXX XXXXX"
                                                required
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Email Address</label>
                                        <input
                                            type="email"
                                            placeholder="john@example.com"
                                            required
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Subject</label>
                                        <input
                                            type="text"
                                            placeholder="e.g., Website, App Development"
                                            required
                                            value={formData.subject}
                                            onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Your Message</label>
                                        <textarea
                                            rows="5"
                                            placeholder="Write your message here..."
                                            required
                                            value={formData.message}
                                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                                        ></textarea>
                                    </div>
                                    <button disabled={loading} className="btn btn-primary w-full py-4 flex items-center justify-center gap-2">
                                        {loading ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Send Message</>}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </main>

                <Footer />
            </div>
        </PageTransition>
    );
};

export default ContactUs;
