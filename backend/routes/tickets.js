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

// Protected routes (User)
router.get('/my', protect, getMyTickets);
router.get('/:id', protect, getTicket);
router.put('/:id/reply', protect, replyToTicket);

// Admin-only routes
router.use(protect);
router.use(authorize('admin'));

router.get('/', getTickets);
router.put('/:id/status', updateTicketStatus);
router.delete('/:id', deleteTicket);

module.exports = router;
