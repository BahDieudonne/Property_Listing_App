const User = require('../models/User');

const findByEmail = (email) => User.findOne({ email });
const findByUsername = (username) => User.findOne({ username });
const findById = (id) => User.findById(id).select('-password');
const createUser = (data) => User.create(data);
const updateUser = (id, data) => User.findByIdAndUpdate(id, data, { new: true }).select('-password');
const findByIdWithPassword = (id) => User.findById(id);

module.exports = { findByEmail, findByUsername, findById, createUser, updateUser, findByIdWithPassword };