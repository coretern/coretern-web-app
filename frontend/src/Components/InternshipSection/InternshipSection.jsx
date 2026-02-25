import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, Loader2 } from 'lucide-react';
import InternshipCard from '../InternshipCard/InternshipCard';
import './InternshipSection.css';

const InternshipSection = () => {
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInternships = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/internships');
                // Only show first 3 for the landing page
                setInternships(data.data.slice(0, 3));
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
        <section className="internship-section">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title outfit">
                        Summer Internship <span className="text-primary">2026</span>
                    </h2>
                    <p className="section-desc">
                        Kickstart your career with our industry-led internship programs.
                        Gain practical experience and work on real-world projects.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="animate-spin text-primary" size={40} />
                    </div>
                ) : (
                    <div className="internships-grid">
                        {internships.map((item, index) => (
                            <InternshipCard key={item._id} item={item} index={index} />
                        ))}
                    </div>
                )}

                <div className="section-footer">
                    <Link to="/internships" className="btn btn-outline">
                        View All Opportunities <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default InternshipSection;
