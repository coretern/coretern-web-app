const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

// Load env vars
dotenv.config();

const app = express();

// Body parser
// Refreshing server to apply .env changes
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Enable CORS
const parseOrigins = (urlStr) => {
    if (!urlStr) return [];
    return urlStr.split(',').map(url => url.trim());
};

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    ...parseOrigins(process.env.FRONTEND_URL),
    ...parseOrigins(process.env.ADMIN_URL)
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Static folder for uploads if not using Cloudinary for everything
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Simple test route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Define Routes
app.use('/api/internships', require('./routes/internships'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/enrollments', require('./routes/enrollments'));
app.use('/api/certificates', require('./routes/certificates'));
app.use('/api/users', require('./routes/users'));
app.use('/api/tickets', require('./routes/tickets'));

// Error Handler Middleware
app.use(require('./middleware/error'));

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB Connected...');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err.message);
        // Still start the server for now so user can see it's alive, but it will error on DB calls
        if (process.env.NODE_ENV !== 'production') {
            app.listen(PORT, () => console.log(`Server running on port ${PORT} (DB Connection Failed)`));
        }
    });
