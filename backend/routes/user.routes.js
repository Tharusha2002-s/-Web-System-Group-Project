const express = require('express');
const router = express.Router();

// Get all users
router.get('/', (req, res) => {
    res.json({ 
        success: true,
        message: 'Users route - GET all users' 
    });
});

// Get user by ID
router.get('/:id', (req, res) => {
    res.json({ 
        success: true,
        message: `Get user with ID: ${req.params.id}` 
    });
});

module.exports = router;