const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/property.Controller');
const { protect }         = require('../middleware/authMiddleware');
const { verifyOwnership } = require('../middleware/ownershipMiddleware');

// ===== PUBLIC ROUTES =====
router.get('/', ctrl.getAllProperties);

// Anyone can view a single property's details
router.get('/:id', ctrl.getPropertyById);

// ===== AUTHENTICATED ROUTES =====

// GET /api/properties/my-listings, returns only the user's own listings
router.get('/my-listings', protect, ctrl.getMyListings);

// POST /api/properties, create a new listing

// ===== OWNER-ONLY ROUTES =====
// PUT /api/properties/:id — update a listing
router.put('/:id', protect, verifyOwnership, ctrl.updateProperty);

// DELETE /api/properties/,  permanently remove a listing
router.delete('/:id', protect, verifyOwnership, ctrl.deleteProperty);

module.exports = router;