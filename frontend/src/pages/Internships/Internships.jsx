import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import InternshipCard from '../../Components/InternshipCard/InternshipCard';
import StudentReviews from '../../Components/Reviews/StudentReviews';
import PageTransition from '../../Components/PageTransition';
import SEO from '../../Components/SEO';
import './Internships.css';

const Internships = () => {
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInternships = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/internships`);
                setInternships(data.data);
            } catch (err) {
                console.error('Error fetching internships', err);
            } finally {
                setLoading(false);
            }
        };
        fetchInternships();
    }, []);

    return (
        <PageTransition>
            <SEO title="Explore Internships" description="Apply for 6-month specialized internships in React, Node.js, Android Development, UI/UX Design, and more." url="/internships" />
            <div className="internships-page">
                <Navbar />

                <div className="container">
                    <header className="internships-header">
                        <h1 className="internships-title outfit">
                            Summer Internship <span className="gradient-text">2026</span>
                        </h1>
                        <p className="internships-subtitle">
                            Explore our wide range of domains and start your journey today with industry-recognized programs.
                        </p>
                    </header>

                    {loading ? (
                        <div className="loader-container">
                            <Loader2 className="animate-spin text-primary" size={48} />
                        </div>
                    ) : (
                        <div className="internships-grid">
                            {internships.map((item, index) => (
                                <InternshipCard key={item._id} item={item} index={index} />
                            ))}
                        </div>
                    )}

                    <StudentReviews internshipTitle="Internship" internshipId={null} />
                </div>

                <Footer />
            </div>
        </PageTransition>
    );
};

export default Internships;
