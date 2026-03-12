const express = require('express');
const { getConfig, updateConfig } = require('../controllers/configController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(getConfig)
    .put(protect, authorize('admin'), updateConfig);

module.exports = router;
