import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata = { title: 'Terms of Service | CoreTern' };

export default function TermsPage() {
    return (
        <div>
            <Navbar />
            <section className="min-h-screen pt-28 pb-20">
                <div className="container max-w-[800px]">
                    <h1 className="text-[clamp(2rem,4vw,3rem)] font-extrabold mb-8 font-[family-name:var(--font-outfit)]">
                        Terms of <span className="gradient-text">Service</span>
                    </h1>
                    <div className="prose-custom">
                        <p><strong>Last Updated:</strong> April 2026</p>

                        <h2>1. Acceptance of Terms</h2>
                        <p>By accessing and using CoreTern&apos;s platform, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>

                        <h2>2. Services</h2>
                        <p>CoreTern provides technology services including software development, internship programs, cloud solutions, and related educational content. We reserve the right to modify or discontinue any service at any time.</p>

                        <h2>3. User Accounts</h2>
                        <p>You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate information during registration and keep it updated.</p>

                        <h2>4. Internship Programs</h2>
                        <ul>
                            <li>Enrollment fees are non-refundable unless specified in our Refund Policy.</li>
                            <li>Certificates are issued upon successful completion of the program.</li>
                            <li>CoreTern reserves the right to modify program content and schedules.</li>
                        </ul>

                        <h2>5. Intellectual Property</h2>
                        <p>All content on the CoreTern platform is owned by CoreTern. You may not reproduce, distribute, or create derivative works without explicit permission.</p>

                        <h2>6. Limitation of Liability</h2>
                        <p>CoreTern is not liable for any indirect, incidental, or consequential damages arising from the use of our services.</p>

                        <h2>7. Contact</h2>
                        <p>For questions about these terms, contact us at <a href="mailto:coreterndev@gmail.com">coreterndev@gmail.com</a>.</p>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}
