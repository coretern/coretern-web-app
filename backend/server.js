const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

// Load env vars
dotenv.config();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

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
