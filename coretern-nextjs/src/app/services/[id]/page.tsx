'use client';

import { use } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { services, getDetailedData, commonWhyChoose } from '@/data/servicesData';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const service = services.find(s => s.id === id);
    const detailedData = getDetailedData(id);

    if (!service) {
        return (
            <div>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold mb-4">Service Not Found</h1>
                        <Link href="/services" className="btn btn-primary"><ArrowLeft size={16} /> Back to Services</Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const Icon = service.icon;

    return (
        <div>
            <Navbar />
            <section className="min-h-screen pt-28 pb-20">
                <div className="container">
                    <Link href="/services" className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--color-primary)] mb-8 transition-colors">
                        <ArrowLeft size={18} /> Back to Services
                    </Link>

                    {/* Hero Banner */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="relative rounded-[var(--radius-xl)] overflow-hidden mb-16 h-[400px] max-md:h-[280px]">
                        <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.85)] via-[rgba(0,0,0,0.4)] to-transparent" />
                        <div className="absolute bottom-0 left-0 p-10 max-md:p-6 z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-14 h-14 bg-[image:var(--grad-primary)] rounded-2xl flex items-center justify-center">
                                    <Icon size={28} className="text-white" />
                                </div>
                            </div>
                            <h1 className="text-4xl font-extrabold text-white mb-3 font-[family-name:var(--font-outfit)] max-md:text-2xl">{service.title}</h1>
                            <p className="text-white/70 text-lg max-w-[600px] max-md:text-base">{service.desc}</p>
                        </div>
                    </motion.div>

                    {/* Feature Grid */}
                    {detailedData && detailedData.features.length > 0 && (
                        <>
                            <h2 className="text-2xl font-bold mb-8 font-[family-name:var(--font-outfit)]">What We Offer</h2>
                            <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 mb-16">
                                {detailedData.features.map((feature: any, i: number) => {
                                    const FeatureIcon = feature.icon;
                                    return (
                                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }} viewport={{ once: true }}
                                            className="glass p-6 rounded-2xl border border-[var(--border)] hover:border-[rgba(99,102,241,0.3)] transition-all duration-300">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="w-12 h-12 bg-[rgba(99,102,241,0.1)] rounded-xl flex items-center justify-center">
                                                    <FeatureIcon size={22} className="text-[var(--color-primary)]" />
                                                </div>
                                                {feature.trend && (
                                                    <span className="flex items-center gap-1 text-[0.7rem] font-bold text-[var(--color-primary)] bg-[rgba(99,102,241,0.1)] px-2 py-1 rounded-full">
                                                        <TrendingUp size={12} /> Trending
                                                    </span>
                                                )}
                                            </div>
                                            <h4 className="font-bold mb-2">{feature.title}</h4>
                                            <p className="text-[var(--text-muted)] text-sm leading-relaxed">{feature.desc}</p>
                                            <span className="text-[var(--text-subtle)] text-xs mt-3 inline-block">{feature.cat}</span>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </>
                    )}

                    {/* CTA */}
                    <div className="glass p-12 rounded-[var(--radius-xl)] border border-[var(--border)] text-center">
                        <h2 className="text-3xl font-extrabold mb-4 font-[family-name:var(--font-outfit)]">
                            Ready to <span className="gradient-text">Get Started</span>?
                        </h2>
                        <p className="text-[var(--text-muted)] text-lg mb-8 max-w-[500px] mx-auto">
                            Let&apos;s discuss how we can help transform your business with our {service.title.toLowerCase()} solutions.
                        </p>
                        <Link href="/contact" className="btn btn-primary !py-3 !px-8 !text-base">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}
