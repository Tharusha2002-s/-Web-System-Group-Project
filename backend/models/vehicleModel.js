// ============================================
// models/vehicleModel.js - FIXED FEATURES HANDLING
// ============================================
const database = require('../config/db');

class VehicleModel {
    async findAll() {
        try {
            console.log('📋 Fetching all vehicles');
            
            const sql = `
                SELECT 
                    id, name, type, brand, model, year, capacity,
                    fuel_type, transmission, price_per_day, price_per_hour,
                    color, license_plate, daily_rate, hourly_rate,
                    is_available, location, description, features, images,
                    created_at, updated_at
                FROM vehicles 
                ORDER BY created_at DESC
            `;
            
            const results = await database.query(sql);
            console.log(`✅ Found ${results.length} vehicles`);
            return results;
        } catch (error) {
            console.error('Database error in findAll:', error);
            throw error;
        }
    }

    async findById(id) {
        try {
            const sql = `
                SELECT 
                    id, name, type, brand, model, year, capacity,
                    fuel_type, transmission, price_per_day, price_per_hour,
                    color, license_plate, daily_rate, hourly_rate,
                    is_available, location, description, features, images,
                    created_at, updated_at
                FROM vehicles 
                WHERE id = ?
            `;
            const results = await database.query(sql, [id]);
            return results[0] || null;
        } catch (error) {
            console.error('Database error in findById:', error);
            throw error;
        }
    }

