// ============================================
// controllers/vehicleController.js - ONLY FIX CREATE FUNCTION
// ============================================
const VehicleModel = require('../models/vehicleModel');
const { sendResponse, sendError } = require('../utils/responseHandler');
const { validationResult } = require('express-validator');

const vehicleController = {
    // Get all vehicles
    getAllVehicles: async (req, res) => {
        try {
            console.log('📋 Fetching all vehicles');
            
            const vehicles = await VehicleModel.findAll();
            
            return sendResponse(res, 'Vehicles fetched successfully', {
                vehicles: vehicles,
                total: vehicles.length
            });

        } catch (error) {
            console.error('💥 Error fetching vehicles:', error);
            return sendError(res, 'Failed to fetch vehicles', 500);
        }
    },

    // Get available vehicles
    getAvailableVehicles: async (req, res) => {
        try {
            console.log('📋 Fetching available vehicles');
            
            const vehicles = await VehicleModel.findAvailable();
            
            return sendResponse(res, 'Available vehicles fetched successfully', {
                vehicles: vehicles,
                total: vehicles.length
            });

        } catch (error) {
            console.error('💥 Error fetching available vehicles:', error);
            return sendError(res, 'Failed to fetch available vehicles', 500);
        }
    },

    // Get vehicle by ID
    getVehicleById: async (req, res) => {
        try {
            const { id } = req.params;
            console.log(`📋 Fetching vehicle with ID: ${id}`);

            const vehicle = await VehicleModel.findById(id);
            if (!vehicle) {
                return sendError(res, 'Vehicle not found', 404);
            }

            return sendResponse(res, 'Vehicle fetched successfully', {
                vehicle: vehicle
            });

        } catch (error) {
            console.error('💥 Error fetching vehicle:', error);
            return sendError(res, 'Failed to fetch vehicle', 500);
        }
    },

    // Create new vehicle - FIXED VERSION
    createVehicle: async (req, res) => {
        try {
            console.log('➕ Creating new vehicle:', req.body);

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return sendError(res, 'Validation failed', 400, errors.array());
            }

            // Use direct field names from frontend form
            const {
                name, type, brand, model, year, 
                price_per_day, price_per_hour, capacity, fuel_type,
                transmission, location, status, features
            } = req.body;

            console.log('📝 Received data:', {
                name, type, brand, model, year,
                price_per_day, price_per_hour, capacity, fuel_type,
                transmission, location, status, features
            });

            // Convert data to database schema
            const vehicleData = {
                name: name,
                type: type,
                brand: brand,
                model: model,
                year: parseInt(year),
                price_per_day: parseFloat(price_per_day),
                price_per_hour: price_per_hour ? parseFloat(price_per_hour) : null,
                capacity: parseInt(capacity) || 5,
                fuel_type: fuel_type || null,
                transmission: transmission || null,
                location: location,
                // Map status to is_available
                is_available: status === 'available' ? 1 : 0,
                daily_rate: parseFloat(price_per_day), // Use same as price_per_day
                hourly_rate: price_per_hour ? parseFloat(price_per_hour) : parseFloat(price_per_day) / 24,
                features: features || null
            };

            console.log('💾 Vehicle data for database:', vehicleData);

            const vehicleId = await VehicleModel.create(vehicleData);

            console.log('✅ Vehicle created with ID:', vehicleId);

            // Return the created vehicle data
            const newVehicle = await VehicleModel.findById(vehicleId);
            
            return sendResponse(res, 'Vehicle created successfully', {
                vehicle: newVehicle
            }, 201);

        } catch (error) {
            console.error('💥 Error creating vehicle:', error);
            return sendError(res, 'Failed to create vehicle: ' + error.message, 500);
        }
    },

    // Update vehicle
    updateVehicle: async (req, res) => {
        try {
            const { id } = req.params;
            console.log(`✏️ Updating vehicle with ID: ${id}`, req.body);

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return sendError(res, 'Validation failed', 400, errors.array());
            }

            // Map frontend field names to database column names
            const {
                vehicleName, vehicleType, vehicleBrand, vehicleModel, vehicleYear, 
                vehiclePrice, vehiclePriceHour, vehicleCapacity, vehicleFuelType,
                vehicleTransmission, vehicleLocation, vehicleStatus, vehicleFeatures
            } = req.body;

            // Convert frontend data to database schema
            const vehicleData = {
                name: vehicleName,
                type: vehicleType,
                brand: vehicleBrand,
                model: vehicleModel,
                year: parseInt(vehicleYear),
                price_per_day: parseFloat(vehiclePrice),
                price_per_hour: vehiclePriceHour ? parseFloat(vehiclePriceHour) : null,
                capacity: parseInt(vehicleCapacity) || 5,
                fuel_type: vehicleFuelType || null,
                transmission: vehicleTransmission || null,
                location: vehicleLocation,
                // Map status to is_available
                is_available: vehicleStatus === 'available' ? 1 : 0,
                daily_rate: parseFloat(vehiclePrice),
                hourly_rate: vehiclePriceHour ? parseFloat(vehiclePriceHour) : parseFloat(vehiclePrice) / 24,
                features: vehicleFeatures || null
            };

            console.log('💾 Mapped update data for database:', vehicleData);

            const updated = await VehicleModel.update(id, vehicleData);

            if (!updated) {
                return sendError(res, 'Failed to update vehicle', 500);
            }

            console.log('✅ Vehicle updated:', id);

            // Return the updated vehicle data
            const updatedVehicle = await VehicleModel.findById(id);
            
            return sendResponse(res, 'Vehicle updated successfully', {
                vehicle: updatedVehicle
            });

        } catch (error) {
            console.error('💥 Error updating vehicle:', error);
            return sendError(res, 'Failed to update vehicle: ' + error.message, 500);
        }
    },

    // Delete vehicle
    deleteVehicle: async (req, res) => {
        try {
            const { id } = req.params;
            console.log(`🗑️ Deleting vehicle with ID: ${id}`);

            const deleted = await VehicleModel.delete(id);
            if (!deleted) {
                return sendError(res, 'Failed to delete vehicle', 500);
            }

            console.log('✅ Vehicle deleted:', id);

            return sendResponse(res, 'Vehicle deleted successfully');

        } catch (error) {
            console.error('💥 Error deleting vehicle:', error);
            return sendError(res, 'Failed to delete vehicle: ' + error.message, 500);
        }
    },

    // Search vehicles
    searchVehicles: async (req, res) => {
        try {
            const { query } = req.query;
            console.log(`🔍 Searching vehicles for: ${query}`);

            if (!query || query.trim() === '') {
                return vehicleController.getAllVehicles(req, res);
            }

            const vehicles = await VehicleModel.search(query.trim());
            
            return sendResponse(res, 'Vehicles search completed', {
                vehicles: vehicles,
                total: vehicles.length,
                searchQuery: query
            });

        } catch (error) {
            console.error('💥 Error searching vehicles:', error);
            return sendError(res, 'Failed to search vehicles', 500);
        }
    }
};

module.exports = vehicleController;