const express = require('express');
const {
    enroll,
    getMyEnrollments,
    verifyPayment,
    cashfreeWebhook,
    updateToPaid,
    getAllEnrollments,
    submitReview,
    getInternshipReviews
} = require('../controllers/enrollmentController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../utils/upload');

const router = express.Router();

router.post('/webhook', cashfreeWebhook); // Public route for Cashfree
router.get('/reviews/:internshipId', getInternshipReviews); // Public reviews route

router.use(protect);

router.post('/', upload.single('resume'), enroll);
router.get('/my', getMyEnrollments);
router.get('/verify/:orderId', verifyPayment);

router.get('/', authorize('admin'), getAllEnrollments);
router.put('/:id/pay', authorize('admin'), updateToPaid);

router.post('/:id/review', submitReview);

module.exports = router;
