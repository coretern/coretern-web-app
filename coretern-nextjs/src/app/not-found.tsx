'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--background)] relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center px-6 relative z-10"
            >
                <div className="relative mb-8">
                    <h1 className="text-[12rem] font-extrabold leading-none font-[family-name:var(--font-outfit)] gradient-text opacity-20 select-none max-md:text-[8rem]">
                        404
                    </h1>
                    <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-[var(--text)] whitespace-nowrap">
                        Page Not Found
                    </p>
                </div>

                <p className="text-[var(--text-muted)] text-lg mb-10 max-w-[500px] mx-auto">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved to a different location.
                </p>

                <div className="flex gap-4 justify-center max-sm:flex-col max-sm:items-center">
                    <Link href="/" className="btn btn-primary !py-3 !px-6">
                        <Home size={18} /> Go Home
                    </Link>
                    <button onClick={() => window.history.back()} className="btn btn-outline !py-3 !px-6">
                        <ArrowLeft size={18} /> Go Back
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
