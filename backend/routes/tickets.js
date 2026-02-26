const express = require('express');
const { createTicket, getTickets, updateTicket, deleteTicket } = require('../controllers/ticketController');
const { protect, authorize, identifyUser } = require('../middleware/auth');

const router = express.Router();

// Allow public to create tickets, but check if they are logged in
router.post('/', identifyUser, createTicket);

// Admin-only routes
router.use(protect);
router.use(authorize('admin'));

router.get('/', getTickets);
router.put('/:id', updateTicket);
router.delete('/:id', deleteTicket);

module.exports = router;
