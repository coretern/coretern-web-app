'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';
import { internshipAPI } from '@/lib/api';
import InternshipCard from '@/components/landing/InternshipCard';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function InternshipsPage() {
    const [internships, setInternships] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [domain, setDomain] = useState('all');

    useEffect(() => {
        const fetchInternships = async () => {
            try {
                const data = await internshipAPI.getAll();
                setInternships(data?.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchInternships();
    }, []);

    const domains = ['all', ...new Set(internships.map((i: any) => i.domain))];

    const filtered = internships.filter((i: any) => {
        const matchSearch = i.title.toLowerCase().includes(search.toLowerCase()) || i.domain.toLowerCase().includes(search.toLowerCase());
        const matchDomain = domain === 'all' || i.domain === domain;
        return matchSearch && matchDomain;
    });

    return (
        <div>
            <Navbar />
            <section className="min-h-screen pt-28 pb-20 bg-[var(--background)]">
                <div className="container">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
                        <h1 className="text-[clamp(2.5rem,5vw,3.5rem)] font-extrabold mb-4 font-[family-name:var(--font-outfit)]">
                            Summer Internship <span className="gradient-text">2026</span>
                        </h1>
                        <p className="text-[var(--text-muted)] text-lg max-w-[600px] mx-auto">
                            Choose from our premium internship programs and kickstart your career
                        </p>
                    </motion.div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-4 mb-12 justify-center items-center">
                        <div className="relative flex-1 max-w-[400px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                            <input type="text" placeholder="Search internships..." value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full py-3 pl-12 pr-4 bg-[var(--surface)] border border-[var(--border)] rounded-full text-[var(--text)] focus:outline-none focus:border-[var(--color-primary)] transition-colors" />
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {domains.map((d: any) => (
                                <button key={d} onClick={() => setDomain(d)}
                                    className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 cursor-pointer ${domain === d ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]' : 'bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--color-primary)]'}`}>
                                    {d === 'all' ? 'All' : d}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="animate-spin text-[var(--color-primary)]" size={40} />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-20 text-[var(--text-muted)]">
                            <p className="text-xl">No internships found</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-8 max-md:grid-cols-1 max-md:max-w-[450px] max-md:mx-auto">
                            {filtered.map((item: any, index: number) => (
                                <InternshipCard key={item._id} item={item} index={index} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
            <Footer />
        </div>
    );
}
