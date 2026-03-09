const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
if (process.env.ENABLE_DNS_FIX === 'true') {
    dns.setDefaultResultOrder('ipv4first');
}

const Internship = require('../models/Internship');

const internships = [
    {
        title: "Web Development",
        domain: "Summer Internship",
        fee: 799,
        duration: "1,2,3,4,5 weeks",
        image: "https://i.pinimg.com/1200x/8c/b7/c9/8cb7c937cb10406aa9518cb2d21f5c58.jpg",
        whatsappGroup: "https://chat.whatsapp.com/FnOncwIAGzH50AmeCSFCUr?mode=hqctcla",
        curriculum: ["HTML5 & CSS3", "JavaScript & ES6+", "React.js Frontend", "Node.js Backend", "MongoDB Database"],
        description: "Master full-stack web development and build industrial-grade applications.",
        details: `<h3>Welcome to CoreTern Internship!</h3><p>Start your journey with us to gain real-world skills and professional experience. Here is everything you need to know about the program:</p><h4>What You Will Get</h4><ul><li><strong>Student Dashboard:</strong> After you enroll, you will get access to a private dashboard to track your work and learn.</li><li><strong>Curated Learning Resources:</strong> To enhance your learning experience, we provide suggested video lectures and materials specific to your domain.</li><li><strong>Verified Certificate:</strong> Once you complete your internship, you can download your official certificate directly from your dashboard.</li><li><strong>WhatsApp Community:</strong> You will find a link to an exclusive WhatsApp group in your dashboard. Joining this group is very important for daily updates and guidance.</li><li><strong>Internship Report:</strong> You may also receive a performance report through the WhatsApp group to help you improve and track your progress.</li></ul><h4>Important Instructions</h4><ul><li><strong>Check Your Details:</strong> Please make sure your Full Name and Branch are correct during enrollment. These details will be used exactly as provided for your certificate.</li><li><strong>Need Help?</strong> If you face any issues, you can contact us through the website or message the Admin in your WhatsApp group.</li><li><strong>Share Your Feedback:</strong> Your opinion matters! Don't forget to rate us after completing your internship so we can keep improving.</li></ul>`,
        videos: [{ title: "Intro", url: "https://youtu.be/tVzUXW6siu0?si=iqF7PQx6Zda79SUQ" }]
    },
    {
        title: "App Development",
        domain: "Summer Internship",
        fee: 799,
        duration: "1,2,3,4,5 weeks",
        image: "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?auto=format&fit=crop&q=80&w=800",
        whatsappGroup: "https://chat.whatsapp.com/FnOncwIAGzH50AmeCSFCUr?mode=hqctcla",
        curriculum: ["Flutter/React Native", "UI/UX Design", "Mobile APIs", "Database Integration", "App Store Deployment"],
        description: "Create stunning mobile applications for Android and iOS using modern frameworks.",
        details: `<h3>Welcome to CoreTern Internship!</h3><p>Start your journey with us to gain real-world skills and professional experience. Here is everything you need to know about the program:</p><h4>What You Will Get</h4><ul><li><strong>Student Dashboard:</strong> After you enroll, you will get access to a private dashboard to track your work and learn.</li><li><strong>Verified Certificate:</strong> Once you complete your internship, you can download your official certificate directly from your dashboard.</li><li><strong>WhatsApp Community:</strong> You will find a link to an exclusive WhatsApp group in your dashboard. Joining this group is very important for daily updates and guidance.</li><li><strong>Internship Report:</strong> You may also receive a performance report through the WhatsApp group to help you improve and track your progress.</li></ul><h4>Important Instructions</h4><ul><li><strong>Check Your Details:</strong> Please make sure your Full Name and Branch are correct during enrollment. These details will be used exactly as provided for your certificate.</li><li><strong>Need Help?</strong> If you face any issues, you can contact us through the website or message the Admin in your WhatsApp group.</li><li><strong>Share Your Feedback:</strong> Your opinion matters! Don't forget to rate us after completing your internship so we can keep improving.</li></ul>`,
        videos: [{ title: "Intro", url: "https://youtu.be/tVzUXW6siu0?si=iqF7PQx6Zda79SUQ" }]
    },
    {
        title: "Artificial Intelligence (AI) / Machine Learning (ML)",
        domain: "Summer Internship",
        fee: 799,
        duration: "1,2,3,4,5 weeks",
        image: "https://i.pinimg.com/736x/80/7f/d3/807fd3e0527c92672b5fa6fd99292320.jpg",
        whatsappGroup: "https://chat.whatsapp.com/FnOncwIAGzH50AmeCSFCUr?mode=hqctcla",
        curriculum: ["Supervised Learning", "Unsupervised Learning", "Neural Networks", "Deep Learning", "Model Deployment"],
        description: "Explore the world of AI/ML and build intelligent systems from scratch.",
        details: `<h3>Welcome to CoreTern Internship!</h3><p>Start your journey with us to gain real-world skills and professional experience. Here is everything you need to know about the program:</p><h4>What You Will Get</h4><ul><li><strong>Student Dashboard:</strong> After you enroll, you will get access to a private dashboard to track your work and learn.</li><li><strong>Verified Certificate:</strong> Once you complete your internship, you can download your official certificate directly from your dashboard.</li><li><strong>WhatsApp Community:</strong> You will find a link to an exclusive WhatsApp group in your dashboard. Joining this group is very important for daily updates and guidance.</li><li><strong>Internship Report:</strong> You may also receive a performance report through the WhatsApp group to help you improve and track your progress.</li></ul><h4>Important Instructions</h4><ul><li><strong>Check Your Details:</strong> Please make sure your Full Name and Branch are correct during enrollment. These details will be used exactly as provided for your certificate.</li><li><strong>Need Help?</strong> If you face any issues, you can contact us through the website or message the Admin in your WhatsApp group.</li><li><strong>Share Your Feedback:</strong> Your opinion matters! Don't forget to rate us after completing your internship so we can keep improving.</li></ul>`,
        videos: [{ title: "Intro", url: "https://youtu.be/tVzUXW6siu0?si=iqF7PQx6Zda79SUQ" }]
    },
    {
        title: "Python Development",
        domain: "Summer Internship",
        fee: 799,
        duration: "1,2,3,4,5 weeks",
        image: "https://i.pinimg.com/1200x/2d/d8/03/2dd8031b5e88f0104d083e4ed6233bc0.jpg",
        whatsappGroup: "https://chat.whatsapp.com/FnOncwIAGzH50AmeCSFCUr?mode=hqctcla",
        curriculum: ["Python Basics", "Flask/Django", "Data Scrapping", "Automation Scripts", "Database Handling"],
        description: "Become an expert Python developer with focus on web and automation.",
        details: `<h3>Welcome to CoreTern Internship!</h3><p>Start your journey with us to gain real-world skills and professional experience. Here is everything you need to know about the program:</p><h4>What You Will Get</h4><ul><li><strong>Student Dashboard:</strong> After you enroll, you will get access to a private dashboard to track your work and learn.</li><li><strong>Verified Certificate:</strong> Once you complete your internship, you can download your official certificate directly from your dashboard.</li><li><strong>WhatsApp Community:</strong> You will find a link to an exclusive WhatsApp group in your dashboard. Joining this group is very important for daily updates and guidance.</li><li><strong>Internship Report:</strong> You may also receive a performance report through the WhatsApp group to help you improve and track your progress.</li></ul><h4>Important Instructions</h4><ul><li><strong>Check Your Details:</strong> Please make sure your Full Name and Branch are correct during enrollment. These details will be used exactly as provided for your certificate.</li><li><strong>Need Help?</strong> If you face any issues, you can contact us through the website or message the Admin in your WhatsApp group.</li><li><strong>Share Your Feedback:</strong> Your opinion matters! Don't forget to rate us after completing your internship so we can keep improving.</li></ul>`,
        videos: [{ title: "Intro", url: "https://youtu.be/tVzUXW6siu0?si=iqF7PQx6Zda79SUQ" }]
    },
    {
        title: "Java Development",
        domain: "Summer Internship",
        fee: 799,
        duration: "1,2,3,4,5 weeks",
        image: "https://i.pinimg.com/736x/ad/15/35/ad15356612a5e6ec17a16c4b07daa6e1.jpg",
        whatsappGroup: "https://chat.whatsapp.com/FnOncwIAGzH50AmeCSFCUr?mode=hqctcla",
        curriculum: ["Core Java", "Advanced Java", "Spring Boot", "Microservices", "Hibernate/JPA"],
        description: "Build robust enterprise applications using the power of Java.",
        details: `<h3>Welcome to CoreTern Internship!</h3><p>Start your journey with us to gain real-world skills and professional experience. Here is everything you need to know about the program:</p><h4>What You Will Get</h4><ul><li><strong>Student Dashboard:</strong> After you enroll, you will get access to a private dashboard to track your work and learn.</li><li><strong>Verified Certificate:</strong> Once you complete your internship, you can download your official certificate directly from your dashboard.</li><li><strong>WhatsApp Community:</strong> You will find a link to an exclusive WhatsApp group in your dashboard. Joining this group is very important for daily updates and guidance.</li><li><strong>Internship Report:</strong> You may also receive a performance report through the WhatsApp group to help you improve and track your progress.</li></ul><h4>Important Instructions</h4><ul><li><strong>Check Your Details:</strong> Please make sure your Full Name and Branch are correct during enrollment. These details will be used exactly as provided for your certificate.</li><li><strong>Need Help?</strong> If you face any issues, you can contact us through the website or message the Admin in your WhatsApp group.</li><li><strong>Share Your Feedback:</strong> Your opinion matters! Don't forget to rate us after completing your internship so we can keep improving.</li></ul>`,
        videos: [{ title: "Intro", url: "https://youtu.be/tVzUXW6siu0?si=iqF7PQx6Zda79SUQ" }]
    },
    {
        title: "C / C++ Programming",
        domain: "Summer Internship",
        fee: 799,
        duration: "1,2,3,4,5 weeks",
        image: "https://i.pinimg.com/736x/51/16/39/511639ed8370cb83211f49e0d8f04af2.jpg",
        whatsappGroup: "https://chat.whatsapp.com/FnOncwIAGzH50AmeCSFCUr?mode=hqctcla",
        curriculum: ["Data Structures", "Algorithms", "Object Oriented Programming", "Memory Management", "Competitive Programming"],
        description: "Strengthen your fundamentals with C/C++ which powers every modern system.",
        details: `<h3>Welcome to CoreTern Internship!</h3><p>Start your journey with us to gain real-world skills and professional experience. Here is everything you need to know about the program:</p><h4>What You Will Get</h4><ul><li><strong>Student Dashboard:</strong> After you enroll, you will get access to a private dashboard to track your work and learn.</li><li><strong>Verified Certificate:</strong> Once you complete your internship, you can download your official certificate directly from your dashboard.</li><li><strong>WhatsApp Community:</strong> You will find a link to an exclusive WhatsApp group in your dashboard. Joining this group is very important for daily updates and guidance.</li><li><strong>Internship Report:</strong> You may also receive a performance report through the WhatsApp group to help you improve and track your progress.</li></ul><h4>Important Instructions</h4><ul><li><strong>Check Your Details:</strong> Please make sure your Full Name and Branch are correct during enrollment. These details will be used exactly as provided for your certificate.</li><li><strong>Need Help?</strong> If you face any issues, you can contact us through the website or message the Admin in your WhatsApp group.</li><li><strong>Share Your Feedback:</strong> Your opinion matters! Don't forget to rate us after completing your internship so we can keep improving.</li></ul>`,
        videos: [{ title: "Intro", url: "https://youtu.be/tVzUXW6siu0?si=iqF7PQx6Zda79SUQ" }]
    },
    {
        title: "Data Science",
        domain: "Summer Internship",
        fee: 799,
        duration: "1,2,3,4,5 weeks",
        image: "https://i.pinimg.com/1200x/11/8d/48/118d48909bba9064aa8a52361fe99016.jpg",
        whatsappGroup: "https://chat.whatsapp.com/FnOncwIAGzH50AmeCSFCUr?mode=hqctcla",
        curriculum: ["Data Visualization", "Pandas & NumPy", "Statistical Analysis", "SQL", "Tableau/PowerBI"],
        description: "Turn raw data into meaningful insights using modern data science tools.",
        details: `<h3>Welcome to CoreTern Internship!</h3><p>Start your journey with us to gain real-world skills and professional experience. Here is everything you need to know about the program:</p><h4>What You Will Get</h4><ul><li><strong>Student Dashboard:</strong> After you enroll, you will get access to a private dashboard to track your work and learn.</li><li><strong>Verified Certificate:</strong> Once you complete your internship, you can download your official certificate directly from your dashboard.</li><li><strong>WhatsApp Community:</strong> You will find a link to an exclusive WhatsApp group in your dashboard. Joining this group is very important for daily updates and guidance.</li><li><strong>Internship Report:</strong> You may also receive a performance report through the WhatsApp group to help you improve and track your progress.</li></ul><h4>Important Instructions</h4><ul><li><strong>Check Your Details:</strong> Please make sure your Full Name and Branch are correct during enrollment. These details will be used exactly as provided for your certificate.</li><li><strong>Need Help?</strong> If you face any issues, you can contact us through the website or message the Admin in your WhatsApp group.</li><li><strong>Share Your Feedback:</strong> Your opinion matters! Don't forget to rate us after completing your internship so we can keep improving.</li></ul>`,
        videos: [{ title: "Intro", url: "https://youtu.be/tVzUXW6siu0?si=iqF7PQx6Zda79SUQ" }]
    },
    {
        title: "Cyber Security",
        domain: "Summer Internship",
        fee: 799,
        duration: "1,2,3,4,5 weeks",
        image: "https://i.pinimg.com/736x/cd/6f/a9/cd6fa98b64ed44a096fb555fbc065b28.jpg",
        whatsappGroup: "https://chat.whatsapp.com/FnOncwIAGzH50AmeCSFCUr?mode=hqctcla",
        curriculum: ["Network Security", "Ethical Hacking", "Cryptography", "Penetration Testing", "Vulnerability Assessment"],
        description: "Learn to secure systems and networks from cyber threats and vulnerabilities.",
        details: `<h3>Welcome to CoreTern Internship!</h3><p>Start your journey with us to gain real-world skills and professional experience. Here is everything you need to know about the program:</p><h4>What You Will Get</h4><ul><li><strong>Student Dashboard:</strong> After you enroll, you will get access to a private dashboard to track your work and learn.</li><li><strong>Verified Certificate:</strong> Once you complete your internship, you can download your official certificate directly from your dashboard.</li><li><strong>WhatsApp Community:</strong> You will find a link to an exclusive WhatsApp group in your dashboard. Joining this group is very important for daily updates and guidance.</li><li><strong>Internship Report:</strong> You may also receive a performance report through the WhatsApp group to help you improve and track your progress.</li></ul><h4>Important Instructions</h4><ul><li><strong>Check Your Details:</strong> Please make sure your Full Name and Branch are correct during enrollment. These details will be used exactly as provided for your certificate.</li><li><strong>Need Help?</strong> If you face any issues, you can contact us through the website or message the Admin in your WhatsApp group.</li><li><strong>Share Your Feedback:</strong> Your opinion matters! Don't forget to rate us after completing your internship so we can keep improving.</li></ul>`,
        videos: [{ title: "Intro", url: "https://youtu.be/tVzUXW6siu0?si=iqF7PQx6Zda79SUQ" }]
    },
    {
        title: "Graphic Design",
        domain: "Summer Internship",
        fee: 799,
        duration: "1,2,3,4,5 weeks",
        image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800",
        whatsappGroup: "https://chat.whatsapp.com/FnOncwIAGzH50AmeCSFCUr?mode=hqctcla",
        curriculum: ["Photoshop", "Illustrator", "Brand Identity", "Motion Graphics", "Typography"],
        description: "Bring your creativity to life with professional graphic design training.",
        details: `<h3>Welcome to CoreTern Internship!</h3><p>Start your journey with us to gain real-world skills and professional experience. Here is everything you need to know about the program:</p><h4>What You Will Get</h4><ul><li><strong>Student Dashboard:</strong> After you enroll, you will get access to a private dashboard to track your work and learn.</li><li><strong>Verified Certificate:</strong> Once you complete your internship, you can download your official certificate directly from your dashboard.</li><li><strong>WhatsApp Community:</strong> You will find a link to an exclusive WhatsApp group in your dashboard. Joining this group is very important for daily updates and guidance.</li><li><strong>Internship Report:</strong> You may also receive a performance report through the WhatsApp group to help you improve and track your progress.</li></ul><h4>Important Instructions</h4><ul><li><strong>Check Your Details:</strong> Please make sure your Full Name and Branch are correct during enrollment. These details will be used exactly as provided for your certificate.</li><li><strong>Need Help?</strong> If you face any issues, you can contact us through the website or message the Admin in your WhatsApp group.</li><li><strong>Share Your Feedback:</strong> Your opinion matters! Don't forget to rate us after completing your internship so we can keep improving.</li></ul>`,
        videos: [{ title: "Intro", url: "https://youtu.be/tVzUXW6siu0?si=iqF7PQx6Zda79SUQ" }]
    },
    {
        title: "AutoCAD Design",
        domain: "Summer Internship",
        fee: 799,
        duration: "1,2,3,4,5 weeks",
        image: "https://articles-img.sftcdn.net/t_article_cover_xl/auto-mapping-folder/sites/3/2023/03/Introduction-to-AutoCAD.jpg",
        whatsappGroup: "https://chat.whatsapp.com/FnOncwIAGzH50AmeCSFCUr?mode=hqctcla",
        curriculum: ["2D Drafting", "3D Modeling", "Architectural Drawings", "Mechanical Components", "Civil Engineering Designs"],
        description: "Master industry-standard computer-aided design for engineering and architecture.",
        details: `<h3>Welcome to CoreTern Internship!</h3><p>Start your journey with us to gain real-world skills and professional experience. Here is everything you need to know about the program:</p><h4>What You Will Get</h4><ul><li><strong>Student Dashboard:</strong> After you enroll, you will get access to a private dashboard to track your work and learn.</li><li><strong>Verified Certificate:</strong> Once you complete your internship, you can download your official certificate directly from your dashboard.</li><li><strong>WhatsApp Community:</strong> You will find a link to an exclusive WhatsApp group in your dashboard. Joining this group is very important for daily updates and guidance.</li><li><strong>Internship Report:</strong> You may also receive a performance report through the WhatsApp group to help you improve and track your progress.</li></ul><h4>Important Instructions</h4><ul><li><strong>Check Your Details:</strong> Please make sure your Full Name and Branch are correct during enrollment. These details will be used exactly as provided for your certificate.</li><li><strong>Need Help?</strong> If you face any issues, you can contact us through the website or message the Admin in your WhatsApp group.</li><li><strong>Share Your Feedback:</strong> Your opinion matters! Don't forget to rate us after completing your internship so we can keep improving.</li></ul>`,
        videos: [{ title: "Intro", url: "https://youtu.be/tVzUXW6siu0?si=iqF7PQx6Zda79SUQ" }]
    }
];

const seedInternships = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected to seed internships...');

        for (const data of internships) {
            // Use findOneAndUpdate to update existing records with the same title or create new ones
            await Internship.findOneAndUpdate(
                { title: data.title },
                data,
                { upsert: true, new: true }
            );
            console.log(`Updated/Added: ${data.title}`);
        }

        console.log('All internships updated with cover images successfully!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedInternships();
