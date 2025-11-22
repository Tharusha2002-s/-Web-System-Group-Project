// ============================================
// controllers/authController.js
// ============================================
const UserModel = require('../models/userModel');
const AdminModel = require('../models/adminModel');
const { generateToken } = require('../utils/tokenGenerator');
const { sendResponse, sendError } = require('../utils/responseHandler');
const { validationResult } = require('express-validator');

const authController = {
    // User Registration
    register: async (req, res) => {
        try {
            console.log('📝 Registration request:', req.body);

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return sendError(res, 'Validation failed', 400, errors.array());
            }

            const { firstName, lastName, email, password, phone, dateOfBirth } = req.body;

            // Check if user exists
            const existingUser = await UserModel.findByEmail(email);
            if (existingUser) {
                return sendError(res, 'User already exists with this email', 409);
            }

            // Create user
            const userId = await UserModel.create({
                firstName,
                lastName,
                email,
                password,
                phone,
                dateOfBirth: dateOfBirth || '1990-01-01'
            });

            // Generate token
            const token = generateToken({ 
                userId: userId, 
                email: email,
                role: 'user'
            });

            console.log('✅ User registered:', userId);

            return sendResponse(res, 'User registered successfully', {
                user: {
                    id: userId,
                    firstName,
                    lastName,
                    email,
                    phone,
                    role: 'user'
                },
                token
            }, 201);

        } catch (error) {
            console.error('💥 Registration error:', error);
            return sendError(res, 'Server error during registration', 500);
        }
    },

    // User Login
    login: async (req, res) => {
        try {
            console.log('🔐 Login attempt:', req.body.email);

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return sendError(res, 'Validation failed', 400, errors.array());
            }

            const { email, password } = req.body;

            // Find user
            const user = await UserModel.findByEmail(email);
            if (!user) {
                return sendError(res, 'Invalid email or password', 401);
            }

            // Check if active
            if (!user.is_active) {
                return sendError(res, 'Account is deactivated', 401);
            }

            // Verify password
            const isValid = await UserModel.comparePassword(password, user.password);
            if (!isValid) {
                return sendError(res, 'Invalid email or password', 401);
            }

            // Update last login
            await UserModel.updateLastLogin(user.id);

            // Generate token
            const token = generateToken({ 
                userId: user.id, 
                email: user.email,
                role: 'user'
            });

            console.log('✅ User logged in:', user.email);

            return sendResponse(res, 'Login successful', {
                user: {
                    id: user.id,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    email: user.email,
                    phone: user.phone,
                    role: 'user'
                },
                token
            });

        } catch (error) {
            console.error('💥 Login error:', error);
            return sendError(res, 'Server error during login', 500);
        }
    },

    // Admin Login - FIXED VERSION
    adminLogin: async (req, res) => {
        try {
            console.log('👨‍💼 Admin login attempt:', req.body.email);

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return sendError(res, 'Validation failed', 400, errors.array());
            }

            const { email, password } = req.body;

            console.log('🔍 Looking for admin with email:', email);

            // Find admin
            let admin = await AdminModel.findByEmail(email);
            console.log('📊 Admin found:', admin ? `Yes (ID: ${admin.id})` : 'No');

            // Create default admin if doesn't exist
            if (!admin && email === 'admin@reliantrental.com') {
                console.log('🆕 Creating default admin...');
                const adminId = await AdminModel.create({
                    name: 'Super Admin',
                    email: 'admin@reliantrental.com',
                    password: 'admin123',
                    role: 'Admin'
                });
                admin = await AdminModel.findById(adminId);
                console.log('✅ Default admin created with ID:', adminId);
            }

            if (!admin) {
                console.log('❌ No admin found with email:', email);
                return sendError(res, 'Invalid email or password', 401);
            }

            console.log('🔐 Verifying password for admin:', admin.email);
            
            // Verify password
            const isValid = await AdminModel.comparePassword(password, admin.password);
            console.log('✅ Password valid:', isValid);

            if (!isValid) {
                console.log('❌ Password verification failed for admin:', admin.email);
                return sendError(res, 'Invalid email or password', 401);
            }

            // Update last login
            await AdminModel.updateLastLogin(admin.id);

            // Generate token - FIXED: Use consistent payload structure
            const token = generateToken({ 
                adminId: admin.id, 
                email: admin.email,
                role: admin.role,
                name: admin.name
            });

            console.log('✅ Admin logged in successfully:', admin.email);
            console.log('🔑 Token generated for admin ID:', admin.id);

            return sendResponse(res, 'Admin login successful', {
                user: {
                    id: admin.id,
                    name: admin.name,
                    email: admin.email,
                    role: admin.role
                },
                token
            });

        } catch (error) {
            console.error('💥 Admin login error:', error);
            return sendError(res, 'Server error during admin login', 500);
        }
    }
};

module.exports = authController;