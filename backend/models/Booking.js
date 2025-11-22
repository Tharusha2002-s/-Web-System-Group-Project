// ============================================
// models/Booking.js - Booking Model
// ============================================
const database = require('../config/db');

class BookingModel {
    async create(bookingData) {
        try {
            console.log('💾 Creating booking:', bookingData);

            const {
                user_id, vehicle_id, start_date, end_date, 
                total_days, total_amount, status = 'pending', 
                payment_status = 'pending'
            } = bookingData;

            const sql = `
                INSERT INTO bookings (
                    user_id, vehicle_id, start_date, end_date, 
                    total_days, total_amount, status, payment_status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const result = await database.query(sql, [
                user_id, vehicle_id, start_date, end_date,
                total_days, total_amount, status, payment_status
            ]);

            console.log('✅ Booking created with ID:', result.insertId);
            return result.insertId;
        } catch (error) {
            console.error('💥 Database error in create booking:', error);
            throw error;
        }
    }

    async findAll() {
        try {
            console.log('📋 Fetching all bookings');
            
            const sql = `
                SELECT 
                    b.id, b.user_id, b.vehicle_id, b.start_date, b.end_date,
                    b.total_days, b.total_amount, b.status, b.payment_status,
                    b.created_at, b.updated_at,
                    u.name as user_name, u.email as user_email,
                    v.name as vehicle_name, v.type as vehicle_type,
                    v.brand as vehicle_brand, v.model as vehicle_model
                FROM bookings b
                LEFT JOIN users u ON b.user_id = u.id
                LEFT JOIN vehicles v ON b.vehicle_id = v.id
                ORDER BY b.created_at DESC
            `;
            
            const results = await database.query(sql);
            console.log(`✅ Found ${results.length} bookings`);
            return results;
        } catch (error) {
            console.error('💥 Database error in findAll bookings:', error);
            throw error;
        }
    }

    async findById(id) {
        try {
            const sql = `
                SELECT 
                    b.*,
                    u.name as user_name, u.email as user_email,
                    v.name as vehicle_name, v.type as vehicle_type,
                    v.brand as vehicle_brand, v.model as vehicle_model
                FROM bookings b
                LEFT JOIN users u ON b.user_id = u.id
                LEFT JOIN vehicles v ON b.vehicle_id = v.id
                WHERE b.id = ?
            `;
            const results = await database.query(sql, [id]);
            return results[0] || null;
        } catch (error) {
            console.error('💥 Database error in findById booking:', error);
            throw error;
        }
    }

    async updateStatus(id, status) {
        try {
            const sql = `
                UPDATE bookings 
                SET status = ?, updated_at = CURRENT_TIMESTAMP 
                WHERE id = ?
            `;
            const result = await database.query(sql, [status, id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('💥 Database error in updateStatus:', error);
            throw error;
        }
    }

    async updatePaymentStatus(id, payment_status) {
        try {
            const sql = `
                UPDATE bookings 
                SET payment_status = ?, updated_at = CURRENT_TIMESTAMP 
                WHERE id = ?
            `;
            const result = await database.query(sql, [payment_status, id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('💥 Database error in updatePaymentStatus:', error);
            throw error;
        }
    }

    async findByUserId(user_id) {
        try {
            const sql = `
                SELECT 
                    b.*,
                    v.name as vehicle_name, v.type as vehicle_type,
                    v.brand as vehicle_brand, v.model as vehicle_model
                FROM bookings b
                LEFT JOIN vehicles v ON b.vehicle_id = v.id
                WHERE b.user_id = ?
                ORDER BY b.created_at DESC
            `;
            const results = await database.query(sql, [user_id]);
            return results;
        } catch (error) {
            console.error('💥 Database error in findByUserId:', error);
            throw error;
        }
    }

    async delete(id) {
        try {
            const sql = 'DELETE FROM bookings WHERE id = ?';
            const result = await database.query(sql, [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('💥 Database error in delete booking:', error);
            throw error;
        }
    }
}

module.exports = new BookingModel();