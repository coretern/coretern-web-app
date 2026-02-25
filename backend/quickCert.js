const mongoose = require('mongoose');
const User = require('./models/User');
const Internship = require('./models/Internship');
const Enrollment = require('./models/Enrollment');
const Certificate = require('./models/Certificate');
const dotenv = require('dotenv');

dotenv.config();

const issue = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOne({ name: /Adiya/i });
        const internship = await Internship.findOne();

        if (!user || !internship) {
            console.log("Missing user or internship");
            process.exit(1);
        }

        const certId = 'TS-' + Math.random().toString(36).substr(2, 6).toUpperCase();

        const cert = new Certificate({
            user: user._id,
            internship: internship._id,
            certificateId: certId,
            verificationUrl: `http://localhost:5173/verify/${certId}`
        });

        await cert.save();
        console.log(`CERT_SUCCESS: ${certId}`);
        process.exit(0);
    } catch (err) {
        console.error("CERT_ERROR:", err.message);
        process.exit(1);
    }
};

issue();
