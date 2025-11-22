// ============================================
// controllers/bookingController.js - Booking Controller
// ============================================
const BookingModel = require('../models/Booking');
const { sendResponse, sendError } = require('../utils/responseHandler');
const { validationResult } = require('express-validator');

const bookingController = {
    // Create new booking
    createBooking: async (req, res) => {
        try {
            console.log('➕ Creating new booking:', req.body);

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return sendError(res, 'Validation failed', 400, errors.array());
            }

            const {
                user_id, vehicle_id, start_date, end_date, 
                total_days, total_amount, status, payment_status
            } = req.body;

            // For demo purposes, if user_id is not provided, use a default
            const finalUserId = user_id || 1; // Default user ID for demo

            const bookingId = await BookingModel.create({
                user_id: finalUserId,
                vehicle_id,
                start_date,
                end_date,
                total_days,
                total_amount,
                status: status || 'pending',
                payment_status: payment_status || 'pending'
            });

            console.log('✅ Booking created with ID:', bookingId);

            // Return the created booking data
            const newBooking = await BookingModel.findById(bookingId);
            
            return sendResponse(res, 'Booking created successfully', {
                booking: newBooking
            }, 201);

        } catch (error) {
            console.error('💥 Error creating booking:', error);
            return sendError(res, 'Failed to create booking: ' + error.message, 500);
        }
    },

    // Get all bookings (for admin)
    getAllBookings: async (req, res) => {
        try {
            console.log('📋 Fetching all bookings');
            
            const bookings = await BookingModel.findAll();
            
            return sendResponse(res, 'Bookings fetched successfully', {
                bookings: bookings,
                total: bookings.length
            });

        } catch (error) {
            console.error('💥 Error fetching bookings:', error);
            return sendError(res, 'Failed to fetch bookings', 500);
        }
    },

    // Get booking by ID
    getBookingById: async (req, res) => {
        try {
            const { id } = req.params;
            console.log(`📋 Fetching booking with ID: ${id}`);

            const booking = await BookingModel.findById(id);
            if (!booking) {
                return sendError(res, 'Booking not found', 404);
            }

            return sendResponse(res, 'Booking fetched successfully', {
                booking: booking
            });

        } catch (error) {
            console.error('💥 Error fetching booking:', error);
            return sendError(res, 'Failed to fetch booking', 500);
        }
    },

    // Get bookings by user ID
    getBookingsByUserId: async (req, res) => {
        try {
            const { userId } = req.params;
            console.log(`📋 Fetching bookings for user ID: ${userId}`);

            const bookings = await BookingModel.findByUserId(userId);
            
            return sendResponse(res, 'User bookings fetched successfully', {
                bookings: bookings,
                total: bookings.length
            });

        } catch (error) {
            console.error('💥 Error fetching user bookings:', error);
            return sendError(res, 'Failed to fetch user bookings', 500);
        }
    },

    // Update booking status
    updateBookingStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            console.log(`✏️ Updating booking status for ID: ${id} to: ${status}`);

            if (!status) {
                return sendError(res, 'Status is required', 400);
            }

            const validStatuses = ['pending', 'confirmed', 'active', 'completed', 'cancelled'];
            if (!validStatuses.includes(status)) {
                return sendError(res, 'Invalid status', 400);
            }

            const updated = await BookingModel.updateStatus(id, status);
            if (!updated) {
                return sendError(res, 'Booking not found or update failed', 404);
            }

            const updatedBooking = await BookingModel.findById(id);
            
            return sendResponse(res, 'Booking status updated successfully', {
                booking: updatedBooking
            });

        } catch (error) {
            console.error('💥 Error updating booking status:', error);
            return sendError(res, 'Failed to update booking status', 500);
        }
    },

    // Update payment status
    updatePaymentStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { payment_status } = req.body;

            console.log(`💳 Updating payment status for booking ID: ${id} to: ${payment_status}`);

            if (!payment_status) {
                return sendError(res, 'Payment status is required', 400);
            }

            const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded'];
            if (!validPaymentStatuses.includes(payment_status)) {
                return sendError(res, 'Invalid payment status', 400);
            }

            const updated = await BookingModel.updatePaymentStatus(id, payment_status);
            if (!updated) {
                return sendError(res, 'Booking not found or update failed', 404);
            }

            const updatedBooking = await BookingModel.findById(id);
            
            return sendResponse(res, 'Payment status updated successfully', {
                booking: updatedBooking
            });

        } catch (error) {
            console.error('💥 Error updating payment status:', error);
            return sendError(res, 'Failed to update payment status', 500);
        }
    },

    // Delete booking
    deleteBooking: async (req, res) => {
        try {
            const { id } = req.params;
            console.log(`🗑️ Deleting booking with ID: ${id}`);

            const deleted = await BookingModel.delete(id);
            if (!deleted) {
                return sendError(res, 'Booking not found or delete failed', 404);
            }

            return sendResponse(res, 'Booking deleted successfully');

        } catch (error) {
            console.error('💥 Error deleting booking:', error);
            return sendError(res, 'Failed to delete booking', 500);
        }
    }
};

module.exports = bookingController;