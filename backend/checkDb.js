const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Internship = require('./models/Internship');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        const count = await Internship.countDocuments();
        console.log(`Total Internships: ${count}`);

        const activeCount = await Internship.countDocuments({ active: true });
        console.log(`Active Internships: ${activeCount}`);

        const all = await Internship.find();
        all.forEach(i => {
            console.log(`ID: ${i._id} | Title: ${i.title} | Fee: ${i.fee}`);
        });

        process.exit();
    })
    .catch(err => {
        console.error('Connection error:', err);
        process.exit(1);
    });
