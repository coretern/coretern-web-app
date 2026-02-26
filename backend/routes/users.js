const express = require('express');
const { getAllUsers, deleteUser, toggleUserStatus, impersonateUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes here should be protected and only for admins
router.use(protect);
router.use(authorize('admin'));

router.get('/', getAllUsers);
router.post('/:id/impersonate', impersonateUser);
router.put('/:id/toggle-status', toggleUserStatus);
router.delete('/:id', deleteUser);

module.exports = router;
