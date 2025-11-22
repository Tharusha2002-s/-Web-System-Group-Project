// ============================================
// controllers/adminController.js
// ============================================
const AdminModel = require('../models/adminModel');
const { sendResponse, sendError } = require('../utils/responseHandler');
const { validationResult } = require('express-validator');

const adminController = {
    // Get all admins
    getAllAdmins: async (req, res) => {
        try {
            console.log('📋 Fetching all admins');
            
            const admins = await AdminModel.findAll();
            
            return sendResponse(res, 'Admins fetched successfully', {
                data: admins,
                total: admins.length
            });

        } catch (error) {
            console.error('💥 Error fetching admins:', error);
            return sendError(res, 'Failed to fetch admins', 500);
        }
    },

    // Get admin by ID
    getAdminById: async (req, res) => {
        try {
            const { id } = req.params;
            console.log(`📋 Fetching admin with ID: ${id}`);

            const admin = await AdminModel.findById(id);
            if (!admin) {
                return sendError(res, 'Admin not found', 404);
            }

            return sendResponse(res, 'Admin fetched successfully', {
                data: admin
            });

        } catch (error) {
            console.error('💥 Error fetching admin:', error);
            return sendError(res, 'Failed to fetch admin', 500);
        }
    },

    // Create new admin
    createAdmin: async (req, res) => {
        try {
            console.log('➕ Creating new admin:', req.body);

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return sendError(res, 'Validation failed', 400, errors.array());
            }

            const { name, email, role } = req.body;

            // Check if email already exists
            const emailExists = await AdminModel.emailExists(email);
            if (emailExists) {
                return sendError(res, 'Email already exists', 409);
            }

            // Generate default password
            const defaultPassword = 'password123';
            
            const adminId = await AdminModel.create({
                name,
                email,
                password: defaultPassword,
                role: role || 'Viewer'
            });

            console.log('✅ Admin created:', adminId);

            return sendResponse(res, 'Admin created successfully', {
                adminId
            }, 201);

        } catch (error) {
            console.error('💥 Error creating admin:', error);
            return sendError(res, 'Failed to create admin', 500);
        }
    },

    // Update admin
    updateAdmin: async (req, res) => {
        try {
            const { id } = req.params;
            console.log(`✏️ Updating admin with ID: ${id}`, req.body);

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return sendError(res, 'Validation failed', 400, errors.array());
            }

            const { name, email, role } = req.body;

            // Check if admin exists
            const existingAdmin = await AdminModel.findById(id);
            if (!existingAdmin) {
                return sendError(res, 'Admin not found', 404);
            }

            // Check if email exists for other admins
            const emailExists = await AdminModel.emailExists(email, id);
            if (emailExists) {
                return sendError(res, 'Email already exists for another admin', 409);
            }

            const updated = await AdminModel.update(id, { name, email, role });
            if (!updated) {
                return sendError(res, 'Failed to update admin', 500);
            }

            console.log('✅ Admin updated:', id);

            return sendResponse(res, 'Admin updated successfully');

        } catch (error) {
            console.error('💥 Error updating admin:', error);
            return sendError(res, 'Failed to update admin', 500);
        }
    },

    // Delete admin
    deleteAdmin: async (req, res) => {
        try {
            const { id } = req.params;
            console.log(`🗑️ Deleting admin with ID: ${id}`);

            // Prevent deleting yourself
            if (parseInt(id) === req.admin.id) {
                return sendError(res, 'Cannot delete your own account', 400);
            }

            // Check if admin exists
            const existingAdmin = await AdminModel.findById(id);
            if (!existingAdmin) {
                return sendError(res, 'Admin not found', 404);
            }

            const deleted = await AdminModel.delete(id);
            if (!deleted) {
                return sendError(res, 'Failed to delete admin', 500);
            }

            console.log('✅ Admin deleted:', id);

            return sendResponse(res, 'Admin deleted successfully');

        } catch (error) {
            console.error('💥 Error deleting admin:', error);
            return sendError(res, 'Failed to delete admin', 500);
        }
    },

    // Search admins
    searchAdmins: async (req, res) => {
        try {
            const { query } = req.query;
            console.log(`🔍 Searching admins for: ${query}`);

            if (!query || query.trim() === '') {
                return adminController.getAllAdmins(req, res);
            }

            const admins = await AdminModel.search(query.trim());
            
            return sendResponse(res, 'Admins search completed', {
                data: admins,
                total: admins.length,
                searchQuery: query
            });

        } catch (error) {
            console.error('💥 Error searching admins:', error);
            return sendError(res, 'Failed to search admins', 500);
        }
    }
};

module.exports = adminController;