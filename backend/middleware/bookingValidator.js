// ============================================
// middleware/bookingValidator.js - Booking Validation
// ============================================
const { body, param } = require('express-validator');

const validateCreateBooking = [
    body('vehicle_id')
        .isInt({ min: 1 })
        .withMessage('Valid vehicle ID is required'),
    
    body('start_date')
        .isISO8601()
        .withMessage('Valid start date is required'),
    
    body('end_date')
        .isISO8601()
        .withMessage('Valid end date is required'),
    
    body('total_days')
        .isInt({ min: 1 })
        .withMessage('Valid total days is required'),
    
    body('total_amount')
        .isFloat({ min: 0 })
        .withMessage('Valid total amount is required')
];

const validateUpdateStatus = [
    body('status')
        .isIn(['pending', 'confirmed', 'active', 'completed', 'cancelled'])
        .withMessage('Valid status is required')
];

const validateBookingId = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Valid booking ID is required')
];

module.exports = {
    validateCreateBooking,
    validateUpdateStatus,
    validateBookingId
};