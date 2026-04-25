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
            name: 'Github', 
            href: '#', 
            svg: <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        }
    ];

    return (
        <footer className="bg-[var(--surface)] pt-24 pb-8 border-t border-[var(--border)] relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-[image:var(--grad-primary)] opacity-30" />
            <div className="container grid grid-cols-[1.5fr_1fr_1fr] gap-12 mb-16 max-md:grid-cols-1 max-md:gap-12 max-lg:grid-cols-2">
                <div className="flex flex-col gap-6">
                    <h3 className="text-[2rem] font-extrabold font-[family-name:var(--font-outfit)] gradient-text tracking-tight">CoreTern</h3>
                    <p className="text-[var(--text-muted)] text-[1rem] leading-[1.7] max-w-[360px]">
                        Empowering the next generation of tech leaders through world-class hands-on internship programs and professional mentorship.
                    </p>
                    <div className="flex gap-3">
                        {socialLinks.map((item, i) => (
                            <a key={i} href={item.href} className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] transition-all duration-300 hover:bg-[image:var(--grad-primary)] hover:text-white hover:-translate-y-1 hover:border-transparent hover:shadow-[0_8px_20px_rgba(99,102,241,0.3)]">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    {item.svg}
                                </svg>
                            </a>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="text-[1.1rem] font-bold mb-6 text-[var(--text)] font-[family-name:var(--font-outfit)]">Quick Links</h4>
                    <ul className="flex flex-col gap-3">
                        {[
                            { name: 'Home', path: '/' },
                            { name: 'Summer Internship', path: '/internships' },
                            { name: 'Verify Certificate', path: '/verify' },
                            { name: 'Contact Us', path: '/contact' },
                        ].map((link) => (
                            <li key={link.name}>
                                <Link href={link.path} className="text-[var(--text-muted)] text-[0.95rem] transition-colors duration-150 hover:text-[var(--color-primary)] hover:pl-[5px]">
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="text-[1.1rem] font-bold mb-6 text-[var(--text)] font-[family-name:var(--font-outfit)]">Contact Us</h4>
                    <ul className="flex flex-col gap-5">
                        {[
                            { icon: Mail, text: 'coreterndev@gmail.com' },
                            { icon: Phone, text: '+91 98765 43210' },
                            { icon: MapPin, text: 'Innovation Hub, Bangalore' },
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-4 text-[var(--text-muted)] text-[0.95rem]">
                                <item.icon size={18} className="text-[var(--color-primary)] mt-[0.2rem]" />
                                <span>{item.text}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="container pt-8 border-t border-[var(--border)] flex justify-between items-center text-[var(--text-muted)] text-[0.85rem] max-md:flex-col max-md:gap-4 max-md:text-center">
                <p>© {new Date().getFullYear()} CoreTern Platforms. Designed for Future Innovators.</p>
                <div className="flex gap-6 max-md:justify-center max-md:flex-wrap max-md:gap-4">
                    <Link href="/terms" className="text-[var(--text-muted)] transition-colors duration-150 hover:text-[var(--color-primary)]">Terms</Link>
                    <Link href="/privacy" className="text-[var(--text-muted)] transition-colors duration-150 hover:text-[var(--color-primary)]">Privacy</Link>
                    <Link href="/refund-policy" className="text-[var(--text-muted)] transition-colors duration-150 hover:text-[var(--color-primary)]">Refund Policy</Link>
                    <Link href="/about" className="text-[var(--text-muted)] transition-colors duration-150 hover:text-[var(--color-primary)]">About Us</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
