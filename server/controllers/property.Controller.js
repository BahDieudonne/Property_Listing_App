// Import all repository functions for property database operations
const repo = require('../repositories/propertyRepository');

// ===== GET ALL PROPERTIES  =====
const getAllProperties = async (req, res) => {
  const { city, minPrice, maxPrice } = req.query;

  const properties = await repo.getAllProperties({ city, minPrice, maxPrice });
  res.status(200).json(properties);
};

// ===== GET SINGLE PROPERTY  =====
// GET /api/properties/:id
const getPropertyById = async (req, res) => {
  const property = await repo.getPropertyById(req.params.id);

  if (!property) return res.status(404).json({ message: 'Property not found' });
  res.status(200).json(property);
};

// ===== GET MY LISTINGS (Private) =====
// GET /api/properties/my-listings
const getMyListings = async (req, res) => {
  const properties = await repo.getPropertiesByAuthor(req.user._id);
  res.status(200).json(properties);
};

// ===== CREATE PROPERTY (Private) =====
// POST /api/properties
const createProperty = async (req, res) => {
  const { title, description, price, city, country, type, imageUrls } = req.body;

  // Validate that all required fields are present
  if (!title || !description || !price || !city || !country || !type) {
    return res.status(400).json({ message: 'All required fields must be provided' });
  }

  const property = await repo.createProperty({
    title,
    description,
    price,
    city,
    country,
    type,
    imageUrls: imageUrls || [],
    author: req.user._id,       
  });

  res.status(201).json(property);
};

// ===== UPDATE PROPERTY (Owner only) =====
// PUT /api/properties/:id
const updateProperty = async (req, res) => {
  const { title, description, price, city, country, type, imageUrls } = req.body;

  const updated = await repo.updateProperty(req.params.id, {
    title, description, price, city, country, type, imageUrls,
  });

  res.status(200).json(updated);
};

// ===== DELETE PROPERTY (Owner only) =====
// DELETE /api/properties/:id
const deleteProperty = async (req, res) => {
  await repo.deleteProperty(req.params.id);
  res.status(200).json({ message: 'Property deleted successfully' });
};

module.exports = {
  getAllProperties,
  getPropertyById,
  getMyListings,
  createProperty,
  updateProperty,
  deleteProperty,
};