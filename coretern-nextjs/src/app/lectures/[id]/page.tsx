'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, ChevronLeft, BookOpen, Clock, Info, Loader2, CheckCircle } from 'lucide-react';
import { internshipAPI } from '@/lib/api';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function LecturesPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [internship, setInternship] = useState<any>(null);
    const [currentVideo, setCurrentVideo] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { router.push('/login'); return; }
        const fetch = async () => {
            try {
                const data = await internshipAPI.getById(id);
                setInternship(data.data);
                if (data.data.videos?.length > 0) setCurrentVideo(data.data.videos[0]);
            } catch { router.push('/dashboard'); }
            finally { setLoading(false); }
        };
        fetch();
    }, [id, router]);

    const getEmbedUrl = (url: string) => {
        if (!url) return '';
        const m = url.match(/(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        return m ? `https://www.youtube.com/embed/${m[1]}` : url;
    };

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Loader2 className="animate-spin" style={{ color: 'var(--color-primary)' }} size={40} />
        </div>
    );

    if (!internship) return null;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
            <Navbar />
            <div className="container" style={{ maxWidth: '1200px', paddingTop: '7rem', paddingBottom: '3rem' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', borderRadius: '10px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none' }}>
                            <ChevronLeft size={16} /> Dashboard
                        </Link>
                        <h1 style={{ fontSize: 'clamp(1.1rem, 3vw, 1.4rem)', fontWeight: 700 }} className="outfit">{internship.title}</h1>
                    </div>
                    <span style={{ padding: '0.35rem 0.85rem', borderRadius: '10px', background: 'rgba(99,102,241,0.1)', color: '#6366f1', fontSize: '0.75rem', fontWeight: 700 }}>Lecture Mode</span>
                </div>

                {/* Video Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem', alignItems: 'start' }} className="lecture-grid">
                    {/* Main Player */}
                    <div>
                        <div style={{ position: 'relative', paddingBottom: '56.25%', borderRadius: '16px', overflow: 'hidden', background: '#000', marginBottom: '1.5rem' }}>
                            {currentVideo ? (
                                <iframe
                                    src={getEmbedUrl(currentVideo.url)}
                                    title={currentVideo.title}
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                                    <Play size={56} style={{ opacity: 0.4, marginBottom: '1rem' }} />
                                    <p style={{ fontWeight: 600 }}>Coming Soon: Video lectures</p>
                                </div>
                            )}
                        </div>

                        {/* Tabs */}
                        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                                {['overview', 'resources'].map((tab) => (
                                    <button key={tab} onClick={() => setActiveTab(tab)}
                                        style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', border: 'none', background: activeTab === tab ? 'var(--color-primary)' : 'transparent', color: activeTab === tab ? 'white' : 'var(--text-muted)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', textTransform: 'capitalize' }}>
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            {activeTab === 'overview' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }} className="outfit">{currentVideo?.title || 'Course Overview'}</h2>
                                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.9rem' }}>{internship.description}</p>
                                    <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}><Clock size={16} /> {internship.duration}</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}><BookOpen size={16} /> {internship.videos?.length || 0} Lessons</span>
                                    </div>
                                </motion.div>
                            )}
                            {activeTab === 'resources' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }} className="outfit">Learning Path</h3>
                                    {internship.curriculum?.map((item: string, idx: number) => (
                                        <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', marginBottom: '0.6rem' }}>
                                            <CheckCircle size={16} style={{ color: 'var(--color-primary)', marginTop: '2px', flexShrink: 0 }} />
                                            <span style={{ fontSize: '0.9rem' }}>{item}</span>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar Playlist */}
                    <aside style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden', position: 'sticky', top: '7rem' }} className="lecture-sidebar">
                        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 700 }} className="outfit">Course Content</h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>{internship.videos?.length || 0} Modules</p>
                        </div>
                        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                            {internship.videos?.length > 0 ? internship.videos.map((video: any, i: number) => (
                                <div key={i} onClick={() => setCurrentVideo(video)}
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1.25rem', cursor: 'pointer', transition: 'all 0.2s', background: currentVideo?.url === video.url ? 'rgba(99,102,241,0.08)' : 'transparent', borderLeft: currentVideo?.url === video.url ? '3px solid var(--color-primary)' : '3px solid transparent' }}>
                                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: currentVideo?.url === video.url ? 'var(--color-primary)' : 'var(--background)', color: currentVideo?.url === video.url ? 'white' : 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>
                                        {i + 1}
                                    </div>
                                    <div style={{ minWidth: 0 }}>
                                        <p style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{video.title}</p>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Play size={10} /> Video</span>
                                    </div>
                                </div>
                            )) : (
                                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    <Info size={28} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
                                    <p style={{ fontSize: '0.85rem' }}>No videos yet</p>
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
            <Footer />
        </div>
    );
}
