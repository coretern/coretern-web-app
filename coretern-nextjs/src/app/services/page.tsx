'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { services, getDetailedData, commonWhyChoose } from '@/data/servicesData';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function ServicesPage() {
    return (
        <div>
            <Navbar />
            <section className="min-h-screen pt-28 pb-20">
                <div className="container">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                        <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-extrabold mb-3 font-[family-name:var(--font-outfit)]">
                            Our <span className="gradient-text">Services</span>
                        </h1>
                        <p className="text-[var(--text-muted)] text-base max-w-[500px] mx-auto">
                            End-to-end technology solutions for businesses of all sizes
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-8 mb-20 max-md:grid-cols-1">
                        {services.map((service, index) => {
                            const Icon = service.icon;
                            return (
                                <motion.div key={service.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }} viewport={{ once: true }}>
                                    <Link href={`/services/${service.id}`}
                                        className="block glass p-8 rounded-[var(--radius-xl)] border border-[var(--border)] transition-all duration-300 hover:-translate-y-2 hover:border-[rgba(99,102,241,0.3)] hover:shadow-[var(--shadow-primary)] group h-full">
                                        <div className="w-14 h-14 bg-[rgba(99,102,241,0.1)] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[image:var(--grad-primary)] transition-all duration-300">
                                            <Icon size={26} className="text-[var(--color-primary)] group-hover:text-white transition-colors" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-3 font-[family-name:var(--font-outfit)]">{service.title}</h3>
                                        <p className="text-[var(--text-muted)] text-[0.95rem] leading-relaxed mb-4">{service.desc}</p>
                                        <span className="text-[var(--color-primary)] font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                                            Learn More <ArrowRight size={16} />
                                        </span>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Why Choose Us */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-extrabold mb-4 font-[family-name:var(--font-outfit)]">
                            Why Choose <span className="gradient-text">CoreTern</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-3 gap-6 max-md:grid-cols-2 max-sm:grid-cols-1">
                        {commonWhyChoose.map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }} viewport={{ once: true }}
                                    className="glass p-6 rounded-2xl border border-[var(--border)] text-center">
                                    <div className="w-12 h-12 bg-[rgba(99,102,241,0.1)] rounded-xl flex items-center justify-center mx-auto mb-4">
                                        <Icon size={22} className="text-[var(--color-primary)]" />
                                    </div>
                                    <h4 className="font-bold mb-2">{item.title}</h4>
                                    <p className="text-[var(--text-muted)] text-sm">{item.desc}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}
