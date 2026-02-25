import React from 'react';
import { motion } from 'framer-motion';
import {
    Layers, Database, Activity, Shield, Cpu,
    Beaker, Cloud, Network, Star, Award,
    Clock, Zap, Settings, Globe, X,
    Smartphone, PenTool, Layout, Box,
    Code, Braces, Terminal, Server
} from 'lucide-react';
import './ServicesInfo.css';

const ServicesInfo = ({ service, onClose }) => {
    // Generate dynamic content based on service ID
    const getDetailedData = (id) => {
        switch (id) {
            case 'mobile':
                return {
                    features: [
                        { icon: <Smartphone size={24} />, title: "Native Development", desc: "Swift for iOS and Kotlin for Android.", cat: "Core" },
                        { icon: <Layers size={24} />, title: "Cross-Platform", desc: "Flutter and React Native solutions.", cat: "Development" },
                        { icon: <Layout size={24} />, title: "UI/UX Design", desc: "Mobile-first user interface patterns.", cat: "Design" },
                        { icon: <Cpu size={24} />, title: "Performance Tuning", desc: "Optimizing for low-end devices.", cat: "Engineering" },
                        { icon: <Shield size={24} />, title: "App Security", desc: "Encrypted storage and secure API calls.", cat: "Security" },
                        { icon: <Activity size={24} />, title: "Real-time Sync", desc: "Socket-based updates and offline support.", cat: "Features", trend: true },
                        { icon: <Box size={24} />, title: "Store Distribution", desc: "Full App Store and Play Store management.", cat: "DevOps", trend: true },
                        { icon: <Settings size={24} />, title: "Custom Integration", desc: "Third-party SDK and hardware hooks.", cat: "Integration", trend: true }
                    ]
                };
            case 'web':
                return {
                    features: [
                        { icon: <Code size={24} />, title: "Frontend Mastery", desc: "React, Next.js and Vue.js expertise.", cat: "Frontend" },
                        { icon: <Server size={24} />, title: "Backend Systems", desc: "Node.js, Go, and Python backends.", cat: "Backend" },
                        { icon: <Database size={24} />, title: "Database Architecture", desc: "SQL and NoSQL highly scalable designs.", cat: "Data" },
                        { icon: <Braces size={24} />, title: "API Development", desc: "RESTful and GraphQL performant APIs.", cat: "Integration" },
                        { icon: <Shield size={24} />, title: "Web Security", desc: "OWASP standards and penetration testing.", cat: "Security" },
                        { icon: <Zap size={24} />, title: "Optimization", desc: "PWA and Core Web Vitals optimization.", cat: "Core", trend: true },
                        { icon: <Cloud size={24} />, title: "Serverless Web", desc: "Edge computing and lambda deployments.", cat: "Infra", trend: true },
                        { icon: <Globe size={24} />, title: "Internationalization", desc: "Global scalability and multi-language support.", cat: "Global", trend: true }
                    ]
                };
            case 'cloud':
                return {
                    features: [
                        { icon: <Cloud size={24} />, title: "AWS/Azure/GCP", desc: "Expertise across all major providers.", cat: "Cloud" },
                        { icon: <Layers size={24} />, title: "Kubernetes", desc: "Container orchestration and management.", cat: "DevOps" },
                        { icon: <Terminal size={24} />, title: "IAC / Terraform", desc: "Infrastructure as Code automation.", cat: "Automation" },
                        { icon: <Settings size={24} />, title: "CI/CD Pipelines", desc: "Robust deployment automation.", cat: "Workflow" },
                        { icon: <Shield size={24} />, title: "Cloud Security", desc: "VPC, IAM and security group hardening.", cat: "Security" },
                        { icon: <Cpu size={24} />, title: "Cost Optimization", desc: "Billing analysis and resource management.", cat: "Finance", trend: true },
                        { icon: <Network size={24} />, title: "Hybrid Cloud", desc: "Bridging on-prem and cloud systems.", cat: "Infra", trend: true },
                        { icon: <Activity size={24} />, title: "SRE / Monitoring", desc: "24/7 observability and uptime.", cat: "Reliability", trend: true }
                    ]
                };
            default: // Default to AI (already shown in screenshot)
                return {
                    features: [
                        { icon: <Layers size={24} />, title: "ETL Processing", desc: "Extract, Transform, Load data pipelines.", cat: "Data Integration" },
                        { icon: <Database size={24} />, title: "Data Warehousing", desc: "Cloud-based storage and management.", cat: "Storage" },
                        { icon: <Activity size={24} />, title: "Real-Time Data Processing", desc: "Instant analysis of streaming data.", cat: "Streaming" },
                        { icon: <Shield size={24} />, title: "Data Governance", desc: "Compliance and security management.", cat: "Governance" },
                        { icon: <Cpu size={24} />, title: "AI-Driven Pipeline Automation", desc: "Self-optimizing data workflows.", cat: "Automation" },
                        { icon: <Beaker size={24} />, title: "Synthetic Data Generation", desc: "AI-created datasets for training.", cat: "Innovation", trend: true },
                        { icon: <Cloud size={24} />, title: "Hybrid Data Lakes", desc: "Advanced analytics with structured/unstructured data.", cat: "Storage", trend: true },
                        { icon: <Network size={24} />, title: "IoT Data Integration", desc: "Processing data from connected devices.", cat: "IoT", trend: true }
                    ]
                };
        }
    };

    const commonWhyChoose = [
        { icon: <Star />, title: "Expert Team", desc: "Our skilled professionals bring over 9+ years of experience." },
        { icon: <Award />, title: "Project Mastery", desc: "Handled 100+ projects with efficiency." },
        { icon: <Clock />, title: "Timely Support", desc: "Response within 8 hours or less." },
        { icon: <Zap />, title: "Cutting-Edge Technologies", desc: "Stay ahead with state-of-the-art tech." },
        { icon: <Settings />, title: "Tailored Solutions", desc: "Custom solutions for your needs." },
        { icon: <Globe />, title: "Global Reach", desc: "Serving 50+ clients worldwide." }
    ];

    const data = getDetailedData(service?.id);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="services-info-overlay"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="services-info-container glass"
                onClick={e => e.stopPropagation()}
            >
                <button className="close-info-btn" onClick={onClose}>
                    <X size={24} />
                </button>

                <div className="info-scroll-view">
                    <header className="info-header">
                        <h2 className="outfit">{service?.title || "AI & Data Intelligence"}</h2>
                        <p className="text-text-muted">A deep dive into our specialized expertise and solutions.</p>
                    </header>

                    <div className="info-features-grid">
                        {data.features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="info-feature-card"
                            >
                                <div className="feature-icon-box">
                                    {feature.icon}
                                </div>
                                <div className="feature-details">
                                    <h4 className="outfit">{feature.title}</h4>
                                    <p>{feature.desc}</p>
                                    <div className="feature-meta">
                                        <span className="feature-cat">Category: {feature.cat}</span>
                                        {feature.trend && <span className="trend-badge">Future Trend</span>}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="why-choose-us-section">
                        <h2 className="section-title outfit text-center">Why Choose Us</h2>
                        <div className="why-choose-grid">
                            {commonWhyChoose.map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="why-item-card"
                                >
                                    <div className="why-icon">
                                        {item.icon}
                                    </div>
                                    <div className="why-text">
                                        <h4 className="outfit">{item.title}</h4>
                                        <p className="text-text-muted">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ServicesInfo;
