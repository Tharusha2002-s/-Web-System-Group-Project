// ============================================
// routes/admin.routes.js
// ============================================
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth.middleware');
const { validateCreateAdmin, validateUpdateAdmin, validateAdminId } = require('../middleware/adminValidator');

// All routes require admin authentication
router.use(authMiddleware.authenticateToken);
router.use(authMiddleware.requireAdmin);

// Admin management routes
router.get('/', adminController.getAllAdmins);
router.get('/search', adminController.searchAdmins);
router.get('/:id', validateAdminId, adminController.getAdminById);
router.post('/', validateCreateAdmin, adminController.createAdmin);
router.put('/:id', validateAdminId, validateUpdateAdmin, adminController.updateAdmin);
router.delete('/:id', validateAdminId, adminController.deleteAdmin);

module.exports = router;