import { NextResponse } from 'next/server';

/**
 * Standard success response
 */
export function successResponse(data, status = 200) {
    return NextResponse.json({ success: true, ...data }, { status });
}

/**
 * Standard error response
 */
export function errorResponse(message, status = 500) {
    return NextResponse.json({ success: false, error: message }, { status });
}

/**
 * Handle API errors (replaces Express error middleware)
 */
export function handleApiError(err) {
    console.error(err.stack || err);

    let message = err.message || 'Server Error';
    let statusCode = err.statusCode || 500;

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        message = `Resource not found with id of ${err.value}`;
        statusCode = 404;
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        message = 'Duplicate field value entered';
        statusCode = 400;
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        message = Object.values(err.errors).map(val => val.message).join(', ');
        statusCode = 400;
    }

    return errorResponse(message, statusCode);
}
