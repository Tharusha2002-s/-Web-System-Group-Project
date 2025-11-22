// ============================================
// middleware/vehicleValidator.js - UPDATED FOR ACTUAL SCHEMA
// ============================================
const { body, param } = require('express-validator');

const validateCreateVehicle = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Vehicle name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Vehicle name must be between 2 and 100 characters'),
    
    body('type')
        .isIn(['city_bike', 'mountain_bike', 'electric_scooter', 'compact_sedan', 
               'luxury_sedan', 'mid_size_suv', 'van', 'three_wheeler'])
        .withMessage('Valid vehicle type is required'),
    
    body('brand')
        .trim()
        .notEmpty()
        .withMessage('Brand is required'),
    
    body('model')
        .trim()
        .notEmpty()
        .withMessage('Model is required'),
    
    body('year')
        .isInt({ min: 2000, max: 2030 })
        .withMessage('Valid year is required'),
    
    body('price_per_day')
        .isFloat({ min: 0 })
        .withMessage('Valid daily price is required'),
    
    body('daily_rate')
        .isFloat({ min: 0 })
        .withMessage('Valid daily rate is required'),
    
    body('capacity')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Valid capacity is required'),
    
    body('location')
        .trim()
        .notEmpty()
        .withMessage('Location is required')
];

const validateUpdateVehicle = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Valid vehicle ID is required'),
    
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Vehicle name must be between 2 and 100 characters'),
    
    body('type')
        .optional()
        .isIn(['city_bike', 'mountain_bike', 'electric_scooter', 'compact_sedan', 
               'luxury_sedan', 'mid_size_suv', 'van', 'three_wheeler'])
        .withMessage('Valid vehicle type is required'),
    
    body('price_per_day')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Valid daily price is required'),
    
    body('daily_rate')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Valid daily rate is required'),
    
    body('capacity')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Valid capacity is required')
];

const validateVehicleId = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Valid vehicle ID is required')
];

module.exports = {
    validateCreateVehicle,
    validateUpdateVehicle,
    validateVehicleId
};