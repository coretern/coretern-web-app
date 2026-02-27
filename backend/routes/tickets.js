const express = require('express');
const {
    createTicket,
    getTickets,
    getMyTickets,
    getTicket,
    replyToTicket,
    updateTicketStatus,
    deleteTicket
} = require('../controllers/ticketController');
const { protect, authorize, identifyUser } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/', identifyUser, createTicket);

// User-specific routes
router.get('/my', protect, getMyTickets);
router.get('/:id', protect, getTicket);
router.put('/:id/reply', protect, replyToTicket);

// Admin-specific routes
// Use protect and authorize ONLY for the routes defined below
router.get('/', protect, authorize('admin'), getTickets);
router.put('/:id/status', protect, authorize('admin'), updateTicketStatus);
router.delete('/:id', protect, authorize('admin'), deleteTicket);

module.exports = router;
