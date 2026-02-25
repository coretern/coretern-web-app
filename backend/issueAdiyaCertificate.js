const mongoose = require('mongoose');
const User = require('./models/User');
const Internship = require('./models/Internship');
const Enrollment = require('./models/Enrollment');
const Certificate = require('./models/Certificate');
const dotenv = require('dotenv');

dotenv.config();

const issueDummyCertificate = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        // 1. Find the user
        const user = await User.findOne({ name: /Adiya Bhai/i });
        if (!user) {
            console.error('User "Adiya Bhai" not found');
            process.exit(1);
        }
        console.log(`Found User: ${user.name} (${user._id})`);

        // 2. Find any internship
        const internship = await Internship.findOne();
        if (!internship) {
            console.error('No internships found');
            process.exit(1);
        }
        console.log(`Found Internship: ${internship.title} (${internship._id})`);

        // 3. Create/Update enrollment as completed
        let enrollment = await Enrollment.findOne({ user: user._id, internship: internship._id });
        if (!enrollment) {
            enrollment = await Enrollment.create({
                user: user._id,
                internship: internship._id,
                status: 'completed',
                paymentStatus: 'paid'
            });
            console.log('Created completed enrollment');
        } else {
            enrollment.status = 'completed';
            await enrollment.save();
            console.log('Updated existing enrollment to completed');
        }

        // 4. Issue Certificate
        const certificateId = `TS-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        const certificate = await Certificate.create({
            user: user._id,
            internship: internship._id,
            certificateId,
            issueDate: new Date()
        });

        console.log('--- CERTIFICATE ISSUED ---');
        console.log(`ID: ${certificate.certificateId}`);
        console.log(`URL: http://localhost:5173/verify/${certificate.certificateId}`);
        console.log('---------------------------');

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.connection.close();
        process.exit();
    }
};

issueDummyCertificate();
