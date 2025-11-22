// ============================================
// middleware/validator.js
// ============================================
const { body } = require('express-validator');

const validateRegistration = [
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').trim().notEmpty().withMessage('Phone is required')
];

const validateLogin = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
];

module.exports = { validateRegistration, validateLogin };