const express = require('express');
const { getAllUsers, deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes here should be protected and only for admins
router.use(protect);
router.use(authorize('admin'));

router.get('/', getAllUsers);
router.delete('/:id', deleteUser);

module.exports = router;
