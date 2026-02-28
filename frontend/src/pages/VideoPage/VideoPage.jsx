import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronLeft, Layout, BookOpen, Clock, CheckCircle, Info } from 'lucide-react';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import './VideoPage.css';

const VideoPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [internship, setInternship] = useState(null);
    const [currentVideo, setCurrentVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };

                // Fetch internship data (which should now include videos)
                const res = await axios.get(`http://localhost:5000/api/internships/${id}`, config);
                setInternship(res.data.data);

                // Set initial video if available
                if (res.data.data.videos && res.data.data.videos.length > 0) {
                    setCurrentVideo(res.data.data.videos[0]);
                }
            } catch (err) {
                console.error('Error fetching course videos', err);
                if (err.response?.status === 401) navigate('/login');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, navigate]);

    if (loading) return (
        <div className="video-loading-container">
            <div className="video-loader"></div>
            <p>Loading your curriculum...</p>
        </div>
    );

    if (!internship) return (
        <div className="not-found-container glass">
            <h2>Course Not Found</h2>
            <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
        </div>
    );

    const getEmbedUrl = (url) => {
        if (!url) return '';
        // Handle YouTube URLs
        const youtubeId = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        return youtubeId ? `https://www.youtube.com/embed/${youtubeId[1]}` : url;
    };

    return (
        <div className="video-page-layout">
            <Navbar />

            <main className="video-content-container">
                <div className="video-header">
                    <Link to="/dashboard" className="back-link">
                        <ChevronLeft size={20} /> Back to Dashboard
                    </Link>
                    <h1 className="outfit">{internship.title}</h1>
                </div>

                <div className="video-player-grid">
                    <div className="main-video-section">
                        <div className="player-wrapper glass">
                            {currentVideo ? (
                                <iframe
                                    src={getEmbedUrl(currentVideo.url)}
                                    title={currentVideo.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <div className="no-video-placeholder">
                                    <Play size={64} className="text-primary opacity-50" />
                                    <p>Coming Soon: Video lectures for this module</p>
                                </div>
                            )}
                        </div>

                        <div className="video-description-section glass">
                            <div className="description-tabs">
                                <button
                                    className={activeTab === 'overview' ? 'active' : ''}
                                    onClick={() => setActiveTab('overview')}
                                >
                                    Overview
                                </button>
                                <button
                                    className={activeTab === 'notes' ? 'active' : ''}
                                    onClick={() => setActiveTab('notes')}
                                >
                                    Resources
                                </button>
                            </div>

                            <div className="tab-content">
                                {activeTab === 'overview' && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <h2 className="outfit">{currentVideo?.title || 'Course Overview'}</h2>
                                        <p className="text-text-muted">{internship.description}</p>

                                        <div className="course-stats">
                                            <div className="stat">
                                                <Clock size={16} />
                                                <span>{internship.duration} Program</span>
                                            </div>
                                            <div className="stat">
                                                <BookOpen size={16} />
                                                <span>{internship.videos?.length || 0} Lessons</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'notes' && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <h3 className="outfit">Learning Path</h3>
                                        <ul className="curriculum-list">
                                            {internship.curriculum?.map((item, idx) => (
                                                <li key={idx}>
                                                    <CheckCircle size={16} className="text-success" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>

                    <aside className="video-sidebar glass">
                        <div className="sidebar-header">
                            <h3 className="outfit">Course Content</h3>
                            <p>{internship.videos?.length || 0} Modules</p>
                        </div>

                        <div className="video-playlist">
                            {internship.videos && internship.videos.length > 0 ? (
                                internship.videos.map((video, index) => (
                                    <div
                                        key={index}
                                        className={`playlist-item ${currentVideo?.url === video.url ? 'active' : ''}`}
                                        onClick={() => setCurrentVideo(video)}
                                    >
                                        <div className="video-index">{index + 1}</div>
                                        <div className="video-info">
                                            <p className="video-title">{video.title}</p>
                                            <span className="video-meta"><Play size={12} /> Video Lecture</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-6 text-center text-text-muted">
                                    <Info size={32} className="mx-auto mb-2 opacity-50" />
                                    <p>No videos available yet.</p>
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default VideoPage;
