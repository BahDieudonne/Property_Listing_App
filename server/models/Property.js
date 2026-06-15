const mongoose = require('mongoose');

// Define the structure of a property document in MongoDB
const propertySchema = new mongoose.Schema({
  title: {
    type:     String,
    required: true,
    trim:     true,
  },
  description: {
    type:     String,
    required: true,
  },
  price: {
    type:     Number,
    required: true,
    min:      0, // Price cannot be negative
  },
  city: {
    type:     String,
    required: true,
    trim:     true,
  },
  country: {
    type:     String,
    required: true,
    trim:     true,
  },
  type: {
    type:     String,
    enum:     ['Apartment', 'House', 'Studio'],
    required: true,
  },
  // Array of image filenames or URLs
  imageUrls: [{ type: String }],
  author: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'User',
    required: true,
  },
}, {
  // Automatically adds createdAt and updatedAt timestamps
  timestamps: true,
});

module.exports = mongoose.model('Property', propertySchema);