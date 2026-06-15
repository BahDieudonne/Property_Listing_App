const { getPropertyById } = require('../repositories/propertyRepository');

// Middleware that verifies the logged-in user owns the property they want to modify
const verifyOwnership = async (req, res, next) => {
  try {
    const property = await getPropertyById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Compare the property's author ID with the logged-in user's ID
    if (property.author._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden: You do not own this listing' });
    }

    req.property = property;

    // Ownership confirmed
    next();
  } catch (err) {
    // Invalid MongoDB ID format causes an error, return 400 Bad Request
    return res.status(400).json({ message: 'Invalid property ID' });
  }
};

module.exports = { verifyOwnership };