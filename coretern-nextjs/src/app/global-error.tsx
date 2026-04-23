'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="en">
            <body style={{ background: '#0f172a', color: '#e6edf3', fontFamily: 'Inter, sans-serif', margin: 0 }}>
                <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                    <div style={{ textAlign: 'center', maxWidth: '500px' }}>
                        <div style={{ width: 64, height: 64, borderRadius: 16, background: 'linear-gradient(135deg, #ef4444, #f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                            <AlertTriangle size={32} color="white" />
                        </div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>Something went wrong</h1>
                        <p style={{ color: '#7d8590', marginBottom: '2rem', lineHeight: 1.6 }}>
                            An unexpected error occurred. Please try again or return to the homepage.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button
                                onClick={reset}
                                style={{ padding: '0.75rem 1.5rem', background: '#6366f1', color: 'white', border: 'none', borderRadius: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.95rem' }}
                            >
                                <RefreshCw size={18} /> Try Again
                            </button>
                            <a href="/" style={{ padding: '0.75rem 1.5rem', background: 'transparent', color: '#e6edf3', border: '1px solid rgba(240,246,252,0.1)', borderRadius: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.95rem', textDecoration: 'none' }}>
                                <Home size={18} /> Go Home
                            </a>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}
