import {
    Smartphone, Globe, Brain, Terminal,
    Layers, Database, Activity, Shield, Cpu,
    Beaker, Cloud, Network, Star, Award,
    Clock, Zap, Settings,
    PenTool, Layout, Box, Code, Braces, Server,
    Lock, Share2
} from 'lucide-react';

export const services = [
    {
        title: 'Android/IOS Development',
        desc: 'Crafting exceptional user experiences and driving digital transformation through high-performance Android and IOS development.',
        icon: Smartphone,
        image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=2070',
        id: 'mobile',
        features: []
    },
    {
        title: 'Full Stack Web Solutions',
        desc: 'Building scalable, secure, and modern web applications that empower your business to reach a global audience.',
        icon: Globe,
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=2072',
        id: 'web',
        features: []
    },
    {
        title: 'AI & Data Intelligence',
        desc: 'Unlocking the power of your data with advanced machine learning models and intelligent automation systems.',
        icon: Brain,
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=2070',
        id: 'ai',
        features: []
    },
    {
        title: 'Cloud Infrastructure',
        desc: 'Modernizing your infrastructure with cloud-native solutions, ensuring high availability and seamless scalability.',
        icon: Terminal,
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2072',
        id: 'cloud',
        features: []
    },
    {
        title: 'Cybersecurity Systems',
        desc: 'Protecting your digital assets with advanced threat detection, encryption, and robust security protocols.',
        icon: Lock,
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070',
        id: 'security',
        features: []
    },
    {
        title: 'Blockchain & Web3',
        desc: 'Building decentralized solutions, smart contracts, and secure ledger systems for the next generation of the internet.',
        icon: Share2,
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
                    { icon: Smartphone, title: "Native Development", desc: "Swift for iOS and Kotlin for Android.", cat: "Core" },
                    { icon: Layers, title: "Cross-Platform", desc: "Flutter and React Native solutions.", cat: "Development" },
                    { icon: Layout, title: "UI/UX Design", desc: "Mobile-first user interface patterns.", cat: "Design" },
                    { icon: Cpu, title: "Performance Tuning", desc: "Optimizing for low-end devices.", cat: "Engineering" },
                    { icon: Shield, title: "App Security", desc: "Encrypted storage and secure API calls.", cat: "Security" },
                    { icon: Activity, title: "Real-time Sync", desc: "Socket-based updates and offline support.", cat: "Features", trend: true },
                    { icon: Box, title: "Store Distribution", desc: "Full App Store and Play Store management.", cat: "DevOps", trend: true },
                    { icon: Settings, title: "Custom Integration", desc: "Third-party SDK and hardware hooks.", cat: "Integration", trend: true }
                ]
            };
        case 'web':
            return {
                features: [
                    { icon: Code, title: "Frontend Mastery", desc: "React, Next.js and Vue.js expertise.", cat: "Frontend" },
                    { icon: Server, title: "Backend Systems", desc: "Node.js, Go, and Python backends.", cat: "Backend" },
                    { icon: Database, title: "Database Architecture", desc: "SQL and NoSQL highly scalable designs.", cat: "Data" },
                    { icon: Braces, title: "API Development", desc: "RESTful and GraphQL performant APIs.", cat: "Integration" },
                    { icon: Shield, title: "Web Security", desc: "OWASP standards and penetration testing.", cat: "Security" },
                    { icon: Zap, title: "Optimization", desc: "PWA and Core Web Vitals optimization.", cat: "Core", trend: true },
                    { icon: Cloud, title: "Serverless Web", desc: "Edge computing and lambda deployments.", cat: "Infra", trend: true },
                    { icon: Globe, title: "Internationalization", desc: "Global scalability and multi-language support.", cat: "Global", trend: true }
                ]
            };
        case 'cloud':
            return {
                features: [
                    { icon: Cloud, title: "AWS/Azure/GCP", desc: "Expertise across all major providers.", cat: "Cloud" },
                    { icon: Layers, title: "Kubernetes", desc: "Container orchestration and management.", cat: "DevOps" },
                    { icon: Terminal, title: "IAC / Terraform", desc: "Infrastructure as Code automation.", cat: "Automation" },
                    { icon: Settings, title: "CI/CD Pipelines", desc: "Robust deployment automation.", cat: "Workflow" },
                    { icon: Shield, title: "Cloud Security", desc: "VPC, IAM and security group hardening.", cat: "Security" },
                    { icon: Cpu, title: "Cost Optimization", desc: "Billing analysis and resource management.", cat: "Finance", trend: true },
                    { icon: Network, title: "Hybrid Cloud", desc: "Bridging on-prem and cloud systems.", cat: "Infra", trend: true },
                    { icon: Activity, title: "SRE / Monitoring", desc: "24/7 observability and uptime.", cat: "Reliability", trend: true }
                ]
            };
        case 'ai':
            return {
                features: [
                    { icon: Layers, title: "ETL Processing", desc: "Extract, Transform, Load data pipelines.", cat: "Data Integration" },
                    { icon: Database, title: "Data Warehousing", desc: "Cloud-based storage and management.", cat: "Storage" },
                    { icon: Activity, title: "Real-Time Data Processing", desc: "Instant analysis of streaming data.", cat: "Streaming" },
                    { icon: Shield, title: "Data Governance", desc: "Compliance and security management.", cat: "Governance" },
                    { icon: Cpu, title: "AI-Driven Pipeline Automation", desc: "Self-optimizing data workflows.", cat: "Automation" },
                    { icon: Beaker, title: "Synthetic Data Generation", desc: "AI-created datasets for training.", cat: "Innovation", trend: true },
                    { icon: Cloud, title: "Hybrid Data Lakes", desc: "Advanced analytics with structured/unstructured data.", cat: "Storage", trend: true },
                    { icon: Network, title: "IoT Data Integration", desc: "Processing data from connected devices.", cat: "IoT", trend: true }
                ]
            };
        case 'security':
            return {
                features: [
                    { icon: Lock, title: "Threat Detect", desc: "Real-time AI monitoring for threats.", cat: "Security" },
                    { icon: Shield, title: "Firewall", desc: "Advanced perimeter defense systems.", cat: "Infra" },
                    { icon: Terminal, title: "Pen Testing", desc: "Vulnerability analysis and reporting.", cat: "Audit" }
                ]
            };
        case 'blockchain':
            return {
                features: [
                    { icon: Share2, title: "Smart Contracts", desc: "Secure automated contract execution.", cat: "Web3" },
                    { icon: Box, title: "NFT Mints", desc: "Digital asset creation and management.", cat: "Assets" },
                    { icon: Globe, title: "DeFi Solutions", desc: "Decentralized finance architectures.", cat: "Finance" }
                ]
            };
        default:
            return null;
    }
};

export const commonWhyChoose = [
    { icon: Star, title: "Expert Team", desc: "Our skilled professionals bring over 9+ years of experience." },
    { icon: Award, title: "Project Mastery", desc: "Handled 100+ projects with efficiency." },
    { icon: Clock, title: "Timely Support", desc: "Response within 8 hours or less." },
    { icon: Zap, title: "Cutting-Edge Technologies", desc: "Stay ahead with state-of-the-art tech." },
    { icon: Settings, title: "Tailored Solutions", desc: "Custom solutions for your needs." },
    { icon: Globe, title: "Global Reach", desc: "Serving 50+ clients worldwide." }
];
