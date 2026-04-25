'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    const socialLinks = [
        { 
            name: 'Instagram', 
            href: '#', 
            svg: (
                <>
                    <path d="M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 11.3701C16.1234 12.2023 15.9813 13.0523 15.5938 13.7991C15.2063 14.5459 14.5932 15.1515 13.8417 15.5297C13.0901 15.908 12.2385 16.0397 11.4078 15.9059C10.5771 15.7721 9.79792 15.3793 9.1798 14.7822C8.56168 14.1851 8.13471 13.4116 7.9575 12.5694C7.7803 11.7271 7.86178 10.854 8.19098 10.0706C8.52018 9.28718 9.08182 8.63212 9.79819 8.19502C10.5146 7.75792 11.3523 7.56012 12.193 7.62832C13.055 7.69722 13.88 8.04162 14.53 8.60472C15.18 9.16782 15.61 9.91392 15.75 10.7201C15.89 11.5263 15.73 12.3444 15.3 13.0301" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17.5 6.5H17.51" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </>
            )
        },
        { 
            name: 'Twitter', 
            href: '#', 
            svg: <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        },
        { 
            name: 'Linkedin', 
            href: '#', 
            svg: (
                <>
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <rect x="2" y="9" width="4" height="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </>
            )
        },
        { 
            name: 'Facebook', 
            href: '#', 
            svg: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        }
    ];

    return (
        <footer style={{
            background: 'var(--surface)',
            padding: '6rem 0 2rem',
            borderTop: '1px solid var(--border)',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Top gradient line */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100%',
                height: '1px',
                background: 'var(--grad-primary)',
                opacity: 0.3,
            }} />

            {/* Footer Grid - uses container for width, separate div for grid */}
            <div className="container">
                <div className="footer-grid">
                    {/* Brand */}
                    <div>
                        <h3 className="outfit gradient-text" style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem' }}>
                            CoreTern
                        </h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '400px' }}>
                            Empowering the next generation of tech leaders through world-class hands-on internship programs and professional mentorship.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {socialLinks.map((item, i) => (
                                <a 
                                    key={i} 
                                    href={item.href} 
                                    className="social-icon"
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: 'var(--radius-sm)',
                                        background: 'var(--surface-1)',
                                        border: '1px solid var(--border)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--text-muted)',
                                        transition: 'all 0.25s ease',
                                    }}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                        {item.svg}
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="outfit" style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text)' }}>Quick Links</h4>
                        <ul style={{ display: 'flex', flexDirection: 'column' }}>
                            {[
                                { name: 'Home', path: '/' },
                                { name: 'Summer Internship', path: '/internships' },
                                { name: 'Verify Certificate', path: '/verify' },
                                { name: 'Contact Us', path: '/contact' },
                            ].map((link) => (
                                <li key={link.name} style={{ marginBottom: '0.75rem' }}>
                                    <Link href={link.path} className="footer-link-item" style={{ color: 'var(--text-muted)', fontSize: '0.95rem', transition: 'color 0.15s ease' }}>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="outfit" style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text)' }}>Contact Us</h4>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {[
                                { icon: Mail, text: 'coreterndev@gmail.com' },
                                { icon: Phone, text: '+91 98765 43210' },
                                { icon: MapPin, text: 'Innovation Hub, Bangalore' },
                            ].map((item, i) => (
                                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                                    <item.icon size={18} style={{ color: 'var(--color-primary)', marginTop: '0.2rem', flexShrink: 0 }} />
                                    <span>{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="container">
                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} CoreTern Platforms. Designed for Future Innovators.</p>
                    <div className="footer-legal-links">
                        <Link href="/terms">Terms</Link>
                        <Link href="/privacy">Privacy</Link>
                        <Link href="/refund-policy">Refund Policy</Link>
                        <Link href="/about">About Us</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
