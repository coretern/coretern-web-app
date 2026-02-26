const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('express-async-handler');
const Ticket = require('../models/Ticket');
const crypto = require('crypto');

// @desc    Create new ticket
// @route   POST /api/tickets
// @access  Public
exports.createTicket = asyncHandler(async (req, res, next) => {
    const { name, email, phone, subject, message } = req.body;

    // Generate unique ticket ID: TS-XXXX-XXXX
    const ticketId = `TS-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    const ticketData = {
        ticketId,
        subject,
        message,
        type: req.user ? 'registered' : 'guest'
    };

    if (req.user) {
        ticketData.user = req.user.id;
        ticketData.name = req.user.name;
        ticketData.email = req.user.email;
        ticketData.phone = req.user.phone || 'N/A';
    } else {
        ticketData.name = name;
        ticketData.email = email;
        ticketData.phone = phone;
    }

    const ticket = await Ticket.create(ticketData);

    res.status(201).json({
        success: true,
        data: ticket
    });
});

// @desc    Get all tickets
// @route   GET /api/tickets
// @access  Private/Admin
exports.getTickets = asyncHandler(async (req, res, next) => {
    const tickets = await Ticket.find().sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: tickets.length,
        data: tickets
    });
});

// @desc    Update ticket status
// @route   PUT /api/tickets/:id
// @access  Private/Admin
exports.updateTicket = asyncHandler(async (req, res, next) => {
    let ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
        return next(new ErrorResponse(`No ticket with id ${req.params.id}`, 404));
    }

    ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: ticket
    });
});

// @desc    Delete ticket
// @route   DELETE /api/tickets/:id
// @access  Private/Admin
exports.deleteTicket = asyncHandler(async (req, res, next) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
        return next(new ErrorResponse(`No ticket with id ${req.params.id}`, 404));
    }

    await ticket.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});
