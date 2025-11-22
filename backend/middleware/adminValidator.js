const { body, param } = require('express-validator');

const validateCreateAdmin = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 255 })
        .withMessage('Name must be between 2 and 255 characters'),
    
    body('email')
        .isEmail()
        .withMessage('Valid email is required')
        .normalizeEmail(),
    
    body('role')
        .isIn(['Admin', 'Editor', 'Viewer'])
        .withMessage('Role must be Admin, Editor, or Viewer')
];

const validateUpdateAdmin = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Valid admin ID is required'),
    
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 255 })
        .withMessage('Name must be between 2 and 255 characters'),
    
    body('email')
        .optional()
        .isEmail()
        .withMessage('Valid email is required')
        .normalizeEmail(),
    
    body('role')
        .optional()
        .isIn(['Admin', 'Editor', 'Viewer'])
        .withMessage('Role must be Admin, Editor, or Viewer')
];

const validateAdminId = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Valid admin ID is required')
];

module.exports = {
    validateCreateAdmin,
    validateUpdateAdmin,
    validateAdminId
};