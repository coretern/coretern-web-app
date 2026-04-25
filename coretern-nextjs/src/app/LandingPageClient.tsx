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
            <section className="relative bg-[var(--surface)] py-[var(--space-xl)] overflow-hidden">
                <div className="container grid grid-cols-2 gap-24 items-center max-[900px]:grid-cols-1 max-[900px]:gap-16 max-[900px]:text-center">
                    <div>
                        <h2 className="text-[clamp(2.5rem,5vw,3.5rem)] font-extrabold mb-4 tracking-[-0.02em] font-[family-name:var(--font-outfit)]">
                            Why Students Choose <span className="text-[var(--color-primary)]">Our Programs</span>
                        </h2>
                        <div className="mt-12 flex flex-col gap-6 max-[900px]:items-center">
                            {benefits.map((item, i) => (
                                <div key={i} className="flex items-start gap-5 text-[1.15rem] font-semibold text-[var(--text)] max-[900px]:w-full max-[900px]:max-w-[320px] max-[900px]:mx-auto max-[900px]:justify-start max-[900px]:text-left">
                                    <CheckCircle2 className="text-[var(--color-primary)] shrink-0 w-6 h-6 mt-[0.2rem] p-[2px] bg-[rgba(99,102,241,0.1)] rounded-full" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="h-[450px] rounded-[var(--radius-xl)] flex flex-col relative glass overflow-hidden max-[900px]:h-[350px]">
                        <div className="absolute inset-[-1px] bg-[image:var(--grad-primary)] rounded-[inherit] -z-[1] opacity-20" />
                        
                        {/* Terminal Header */}
                        <div className="flex items-center gap-2 px-6 py-4 border-b border-[var(--border)] bg-[rgba(255,255,255,0.03)]">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                            </div>
                            <div className="mx-auto text-[0.75rem] font-mono text-[var(--text-muted)] opacity-50">coretern-internship.js</div>
                        </div>

                        {/* Terminal Body */}
                        <div className="p-8 font-mono text-[0.9rem] leading-relaxed overflow-hidden grow flex flex-col justify-center">
                            <div className="flex gap-3 mb-2">
                                <span className="text-[var(--color-primary)]">const</span>
                                <span className="text-[var(--color-secondary)]">Internship</span>
                                <span className="text-white">=</span>
                                <span className="text-[var(--color-primary)]">async</span>
                                <span className="text-white">()</span>
                                <span className="text-[var(--color-primary)]">=&gt;</span>
                                <span className="text-white">{`{`}</span>
                            </div>
                            <div className="pl-6 flex gap-3 mb-2">
                                <span className="text-[var(--color-primary)]">await</span>
                                <span className="text-[var(--color-secondary)]">build</span>
                                <span className="text-white">(</span>
                                <span className="text-orange-400">'RealWorldProjects'</span>
                                <span className="text-white">);</span>
                            </div>
                            <div className="pl-6 flex gap-3 mb-2">
                                <span className="text-[var(--color-primary)]">return</span>
                                <span className="text-[var(--color-success)]">CareerSuccess</span>
                                <span className="text-white">;</span>
                            </div>
                            <div className="text-white mb-6">{`}`}</div>
                            
                            <div className="flex items-center gap-2 text-[var(--color-primary)] animate-pulse">
                                <span className="text-xl">$</span>
                                <span className="w-2.5 h-5 bg-[var(--color-primary)]" />
                            </div>

                            <Terminal size={140} className="absolute bottom-[-20px] right-[-20px] text-[var(--color-primary)] opacity-[0.07] rotate-[-15deg] pointer-events-none" />
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
