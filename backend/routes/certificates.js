const express = require('express');
const {
    issueCertificate,
    verifyCertificate,
    getMyCertificates
} = require('../controllers/certificateController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, authorize('admin'), issueCertificate);
router.get('/my', protect, getMyCertificates);
router.get('/verify/:id', verifyCertificate);

module.exports = router;
