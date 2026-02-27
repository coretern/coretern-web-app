const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '../.env') });

const createAdmin = async () => {
    try {
        // 1. Read the secret you provided in the terminal (node seed-admin.js <SECRET>)
        const providedSecret = process.argv[2];

        // 2. Read the "Truth" from your private .env file
        const envSecret = process.env.SEED_SECRET;

        // 3. Compare them. Notice NO hardcoded strings here!
        if (!providedSecret || !envSecret || providedSecret !== envSecret) {
            console.error('❌ SECURITY ERROR: Invalid or missing secret key.');
            console.log('Usage: node seed-admin.js <YOUR_PRIVATE_SECRET>');
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Security Warning for Production
        if (process.env.NODE_ENV === 'production') {
            console.log('⚠️  WARNING: Running seed script in PRODUCTION mode.');
        }

        const adminEmail = process.env.SEED_ADMIN_EMAIL;
        const adminPassword = process.env.SEED_ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
            console.error('❌ Error: SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be in .env');
            process.exit(1);
        }

        // Create/Update Admin
        let admin = await User.findOne({ email: adminEmail });

        if (admin) {
            console.log(`Admin ${adminEmail} already exists. Updating permissions...`);
            admin.role = 'admin';
            admin.isVerified = true;
            admin.status = 'active';
            await admin.save();
        } else {
            console.log(`Creating new Admin: ${adminEmail}`);
            admin = await User.create({
                name: 'System Admin',
                email: adminEmail,
                password: adminPassword,
                role: 'admin',
                isVerified: true,
                status: 'active'
            });
            console.log('New Admin created successfully!');
        }

        console.log('✅ Admin account is ready.');
        process.exit();
    } catch (err) {
        console.error('❌ Error:', err.message);  
        process.exit(1);
    }
};

createAdmin();
