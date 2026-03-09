const express = require('express');
const {
    issueCertificate,
    verifyCertificate,
    getMyCertificates,
    issueManualCertificate,
    getManualCertificates
} = require('../controllers/certificateController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, authorize('admin'), issueCertificate);
router.post('/manual', protect, authorize('admin'), issueManualCertificate);
router.get('/manual', protect, authorize('admin'), getManualCertificates);
router.get('/my', protect, getMyCertificates);
router.get('/verify/:id', verifyCertificate);

module.exports = router;
