// ============================================
// routes/booking.routes.js - Booking Routes
// ============================================
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/auth.middleware');
const { validateCreateBooking, validateBookingId, validateUpdateStatus } = require('../middleware/bookingValidator');

// Public routes
router.post('/', validateCreateBooking, bookingController.createBooking);
router.get('/user/:userId', bookingController.getBookingsByUserId);

// Protected routes (require authentication)
router.use(authMiddleware.authenticateToken);

// Admin only routes
router.get('/', authMiddleware.requireAdmin, bookingController.getAllBookings);
router.get('/:id', validateBookingId, bookingController.getBookingById);
router.put('/:id/status', validateBookingId, validateUpdateStatus, authMiddleware.requireAdmin, bookingController.updateBookingStatus);
router.put('/:id/payment-status', validateBookingId, authMiddleware.requireAdmin, bookingController.updatePaymentStatus);
router.delete('/:id', validateBookingId, authMiddleware.requireAdmin, bookingController.deleteBooking);

module.exports = router;