// ============================================
// routes/vehicle.routes.js
// ============================================
const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const authMiddleware = require('../middleware/auth.middleware');
const { validateCreateVehicle, validateUpdateVehicle, validateVehicleId } = require('../middleware/vehicleValidator');

// All routes require admin authentication
router.use(authMiddleware.authenticateToken);
router.use(authMiddleware.requireAdmin);

// Vehicle management routes
router.get('/', vehicleController.getAllVehicles);
router.get('/search', vehicleController.searchVehicles);
router.get('/:id', validateVehicleId, vehicleController.getVehicleById);
router.post('/', validateCreateVehicle, vehicleController.createVehicle);
router.put('/:id', validateVehicleId, validateUpdateVehicle, vehicleController.updateVehicle);
router.delete('/:id', validateVehicleId, vehicleController.deleteVehicle);

module.exports = router;