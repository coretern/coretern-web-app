const express = require('express');
const {
    getInternships,
    getInternship,
    createInternship,
    updateInternship,
    deleteInternship
} = require('../controllers/internshipController');

const { protect, authorize } = require('../middleware/auth');

const upload = require('../utils/upload');

const router = express.Router();

router
    .route('/')
    .get(getInternships)
    .post(protect, authorize('admin'), upload.single('image'), createInternship);

router
    .route('/:id')
    .get(getInternship)
    .put(protect, authorize('admin'), upload.single('image'), updateInternship)
    .delete(protect, authorize('admin'), deleteInternship);

module.exports = router;
