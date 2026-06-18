// Import the Property model
const Property = require('../models/Property');

// Fetch all properties with optional filters
const getAllProperties = (filters = {}) => {
  const query = {};

  if (filters.city) {
    query.city = new RegExp(filters.city, 'i');
  }

  if (filters.type) {
    query.type = filters.type;
  }

  if (filters.listingType) {
    query.listingType = filters.listingType;
  }

  if (filters.minPrice || filters.maxPrice) {
    query.price = {};
    if (filters.minPrice) query.price.$gte = Number(filters.minPrice);
    if (filters.maxPrice) query.price.$lte = Number(filters.maxPrice);
  }

  return Property.find(query)
    .populate('author', 'username name avatar')
    // Sort by newest first
    .sort({ createdAt: -1 });
};

// Fetch a single property by its ID
const getPropertyById = (id) =>
  Property.findById(id).populate('author', 'username name avatar');

// Fetch all properties belonging to a specific user
const getPropertiesByAuthor = (authorId) =>
  Property.find({ author: authorId }).sort({ createdAt: -1 });

// Create a new property document in the database
const createProperty = (data) => Property.create(data);

// Update a property by ID
const updateProperty = (id, data) =>
  Property.findByIdAndUpdate(id, data, { new: true, runValidators: true });

// Permanently delete a property document by ID
const deleteProperty = (id) => Property.findByIdAndDelete(id);

module.exports = {
  getAllProperties,
  getPropertyById,
  getPropertiesByAuthor,
  createProperty,
  updateProperty,
  deleteProperty,
};