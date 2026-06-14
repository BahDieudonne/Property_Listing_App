const Property = require('../models/Property');

const getAllProperties = (filters = {}) => {
  const query = {};
  if (filters.city) query.city = new RegExp(filters.city, 'i');
  if (filters.minPrice || filters.maxPrice) {
    query.price = {};
    if (filters.minPrice) query.price.$gte = Number(filters.minPrice);
    if (filters.maxPrice) query.price.$lte = Number(filters.maxPrice);
  }
  return Property.find(query)
    .populate('author', 'username name avatar')
    .sort({ createdAt: -1 });
};

const getPropertyById      = (id) => Property.findById(id).populate('author', 'username name avatar');
const getPropertiesByAuthor = (authorId) => Property.find({ author: authorId }).sort({ createdAt: -1 });
const createProperty       = (data) => Property.create(data);
const updateProperty       = (id, data) => Property.findByIdAndUpdate(id, data, { new: true, runValidators: true });
const deleteProperty       = (id) => Property.findByIdAndDelete(id);

module.exports = { getAllProperties, getPropertyById, getPropertiesByAuthor, createProperty, updateProperty, deleteProperty };