'use client';

import { Terminal, CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/landing/Hero';
import Services from '@/components/landing/Services';
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
            <Services />
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
                    <div className="h-[450px] rounded-[var(--radius-xl)] flex items-center justify-center relative glass max-[900px]:h-[300px]">
                        <div className="absolute inset-[-1px] bg-[image:var(--grad-primary)] rounded-[inherit] -z-[1] opacity-30" />
                        <div className="w-full h-full flex items-center justify-center bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.1)_0%,transparent_70%)]">
                            <Terminal size={120} className="text-[var(--color-primary)] drop-shadow-[0_0_30px_rgba(99,102,241,0.4)] opacity-60" />
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
