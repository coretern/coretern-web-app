import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata = { title: 'About Us | CoreTern' };

export default function AboutPage() {
    return (
        <div>
            <Navbar />
            <section className="min-h-screen pt-28 pb-20">
                <div className="container max-w-[800px]">
                    <h1 className="text-[clamp(2.5rem,5vw,3.5rem)] font-extrabold mb-8 font-[family-name:var(--font-outfit)]">
                        About <span className="gradient-text">CoreTern</span>
                    </h1>
                    <div className="prose-custom">
                        <p>CoreTern is a leading technology solutions provider dedicated to empowering businesses and aspiring tech professionals. We bridge the gap between academic learning and industry requirements through our comprehensive suite of services.</p>

                        <h2>Our Mission</h2>
                        <p>To democratize access to quality tech education and provide world-class software development services that help businesses thrive in the digital economy.</p>

                        <h2>What We Do</h2>
                        <ul>
                            <li><strong>Software Development:</strong> End-to-end web and mobile application development for businesses of all sizes.</li>
                            <li><strong>Internship Programs:</strong> Industry-focused internship programs with hands-on project experience and mentorship.</li>
                            <li><strong>Cloud Solutions:</strong> Scalable cloud infrastructure and DevOps consulting services.</li>
                            <li><strong>UI/UX Design:</strong> User-centered design solutions that drive engagement and conversion.</li>
                        </ul>

                        <h2>Our Values</h2>
                        <ul>
                            <li><strong>Excellence:</strong> We strive for the highest quality in everything we do.</li>
                            <li><strong>Innovation:</strong> We embrace new technologies and creative problem-solving.</li>
                            <li><strong>Integrity:</strong> We operate with transparency and honesty.</li>
                            <li><strong>Impact:</strong> We measure success by the positive impact we create.</li>
                        </ul>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}
