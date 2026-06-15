// Import mongoose
const mongoose = require('mongoose');

// Async function to establish the MongoDB connection
const connectDB = async () => {
  try {
    // Connect using the URI from our .env file
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;