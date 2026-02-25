const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected to create admin...');

        const adminEmail = 'admin@techstart.com';
        const adminPassword = 'adminpassword123';

        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log('Admin already exists. Updating password...');
            existingAdmin.password = adminPassword;
            await existingAdmin.save();
            console.log('Admin password updated successfully.');
        } else {
            await User.create({
                name: 'System Admin',
                email: adminEmail,
                password: adminPassword,
                role: 'admin',
                phone: '1234567890'
            });
            console.log('Admin user created successfully.');
        }

        console.log('-----------------------------------');
        console.log('DEMO ADMIN CREDENTIALS:');
        console.log('Email: admin@techstart.com');
        console.log('Password: adminpassword123');
        console.log('-----------------------------------');

        process.exit();
    } catch (err) {
        console.error('Error creating admin:', err);
        process.exit(1);
    }
};

createAdmin();
