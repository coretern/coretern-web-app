'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import InternshipCard from './InternshipCard';
import SkeletonCard from '../ui/SkeletonCard';

const InternshipSection = () => {
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInternships = async () => {
            try {
                const res = await fetch('/api/internships');
                const data = await res.json();
                if (data?.data && Array.isArray(data.data)) {
                    setInternships(data.data.slice(0, 3));
                }
            } catch (err) {
                console.error('Error fetching internships', err);
            } finally {
                setLoading(false);
            }
        };
        fetchInternships();
    }, []);

    if (!loading && internships.length === 0) return null;

    return (
        <section className="relative pt-4 pb-20 bg-[var(--background)] overflow-hidden max-md:pt-4 max-md:pb-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(99,102,241,0.08)_0%,transparent_70%)] pointer-events-none z-0" />
            <div className="container">
                <div className="-mt-6 mb-16 flex flex-col items-center text-center relative z-[1]">
                    <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-extrabold mb-3 tracking-[-0.02em] font-[family-name:var(--font-outfit)]">
                        Summer Internship <span className="text-[var(--color-primary)]">2026</span>
                    </h2>
                    <p className="max-w-[500px] mx-auto text-[var(--text-muted)] text-base leading-relaxed" style={{ marginTop: '5px', marginBottom: '25px' }}>
                        Kickstart your career with our industry-led internship programs. Gain practical experience and work on real-world projects.
                    </p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-10 relative z-[1] max-md:grid-cols-1 max-md:gap-8 max-md:max-w-[450px] max-md:mx-auto">
                        {[1, 2, 3].map((i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-10 relative z-[1] max-md:grid-cols-1 max-md:gap-8 max-md:max-w-[450px] max-md:mx-auto">
                        {internships.map((item, index) => (
                            <InternshipCard key={item._id} item={item} index={index} />
                        ))}
                    </div>
                )}

                <div className="flex justify-center relative z-[1]" style={{ marginTop: '4rem' }}>
                    <Link href="/internships" className="btn btn-outline">
                        View All Opportunities <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default InternshipSection;
