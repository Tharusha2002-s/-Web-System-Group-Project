// ============================================
// middleware/auth.middleware.js
// ============================================
const jwt = require('jsonwebtoken');
const database = require('../config/db');
const config = require('../config/config');
const { verifyToken } = require('../utils/tokenGenerator');

class AuthMiddleware {
    async authenticateToken(req, res, next) {
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

            console.log('🔐 Auth middleware - Token received:', token ? 'Yes' : 'No');

            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: 'Access token required'
                });
            }

            // Verify token
            const decoded = verifyToken(token);
            console.log('🔍 Decoded token:', decoded);

            // Check if it's an admin token
            if (decoded.adminId) {
                console.log('👨‍💼 Admin token detected, adminId:', decoded.adminId);
                
                // Admin token - verify admin exists
                const admin = await database.query(
                    'SELECT id, name, email, role FROM admins WHERE id = ?',
                    [decoded.adminId]
                );

                console.log('📊 Admin found in database:', admin.length > 0);

                if (!admin.length) {
                    return res.status(401).json({
                        success: false,
                        message: 'Admin not found'
                    });
                }

                req.admin = admin[0];
                console.log('✅ Admin authenticated:', req.admin.email);
                
            } else if (decoded.userId) {
                // User token (for future use)
                console.log('👤 User token detected, userId:', decoded.userId);
                return res.status(403).json({
                    success: false,
                    message: 'Admin access required'
                });
            } else {
                console.log('❌ Invalid token structure');
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token'
                });
            }

            next();
        } catch (error) {
            console.error('💥 Auth middleware error:', error.message);
            
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: 'Token expired'
                });
            }
            
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token'
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Authentication error'
            });
        }
    }

    requireAdmin(req, res, next) {
        if (!req.admin) {
            return res.status(403).json({
                success: false,
                message: 'Admin access required'
            });
        }

        console.log('✅ Admin authorization passed:', req.admin.email);
        next();
    }
}

module.exports = new AuthMiddleware();