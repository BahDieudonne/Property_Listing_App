const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/property.Controller');
const { protect }         = require('../middleware/auth.Middleware');
const { verifyOwnership } = require('../middleware/ownership.Middleware');
const upload              = require('../middleware/upload.Middleware');

// ===== PUBLIC ROUTES =====
router.get('/', ctrl.getAllProperties);

// ===== AUTHENTICATED ROUTES =====

// GET /api/properties/my-listings — must be before /:id
router.get('/my-listings', protect, ctrl.getMyListings);

// POST /api/properties — up to 5 images via multipart/form-data
router.post('/', protect, upload.array('images', 5), ctrl.createProperty);

// Anyone can view a single property's details
router.get('/:id', ctrl.getPropertyById);

// ===== OWNER-ONLY ROUTES =====
router.put('/:id',    protect, verifyOwnership, upload.array('images', 5), ctrl.updateProperty);
router.delete('/:id', protect, verifyOwnership, ctrl.deleteProperty);

module.exports = router;
