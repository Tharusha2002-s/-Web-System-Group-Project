// ============================================
// utils/tokenGenerator.js
// ============================================
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const generateToken = (payload, expiresIn = config.JWT_EXPIRE) => {
    try {
        console.log('🔑 Generating token with payload:', payload);
        const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn });
        console.log('✅ Token generated successfully');
        return token;
    } catch (error) {
        console.error('💥 Token generation error:', error);
        throw error;
    }
};

const verifyToken = (token) => {
    try {
        console.log('🔍 Verifying token...');
        const decoded = jwt.verify(token, config.JWT_SECRET);
        console.log('✅ Token verified successfully:', decoded);
        return decoded;
    } catch (error) {
        console.error('💥 Token verification error:', error);
        throw error;
    }
};

module.exports = { generateToken, verifyToken };