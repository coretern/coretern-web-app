const express = require('express');
const {
    enroll,
    getMyEnrollments,
    verifyPayment,
    updateToPaid,
    getAllEnrollments
} = require('../controllers/enrollmentController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../utils/upload');

const router = express.Router();

router.use(protect);

router.post('/', upload.single('resume'), enroll);
router.get('/my', getMyEnrollments);
router.get('/verify/:orderId', verifyPayment);

router.get('/', authorize('admin'), getAllEnrollments);
router.put('/:id/pay', authorize('admin'), updateToPaid);

module.exports = router;
