// Import the User model
const User = require('../models/User');

// Find a user by their email address
const findByEmail = (email) => User.findOne({ email });

// Find a user by their username
const findByUsername = (username) => User.findOne({ username });

// Find a user by their  ID
const findById = (id) => User.findById(id).select('-password');

// Find a user by ID but INCLUDE the password field
const findByIdWithPassword = (id) => User.findById(id);

// Create a new user document in the database
const createUser = (data) => User.create(data);

// Update a user's profile fields
const updateUser = (id, data) =>
  User.findByIdAndUpdate(id, data, { new: true }).select('-password');

// Export all functions so controllers can use them
module.exports = {
  findByEmail,
  findByUsername,
  findById,
  findByIdWithPassword,
  createUser,
  updateUser,
};