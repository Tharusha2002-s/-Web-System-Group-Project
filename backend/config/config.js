// ============================================
// config/config.js - Configuration
// ============================================
require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    
    // MySQL Database
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: process.env.DB_PORT || 3306,
    DB_USER: process.env.DB_USER || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_NAME: process.env.DB_NAME || 'vehicle_rental',
    
    // JWT
    JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
    
    // CORS
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000'
};