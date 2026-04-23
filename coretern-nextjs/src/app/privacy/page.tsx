import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata = { title: 'Privacy Policy | CoreTern' };

export default function PrivacyPage() {
    return (
        <div>
            <Navbar />
            <section className="min-h-screen pt-28 pb-20">
                <div className="container max-w-[800px]">
                    <h1 className="text-[clamp(2rem,4vw,3rem)] font-extrabold mb-8 font-[family-name:var(--font-outfit)]">
                        Privacy <span className="gradient-text">Policy</span>
                    </h1>
                    <div className="prose-custom">
                        <p><strong>Last Updated:</strong> April 2026</p>

                        <h2>1. Information We Collect</h2>
                        <p>We collect personal information including name, email, phone number, and educational details when you register or enroll in our programs.</p>

                        <h2>2. How We Use Information</h2>
                        <ul>
                            <li>To provide and improve our services</li>
                            <li>To process enrollments and payments</li>
                            <li>To issue certificates and verify credentials</li>
                            <li>To communicate about programs and updates</li>
                            <li>To provide customer support</li>
                        </ul>

                        <h2>3. Data Security</h2>
                        <p>We implement industry-standard security measures to protect your data. Passwords are hashed using bcrypt and JWT tokens are used for session management.</p>

                        <h2>4. Third-Party Services</h2>
                        <p>We use Cashfree for payment processing, Cloudinary for file storage, and Google OAuth for authentication. These services have their own privacy policies.</p>

                        <h2>5. Data Retention</h2>
                        <p>We retain your data for as long as your account is active or as needed to provide services. You may request account deletion by contacting us.</p>

                        <h2>6. Your Rights</h2>
                        <p>You have the right to access, correct, or delete your personal data. Contact us at <a href="mailto:coreterndev@gmail.com">coreterndev@gmail.com</a> for data-related requests.</p>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}
