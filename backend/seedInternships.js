const seedInternships = async () => {
    const internships = [
        {
            title: 'Full Stack Web Development',
            description: 'Master the art of building scalable web applications using the MERN stack. Learn React, Node.js, Express, and MongoDB through real-world projects.',
            domain: 'Summer Internship',
            duration: '8 Weeks',
            fee: 4999,
            curriculum: ['HTML/CSS/JS', 'React & Vite', 'Node.js & Express', 'MongoDB Atlas', 'Deployment'],
            image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800',
            paymentLink: 'https://payments.cashfree.com/forms?code=web-dev-internship'
        },
        {
            title: 'AI & Machine Learning',
            description: 'Dive into the world of Artificial Intelligence. Learn Python, Data Analysis, Neural Networks, and how to integrate LLMs into modern applications.',
            domain: 'Summer Internship',
            duration: '10 Weeks',
            fee: 5999,
            curriculum: ['Python Basics', 'Pandas & NumPy', 'Supervised Learning', 'Neural Networks', 'Project: AI Chatbot'],
            image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800'
        },
        {
            title: 'Mobile App Development',
            description: 'Build native-performing cross-platform mobile apps for iOS and Android using React Native. Learn mobile design principles and API integration.',
            domain: 'Summer Internship',
            duration: '6 Weeks',
            fee: 4499,
            curriculum: ['React Native Core', 'Navigation', 'Native Components', 'State Management', 'App Store Prep'],
            image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800'
        }
    ];

    for (const intern of internships) {
        try {
            const response = await fetch('http://localhost:5000/api/internships', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5OWYxNGU3N2Q4ZDNjOTgyYjA1YWNlYiIsImlhdCI6MTc3MjAzMzI1NSwiZXhwIjoxNzc0NjI1MjU1fQ.0Jc2MkTG8-xWtUEg93sr_OfZdzl4FUi34_J6jSFV0tM' // Token from previous step
                },
                body: JSON.stringify(intern)
            });
            const data = await response.json();
            if (response.ok) {
                console.log(`Success: Created ${intern.title}`);
            } else {
                console.error(`Error: Failed to create ${intern.title}`, data);
            }
        } catch (error) {
            console.error(`Fetch Error: ${error.message}`);
        }
    }
};

seedInternships();
