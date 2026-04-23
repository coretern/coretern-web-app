import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata = { title: 'Refund Policy | CoreTern' };

export default function RefundPolicyPage() {
    return (
        <div>
            <Navbar />
            <section className="min-h-screen pt-28 pb-20">
                <div className="container max-w-[800px]">
                    <h1 className="text-[clamp(2rem,4vw,3rem)] font-extrabold mb-8 font-[family-name:var(--font-outfit)]">
                        Refund <span className="gradient-text">Policy</span>
                    </h1>
                    <div className="prose-custom">
                        <p><strong>Last Updated:</strong> April 2026</p>

                        <h2>1. Internship Program Refunds</h2>
                        <p>Refund requests for internship programs must be submitted within <strong>48 hours</strong> of payment. After 48 hours, no refunds will be processed.</p>

                        <h2>2. Eligibility</h2>
                        <ul>
                            <li>Full refund if requested within 48 hours of enrollment and before accessing any program content.</li>
                            <li>No refund after 48 hours or if program content has been accessed.</li>
                            <li>No refund if the certificate has already been issued.</li>
                        </ul>

                        <h2>3. How to Request a Refund</h2>
                        <p>To request a refund, raise a support ticket via the <a href="/contact">Contact page</a> or email <a href="mailto:coreterndev@gmail.com">coreterndev@gmail.com</a> with your order ID and reason for the refund.</p>

                        <h2>4. Processing Time</h2>
                        <p>Approved refunds will be processed within <strong>7-10 business days</strong> via the original payment method.</p>

                        <h2>5. Service Development Projects</h2>
                        <p>For custom software development projects, refund terms are defined in the individual project agreement and are subject to the scope of work completed.</p>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}
