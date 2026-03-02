import React from 'react';
import {
    Smartphone, Globe, Brain, Terminal,
    Layers, Database, Activity, Shield, Cpu,
    Beaker, Cloud, Network, Star, Award,
    Clock, Zap, Settings, X,
    PenTool, Layout, Box, Code, Braces, Server,
    Lock, Share2
} from 'lucide-react';

export const services = [
    {
        title: 'Android/IOS Development',
        desc: 'Crafting exceptional user experiences and driving digital transformation through high-performance Android and IOS development.',
        icon: <Smartphone />,
        image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=2070',
        id: 'mobile',
        features: []
    },
    {
        title: 'Full Stack Web Solutions',
        desc: 'Building scalable, secure, and modern web applications that empower your business to reach a global audience.',
        icon: <Globe />,
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=2072',
        id: 'web',
        features: []
    },
    {
        title: 'AI & Data Intelligence',
        desc: 'Unlocking the power of your data with advanced machine learning models and intelligent automation systems.',
        icon: <Brain />,
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=2070',
        id: 'ai',
        features: []
    },
    {
        title: 'Cloud Infrastructure',
        desc: 'Modernizing your infrastructure with cloud-native solutions, ensuring high availability and seamless scalability.',
        icon: <Terminal />,
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2072',
        id: 'cloud',
        features: []
    },
    {
        title: 'Cybersecurity Systems',
        desc: 'Protecting your digital assets with advanced threat detection, encryption, and robust security protocols.',
        icon: <Lock />,
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070',
        id: 'security',
        features: []
    },
    {
        title: 'Blockchain & Web3',
        desc: 'Building decentralized solutions, smart contracts, and secure ledger systems for the next generation of the internet.',
        icon: <Share2 />,
        image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=2232',
        id: 'blockchain',
        features: []
    }
];

export const getDetailedData = (id) => {
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
        case 'ai':
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
        case 'security':
            return {
                features: [
                    { icon: <Lock size={24} />, title: "Threat Detect", desc: "Real-time AI monitoring for threats.", cat: "Security" },
                    { icon: <Shield size={24} />, title: "Firewall", desc: "Advanced perimeter defense systems.", cat: "Infra" },
                    { icon: <Terminal size={24} />, title: "Pen Testing", desc: "Vulnerability analysis and reporting.", cat: "Audit" }
                ]
            };
        case 'blockchain':
            return {
                features: [
                    { icon: <Share2 size={24} />, title: "Smart Contracts", desc: "Secure automated contract execution.", cat: "Web3" },
                    { icon: <Box size={24} />, title: "NFT Mints", desc: "Digital asset creation and management.", cat: "Assets" },
                    { icon: <Globe size={24} />, title: "DeFi Solutions", desc: "Decentralized finance architectures.", cat: "Finance" }
                ]
            };
        default:
            return null;
    }
};

export const commonWhyChoose = [
    { icon: <Star />, title: "Expert Team", desc: "Our skilled professionals bring over 9+ years of experience." },
    { icon: <Award />, title: "Project Mastery", desc: "Handled 100+ projects with efficiency." },
    { icon: <Clock />, title: "Timely Support", desc: "Response within 8 hours or less." },
    { icon: <Zap />, title: "Cutting-Edge Technologies", desc: "Stay ahead with state-of-the-art tech." },
    { icon: <Settings />, title: "Tailored Solutions", desc: "Custom solutions for your needs." },
    { icon: <Globe />, title: "Global Reach", desc: "Serving 50+ clients worldwide." }
];
