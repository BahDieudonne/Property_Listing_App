const { getPropertyById } = require('../repositories/propertyRepository');

const verifyOwnership = async (req, res, next) => {
  try {
    const property = await getPropertyById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    if (property.author._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden: You do not own this listing' });
    }

    req.property = property;
    next();
  } catch (err) {
    return res.status(400).json({ message: 'Invalid property ID' });
  }
};

module.exports = { verifyOwnership };