    async create(vehicleData) {
        try {
            console.log('💾 Creating vehicle in database:', vehicleData);

            const {
                name, type, brand, model, year, capacity,
                fuel_type, transmission, price_per_day, price_per_hour,
                color, license_plate, daily_rate, hourly_rate,
                is_available, location, description, features
            } = vehicleData;

            // Handle features safely - convert to JSON string if it's an array/object
            let featuresValue = null;
            if (features) {
                if (typeof features === 'string') {
                    // If it's already a string, use it as is
                    featuresValue = features;
                } else {
                    // If it's an array or object, convert to JSON string
                    try {
                        featuresValue = JSON.stringify(features);
                    } catch (e) {
                        console.warn('⚠️ Could not stringify features, using as string:', features);
                        featuresValue = String(features);
                    }
                }
                
                // Limit features length to prevent constraint issues
                if (featuresValue.length > 10000) {
                    console.warn('⚠️ Features too long, truncating');
                    featuresValue = featuresValue.substring(0, 10000);
                }
            }

            const sql = `
                INSERT INTO vehicles (
                    name, type, brand, model, year, capacity,
                    fuel_type, transmission, price_per_day, price_per_hour,
                    color, license_plate, daily_rate, hourly_rate,
                    is_available, location, description, features
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const params = [
                name, type, brand, model, year, capacity || 5,
                fuel_type || null, transmission || null, 
                Math.max(0, price_per_day), // Ensure non-negative
                price_per_hour ? Math.max(0, price_per_hour) : null,
                color || null, license_plate || null, 
                Math.max(0, daily_rate || price_per_day), 
                Math.max(0, hourly_rate || price_per_hour || (price_per_day / 24)),
                is_available !== undefined ? (is_available ? 1 : 0) : 1, 
                location || null, description || null, featuresValue
            ];

            console.log('📊 SQL Parameters:', params);

            const result = await database.query(sql, params);

            console.log('✅ Vehicle created with ID:', result.insertId);
            return result.insertId;
        } catch (error) {
            console.error('💥 Database error in create:', error);
            console.error('📝 Error details:', {
                message: error.message,
                sqlState: error.sqlState,
                errno: error.errno,
                code: error.code
            });
            throw error;
        }
    }

    async update(id, vehicleData) {
        try {
            console.log(`💾 Updating vehicle ${id} in database:`, vehicleData);

            const {
                name, type, brand, model, year, capacity,
                fuel_type, transmission, price_per_day, price_per_hour,
                color, license_plate, daily_rate, hourly_rate,
                is_available, location, description, features
            } = vehicleData;

            // Check if vehicle exists
            const existingVehicle = await this.findById(id);
            if (!existingVehicle) {
                throw new Error('Vehicle not found');
            }

            // Handle features safely
            let featuresValue = null;
            if (features) {
                if (typeof features === 'string') {
                    featuresValue = features;
                } else {
                    try {
                        featuresValue = JSON.stringify(features);
                    } catch (e) {
                        console.warn('⚠️ Could not stringify features, using as string:', features);
                        featuresValue = String(features);
                    }
                }
                
                // Limit features length
                if (featuresValue.length > 10000) {
                    console.warn('⚠️ Features too long, truncating');
                    featuresValue = featuresValue.substring(0, 10000);
                }
            }

            // Build dynamic SQL to avoid setting null for columns that might have constraints
            const updates = [];
            const params = [];

            // Always update these fields
            updates.push('name = ?, type = ?, brand = ?, model = ?, year = ?');
            params.push(name, type, brand, model, year);

            updates.push('capacity = ?, fuel_type = ?, transmission = ?');
            params.push(capacity || 5, fuel_type || null, transmission || null);

            updates.push('price_per_day = ?, price_per_hour = ?');
            params.push(Math.max(0, price_per_day), price_per_hour ? Math.max(0, price_per_hour) : null);

            updates.push('color = ?, license_plate = ?');
            params.push(color || null, license_plate || null);

            updates.push('daily_rate = ?, hourly_rate = ?');
            params.push(Math.max(0, daily_rate || price_per_day), Math.max(0, hourly_rate || price_per_hour || (price_per_day / 24)));

            updates.push('is_available = ?, location = ?');
            params.push(is_available !== undefined ? (is_available ? 1 : 0) : 1, location || null);

            // Only update description and features if they are provided
            if (description !== undefined) {
                updates.push('description = ?');
                params.push(description || null);
            }

            if (features !== undefined) {
                updates.push('features = ?');
                params.push(featuresValue);
            }

            updates.push('updated_at = CURRENT_TIMESTAMP');

            params.push(id);

            const sql = `
                UPDATE vehicles 
                SET ${updates.join(', ')} 
                WHERE id = ?
            `;

            console.log('📊 Update SQL Parameters:', params);

            const result = await database.query(sql, params);

            console.log('✅ Vehicle updated, affected rows:', result.affectedRows);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('💥 Database error in update:', error);
            console.error('📝 Error details:', {
                message: error.message,
                sqlState: error.sqlState,
                errno: error.errno,
                code: error.code
            });
            throw error;
        }
    }

    async delete(id) {
        try {
            console.log(`🗑️ Deleting vehicle with ID: ${id}`);

            // Check if vehicle exists
            const existingVehicle = await this.findById(id);
            if (!existingVehicle) {
                throw new Error('Vehicle not found');
            }

            const sql = 'DELETE FROM vehicles WHERE id = ?';
            const result = await database.query(sql, [id]);
            
            console.log('✅ Vehicle deleted, affected rows:', result.affectedRows);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Database error in delete:', error);
            throw error;
        }
    }

    async search(query) {
        try {
            const searchTerm = `%${query}%`;
            console.log(`🔍 Searching vehicles for: ${query}`);

            const sql = `
                SELECT 
                    id, name, type, brand, model, year, capacity,
                    fuel_type, transmission, price_per_day, price_per_hour,
                    color, license_plate, daily_rate, hourly_rate,
                    is_available, location, description, features, images,
                    created_at, updated_at
                FROM vehicles 
                WHERE 
                    name LIKE ? OR 
                    brand LIKE ? OR 
                    model LIKE ? OR 
                    type LIKE ? OR
                    location LIKE ? OR
                    description LIKE ?
                ORDER BY created_at DESC
            `;
            
            const results = await database.query(sql, [
                searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm
            ]);
            
            console.log(`🔍 Search found ${results.length} vehicles`);
            return results;
        } catch (error) {
            console.error('Database error in search:', error);
            throw error;
        }
    }

    // Helper method to get available vehicles
    async findAvailable() {
        try {
            const sql = `
                SELECT 
                    id, name, type, brand, model, year, capacity,
                    fuel_type, transmission, price_per_day, price_per_hour,
                    color, license_plate, daily_rate, hourly_rate,
                    is_available, location, description, features, images,
                    created_at, updated_at
                FROM vehicles 
                WHERE is_available = 1
                ORDER BY created_at DESC
            `;
            
            const results = await database.query(sql);
            console.log(`✅ Found ${results.length} available vehicles`);
            return results;
        } catch (error) {
            console.error('Database error in findAvailable:', error);
            throw error;
        }
    }
}

module.exports = new VehicleModel();