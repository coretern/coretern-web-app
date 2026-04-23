'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, AtSign, Send, Link2, Globe2 } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[var(--surface)] pt-24 pb-8 border-t border-[var(--border)] relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-[image:var(--grad-primary)] opacity-30" />
            <div className="container grid grid-cols-[2fr_1fr_1fr] gap-16 mb-16 max-md:grid-cols-1 max-md:gap-12 max-lg:grid-cols-[1.5fr_1fr]">
                <div>
                    <h3 className="text-[1.75rem] font-extrabold mb-6 font-[family-name:var(--font-outfit)] gradient-text">CoreTern</h3>
                    <p className="text-[var(--text-muted)] text-base leading-[1.7] mb-8 max-w-[400px]">
                        Empowering the next generation of tech leaders through world-class development services and hands-on internship programs.
                    </p>
                    <div className="flex gap-4">
                        {[AtSign, Send, Link2, Globe2].map((Icon, i) => (
                            <a key={i} href="#" className="w-10 h-10 rounded-[var(--radius-sm)] bg-[var(--surface-1)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] transition-all duration-[0.25s] hover:bg-[image:var(--grad-primary)] hover:text-white hover:-translate-y-[5px] hover:border-transparent">
                                <Icon size={18} />
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
                            { name: 'Our Services', path: '/services' },
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
