const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('express-async-handler');
const Ticket = require('../models/Ticket');
const crypto = require('crypto');

// @desc    Create new ticket
// @route   POST /api/tickets
// @access  Public
exports.createTicket = asyncHandler(async (req, res, next) => {
    const { name, email, phone, subject, message } = req.body;

    const ticketId = `TS-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    const ticketData = {
        ticketId,
        subject,
        type: req.user ? 'registered' : 'guest',
        conversation: [{
            sender: 'user',
            message: message
        }]
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

// @desc    Get my tickets
// @route   GET /api/tickets/my
// @access  Private
exports.getMyTickets = asyncHandler(async (req, res, next) => {
    const tickets = await Ticket.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: tickets.length,
        data: tickets
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

// @desc    Get single ticket
// @route   GET /api/tickets/:id
// @access  Private
exports.getTicket = asyncHandler(async (req, res, next) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
        return next(new ErrorResponse(`No ticket with id ${req.params.id}`, 404));
    }

    // Check if user owns ticket or is admin
    if (req.user.role !== 'admin' && ticket.user?.toString() !== req.user.id) {
        return next(new ErrorResponse('Not authorized to access this ticket', 401));
    }

    res.status(200).json({
        success: true,
        data: ticket
    });
});

// @desc    Add reply to ticket
// @route   PUT /api/tickets/:id/reply
// @access  Private
exports.replyToTicket = asyncHandler(async (req, res, next) => {
    const { message } = req.body;
    let ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
        return next(new ErrorResponse(`No ticket with id ${req.params.id}`, 404));
    }

    // Check auth
    if (req.user.role !== 'admin' && ticket.user?.toString() !== req.user.id) {
        return next(new ErrorResponse('Not authorized to reply to this ticket', 401));
    }

    const sender = req.user.role === 'admin' ? 'admin' : 'user';

    ticket = await Ticket.findByIdAndUpdate(req.params.id, {
        $push: { conversation: { sender, message } },
        status: req.user.role === 'admin' ? 'pending' : 'open'
    }, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: ticket
    });
});

// @desc    Update ticket status
// @route   PUT /api/tickets/:id/status
// @access  Private/Admin
exports.updateTicketStatus = asyncHandler(async (req, res, next) => {
    let ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
        return next(new ErrorResponse(`No ticket with id ${req.params.id}`, 404));
    }

    ticket = await Ticket.findByIdAndUpdate(req.params.id, { status: req.body.status }, {
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
