// ============================================
// routes/auth.routes.js
// ============================================
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegistration, validateLogin } = require('../middleware/validator');

// Register new user
router.post('/register', validateRegistration, authController.register);

// User login
router.post('/login', validateLogin, authController.login);

// Admin login
router.post('/admin-login', validateLogin, authController.adminLogin);

module.exports = router;